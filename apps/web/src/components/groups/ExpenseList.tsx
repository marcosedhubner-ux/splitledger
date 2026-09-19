"use client";

import { Card } from "@/components/ui/Card";
import { useDeleteExpense } from "@/hooks/useExpenses";
import type { ExpenseInfo } from "@/lib/types";

function ReceiptIcon({ className }: { className?: string }) {
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
        d="M6 3.75h12v16.5l-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5V3.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.75 8.25h6.5M8.75 11.25h6.5M8.75 14.25h3.5" />
    </svg>
  );
}

export function ExpenseList({
  groupId,
  expenses,
  currentUserId,
}: {
  groupId: string;
  expenses: ExpenseInfo[];
  currentUserId: string;
}) {
  const deleteExpense = useDeleteExpense(groupId);

  return (
    <Card>
      <h2 className="text-sm font-semibold text-ink">Expenses</h2>
      {expenses.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-2 py-6 text-center">
          <ReceiptIcon className="h-9 w-9 text-terracotta/35" />
          <p className="text-sm text-ink-soft">No expenses yet.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-ink/10">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="animate-fade-slide-in -mx-1 rounded-lg px-1 py-3 text-sm transition-colors duration-200 hover:bg-paper/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{expense.description}</p>
                  <p className="text-xs text-ink-soft">
                    Paid by {expense.paidBy.fullName} &middot;{" "}
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-ink">
                    ${Number(expense.amount).toFixed(2)}
                  </span>
                  {expense.paidById === currentUserId && (
                    <button
                      onClick={() => deleteExpense.mutate(expense.id)}
                      className="text-xs font-medium text-danger transition-colors duration-200 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Split: {expense.splits.map((s) => `${s.user.fullName} $${Number(s.shareAmount).toFixed(2)}`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
