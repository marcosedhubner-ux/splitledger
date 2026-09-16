import { Prisma } from "@prisma/client";
import { prisma } from "../../db/client.js";
import * as groupsRepository from "./groups.repository.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../domain/errors.js";
import { simplifyDebts } from "../../domain/debtSimplification.js";
import { toCents, toDollars } from "../../domain/money.js";
import type { CreateGroupInput } from "./groups.schema.js";

type GroupDetail = NonNullable<Awaited<ReturnType<typeof groupsRepository.findGroupDetail>>>;

export function listGroups(userId: string) {
  return groupsRepository.findGroupsForUser(userId);
}

export async function createGroup(input: CreateGroupInput, creatorId: string) {
  return groupsRepository.createGroup(input.name, input.currency, creatorId);
}

export async function assertMembership(groupId: string, userId: string) {
  const membership = await groupsRepository.findMembership(groupId, userId);
  if (!membership) {
    throw new ForbiddenError("You are not a member of this group");
  }
}

export function computeBalances(group: GroupDetail) {
  const balancesCents = new Map<string, number>();
  for (const member of group.members) {
    balancesCents.set(member.userId, 0);
  }

  for (const expense of group.expenses) {
    const amountCents = toCents(Number(expense.amount));
    balancesCents.set(expense.paidById, (balancesCents.get(expense.paidById) ?? 0) + amountCents);

    for (const split of expense.splits) {
      const shareCents = toCents(Number(split.shareAmount));
      balancesCents.set(split.userId, (balancesCents.get(split.userId) ?? 0) - shareCents);
    }
  }

  for (const payment of group.payments) {
    const amountCents = toCents(Number(payment.amount));
    balancesCents.set(payment.fromUserId, (balancesCents.get(payment.fromUserId) ?? 0) + amountCents);
    balancesCents.set(payment.toUserId, (balancesCents.get(payment.toUserId) ?? 0) - amountCents);
  }

  return Array.from(balancesCents.entries()).map(([userId, amountCents]) => ({
    userId,
    balance: toDollars(amountCents),
  }));
}

export async function getGroupDetail(groupId: string, requesterId: string) {
  await assertMembership(groupId, requesterId);

  const group = await groupsRepository.findGroupDetail(groupId);
  if (!group) {
    throw new NotFoundError("Group");
  }

  const balances = computeBalances(group);
  const settlements = simplifyDebts(
    balances.map((b) => ({ userId: b.userId, amountCents: toCents(b.balance) }))
  ).map((s) => ({ ...s, amount: toDollars(s.amountCents) }));

  return { group, balances, settlements };
}

export async function addMemberByEmail(groupId: string, email: string, requesterId: string) {
  await assertMembership(groupId, requesterId);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new NotFoundError("No user with that email");
  }

  try {
    return await groupsRepository.addMember(groupId, user.id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError("This person is already a member of the group");
    }
    throw err;
  }
}
