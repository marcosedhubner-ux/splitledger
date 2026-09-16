"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { NewGroupForm } from "@/components/groups/NewGroupForm";
import { useGroups } from "@/hooks/useGroups";
import { useRealtime } from "@/hooks/useRealtime";

function GroupsView() {
  useRealtime();
  const { data: groups, isLoading } = useGroups();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your groups</h1>
        <Button onClick={() => setIsCreating(true)}>New group</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : groups?.length === 0 ? (
        <p className="text-sm text-slate-400">You are not part of any group yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {groups?.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <p className="font-semibold text-slate-900">{group.name}</p>
              <p className="mt-1 text-xs text-slate-400">
                {group.members.length} member{group.members.length === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {isCreating && <NewGroupForm onClose={() => setIsCreating(false)} />}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <AuthGuard>
      <GroupsView />
    </AuthGuard>
  );
}
