"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

export function useRealtime(groupId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (payload: { groupId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      if (!groupId || payload.groupId === groupId) {
        queryClient.invalidateQueries({ queryKey: ["groups", payload.groupId] });
      }
    };

    socket.on("group:updated", handleUpdate);
    return () => {
      socket.off("group:updated", handleUpdate);
    };
  }, [groupId, queryClient]);
}
