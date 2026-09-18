"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
        <h1 className="text-2xl font-bold text-ink">Your groups</h1>
        <Button onClick={() => setIsCreating(true)}>New group</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : groups?.length === 0 ? (
        <p className="text-sm text-ink-soft">You are not part of any group yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {groups?.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <Card className="transition-shadow hover:shadow-[0_4px_20px_rgba(36,31,26,0.12)]">
                <p className="font-semibold text-ink">{group.name}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  {group.members.length} member{group.members.length === 1 ? "" : "s"}
                </p>
              </Card>
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
