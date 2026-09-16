import { prisma } from "../../db/client.js";
import { assertMembership } from "../groups/groups.service.js";
import { ConflictError, NotFoundError } from "../../domain/errors.js";
import type { RecordPaymentInput } from "./payments.schema.js";

export async function recordPayment(groupId: string, input: RecordPaymentInput, requesterId: string) {
  await assertMembership(groupId, requesterId);

  if (input.toUserId === requesterId) {
    throw new ConflictError("You cannot record a payment to yourself");
  }

  const recipientIsMember = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: input.toUserId } },
  });
  if (!recipientIsMember) {
    throw new NotFoundError("Recipient is not a member of this group");
  }

  return prisma.payment.create({
    data: {
      groupId,
      fromUserId: requesterId,
      toUserId: input.toUserId,
      amount: input.amount,
    },
    include: {
      fromUser: { select: { id: true, fullName: true } },
      toUser: { select: { id: true, fullName: true } },
    },
  });
}
