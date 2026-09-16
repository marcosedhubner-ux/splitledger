import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { PaymentInfo } from "@/lib/types";

export function useRecordPayment(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { toUserId: string; amount: number }) =>
      apiClient.post<{ payment: PaymentInfo }>(`/groups/${groupId}/payments`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}
