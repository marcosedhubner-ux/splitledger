import { prisma } from "../../db/client.js";
import { assertMembership } from "../groups/groups.service.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../domain/errors.js";
import { toCents, toDollars } from "../../domain/money.js";
import type { CreateExpenseInput } from "./expenses.schema.js";

async function assertGroupMembers(groupId: string, userIds: string[]): Promise<void> {
  const members = await prisma.groupMember.findMany({
    where: { groupId, userId: { in: userIds } },
    select: { userId: true },
  });
  if (members.length !== new Set(userIds).size) {
    throw new NotFoundError("One or more participants are not members of this group");
  }
}

function splitEqually(amountCents: number, participantIds: string[]): { userId: string; shareCents: number }[] {
  const sortedIds = [...participantIds].sort();
  const baseShare = Math.floor(amountCents / sortedIds.length);
  const remainder = amountCents - baseShare * sortedIds.length;

  return sortedIds.map((userId, index) => ({
    userId,
    shareCents: baseShare + (index < remainder ? 1 : 0),
  }));
}

export async function createExpense(groupId: string, input: CreateExpenseInput, requesterId: string) {
  await assertMembership(groupId, requesterId);

  const paidById = input.paidById ?? requesterId;
  const amountCents = toCents(input.amount);

  let shares: { userId: string; shareCents: number }[];

  if (input.split.type === "EQUAL") {
    await assertGroupMembers(groupId, [paidById, ...input.split.participantIds]);
    shares = splitEqually(amountCents, input.split.participantIds);
  } else {
    const userIds = input.split.shares.map((s) => s.userId);
    await assertGroupMembers(groupId, [paidById, ...userIds]);

    shares = input.split.shares.map((s) => ({ userId: s.userId, shareCents: toCents(s.amount) }));
    const totalShareCents = shares.reduce((sum, s) => sum + s.shareCents, 0);
    if (totalShareCents !== amountCents) {
      throw new ConflictError(
        `Shares add up to ${toDollars(totalShareCents)}, but the expense is ${toDollars(amountCents)}`
      );
    }
  }

  return prisma.expense.create({
    data: {
      groupId,
      description: input.description,
      amount: input.amount,
      paidById,
      splits: {
        create: shares.map((s) => ({ userId: s.userId, shareAmount: toDollars(s.shareCents) })),
      },
    },
    include: {
      paidBy: { select: { id: true, fullName: true } },
      splits: { include: { user: { select: { id: true, fullName: true } } } },
    },
  });
}

export async function deleteExpense(groupId: string, expenseId: string, requesterId: string) {
  await assertMembership(groupId, requesterId);

  const expense = await prisma.expense.findFirst({ where: { id: expenseId, groupId } });
  if (!expense) {
    throw new NotFoundError("Expense");
  }
  if (expense.paidById !== requesterId) {
    throw new ForbiddenError("Only the person who paid can delete this expense");
  }

  await prisma.expense.delete({ where: { id: expenseId } });
}
