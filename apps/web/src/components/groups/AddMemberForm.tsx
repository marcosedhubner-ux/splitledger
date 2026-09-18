"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useAddMember } from "@/hooks/useGroups";
import { ApiError } from "@/lib/apiClient";

export function AddMemberForm({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const addMember = useAddMember(groupId);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    addMember.mutate(email, {
      onSuccess: onClose,
      onError: (err) => {
        setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
      },
    });
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-ink">Add a member</h2>
        <p className="mt-1 text-sm text-ink-soft">They need an existing Tab account.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="email"
            required
            autoFocus
            placeholder="friend@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
          />

          {errorMessage && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{errorMessage}</p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={addMember.isPending}>
              {addMember.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
