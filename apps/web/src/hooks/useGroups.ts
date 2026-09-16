import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { GroupDetailResponse, GroupSummary } from "@/lib/types";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.get<{ groups: GroupSummary[] }>("/groups"),
    select: (data) => data.groups,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; currency: string }) =>
      apiClient.post<{ group: GroupSummary }>("/groups", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });
}

export function useGroupDetail(groupId: string) {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: () => apiClient.get<GroupDetailResponse>(`/groups/${groupId}`),
    enabled: Boolean(groupId),
  });
}

export function useAddMember(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => apiClient.post(`/groups/${groupId}/members`, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
