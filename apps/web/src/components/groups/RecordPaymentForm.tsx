"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useRecordPayment } from "@/hooks/usePayments";
import { ApiError } from "@/lib/apiClient";
import type { GroupMemberInfo, Settlement } from "@/lib/types";

export function RecordPaymentForm({
  groupId,
  members,
  prefill,
  onClose,
}: {
  groupId: string;
  members: GroupMemberInfo[];
  prefill: Settlement | null;
  onClose: () => void;
}) {
  const recordPayment = useRecordPayment(groupId);
  const [toUserId, setToUserId] = useState(prefill?.toUserId ?? members[0]?.userId ?? "");
  const [amount, setAmount] = useState(prefill?.amount ?? 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    recordPayment.mutate(
      { toUserId, amount },
      {
        onSuccess: onClose,
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-ink">Record a payment</h2>
        <p className="mt-1 text-sm text-ink-soft">Log money you already sent outside the app.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink">Paid to</label>
            <select
              value={toUserId}
              onChange={(event) => setToUserId(event.target.value)}
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

          {errorMessage && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{errorMessage}</p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={recordPayment.isPending}>
              {recordPayment.isPending ? "Recording..." : "Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
