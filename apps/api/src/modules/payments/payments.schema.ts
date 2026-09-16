import { z } from "zod";

export const recordPaymentSchema = z.object({
  toUserId: z.string().cuid(),
  amount: z.number().positive().max(1_000_000),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
