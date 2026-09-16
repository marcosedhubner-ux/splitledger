import { z } from "zod";

export const createExpenseSchema = z.object({
  description: z.string().min(1).max(160),
  amount: z.number().positive().max(1_000_000),
  paidById: z.string().cuid().optional(),
  split: z.discriminatedUnion("type", [
    z.object({ type: z.literal("EQUAL"), participantIds: z.array(z.string().cuid()).min(1) }),
    z.object({
      type: z.literal("CUSTOM"),
      shares: z.array(z.object({ userId: z.string().cuid(), amount: z.number().positive() })).min(1),
    }),
  ]),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
