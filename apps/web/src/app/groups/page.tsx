"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NewGroupForm } from "@/components/groups/NewGroupForm";
import { useGroups } from "@/hooks/useGroups";
import { useRealtime } from "@/hooks/useRealtime";

function UsersGroupIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 10.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25ZM15.75 10.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 19.125c0-3.107 2.393-5.625 5.35-5.625h1.3c1.396 0 2.665.567 3.6 1.494M21.75 19.125c0-3.107-2.393-5.625-5.35-5.625h-1.3c-1.396 0-2.665.567-3.6 1.494M12 19.5v-1.125c0-2.485-2.015-4.5-4.5-4.5h-.15"
      />
    </svg>
  );
}

function GroupsView() {
  useRealtime();
  const { data: groups, isLoading } = useGroups();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-ink">Your groups</h1>
        <Button className="w-full" onClick={() => setIsCreating(true)}>
          New group
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : groups?.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <UsersGroupIcon className="h-9 w-9 text-terracotta/35" />
          <p className="text-sm text-ink-soft">You are not part of any group yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {groups?.map((group, index) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="animate-fade-slide-in block"
              style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
            >
              <Card interactive>
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
