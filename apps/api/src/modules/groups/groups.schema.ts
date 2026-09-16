import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(2).max(120),
  currency: z.string().length(3).default("USD"),
});

export const addMemberSchema = z.object({
  email: z.string().email(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
