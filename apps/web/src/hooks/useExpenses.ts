import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ExpenseInfo } from "@/lib/types";

type ExpenseSplitInput =
  | { type: "EQUAL"; participantIds: string[] }
  | { type: "CUSTOM"; shares: { userId: string; amount: number }[] };

export function useCreateExpense(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { description: string; amount: number; paidById?: string; split: ExpenseSplitInput }) =>
      apiClient.post<{ expense: ExpenseInfo }>(`/groups/${groupId}/expenses`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}

export function useDeleteExpense(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) => apiClient.delete(`/groups/${groupId}/expenses/${expenseId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}
