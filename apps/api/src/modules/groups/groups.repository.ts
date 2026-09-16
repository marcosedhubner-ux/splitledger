import { prisma } from "../../db/client.js";
import type { Prisma } from "@prisma/client";

const groupDetailInclude = {
  members: { include: { user: { select: { id: true, fullName: true, email: true } } } },
  expenses: {
    include: {
      paidBy: { select: { id: true, fullName: true } },
      splits: { include: { user: { select: { id: true, fullName: true } } } },
    },
    orderBy: { createdAt: "desc" },
  },
  payments: {
    include: {
      fromUser: { select: { id: true, fullName: true } },
      toUser: { select: { id: true, fullName: true } },
    },
    orderBy: { settledAt: "desc" },
  },
} satisfies Prisma.GroupInclude;

export function findGroupsForUser(userId: string) {
  return prisma.group.findMany({
    where: { members: { some: { userId } } },
    include: { members: { select: { userId: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function findGroupDetail(groupId: string) {
  return prisma.group.findUnique({ where: { id: groupId }, include: groupDetailInclude });
}

export function findMembership(groupId: string, userId: string) {
  return prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } });
}

export async function createGroup(name: string, currency: string, creatorId: string) {
  const group = await prisma.group.create({
    data: {
      name,
      currency,
      createdById: creatorId,
      members: { create: { userId: creatorId } },
    },
  });
  return group;
}

export function addMember(groupId: string, userId: string) {
  return prisma.groupMember.create({ data: { groupId, userId } });
}

export const detailInclude = groupDetailInclude;
