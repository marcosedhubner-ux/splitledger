"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCreateGroup } from "@/hooks/useGroups";
import { ApiError } from "@/lib/apiClient";

export function NewGroupForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const createGroup = useCreateGroup();
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    createGroup.mutate(
      { name, currency: "USD" },
      {
        onSuccess: (data) => {
          onClose();
          router.push(`/groups/${data.group.id}`);
        },
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30" onClick={onClose}>
      <div
        className="animate-fade-slide-in w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-ink">New group</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink">Group name</label>
            <input
              required
              autoFocus
              placeholder="Lisbon Trip"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-[260ms] focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 focus:shadow-[0_0_0_4px_rgba(217,96,63,0.12)]"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{errorMessage}</p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={createGroup.isPending}>
              {createGroup.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
