"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateExpense } from "@/hooks/useExpenses";
import { ApiError } from "@/lib/apiClient";
import type { GroupMemberInfo } from "@/lib/types";

export function NewExpenseForm({
  groupId,
  members,
  currentUserId,
  onClose,
}: {
  groupId: string;
  members: GroupMemberInfo[];
  currentUserId: string;
  onClose: () => void;
}) {
  const createExpense = useCreateExpense(groupId);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [paidById, setPaidById] = useState(currentUserId);
  const [participantIds, setParticipantIds] = useState<string[]>(members.map((m) => m.userId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleParticipant(userId: string) {
    setParticipantIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (participantIds.length === 0) {
      setErrorMessage("Select at least one participant");
      return;
    }

    createExpense.mutate(
      { description, amount, paidById, split: { type: "EQUAL", participantIds } },
      {
        onSuccess: onClose,
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-ink/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">New expense</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink">Description</label>
            <input
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">Amount</label>
            <input
              type="number"
              required
              min={0.01}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">Paid by</label>
            <select
              value={paidById}
              onChange={(event) => setPaidById(event.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
            >
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">Split equally between</label>
            <div className="mt-2 space-y-2">
              {members.map((member) => (
                <label key={member.userId} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={participantIds.includes(member.userId)}
                    onChange={() => toggleParticipant(member.userId)}
                    className="h-4 w-4 rounded border-ink/25 text-terracotta focus:ring-terracotta"
                  />
                  {member.user.fullName}
                </label>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{errorMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={createExpense.isPending}>
            {createExpense.isPending ? "Adding..." : "Add expense"}
          </Button>
        </form>
      </div>
    </div>
  );
}
