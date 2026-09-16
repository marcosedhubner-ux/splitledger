"use client";

import { Card } from "@/components/ui/Card";
import { useDeleteExpense } from "@/hooks/useExpenses";
import type { ExpenseInfo } from "@/lib/types";

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
      <h2 className="text-sm font-semibold text-slate-700">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No expenses yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {expenses.map((expense) => (
            <li key={expense.id} className="py-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{expense.description}</p>
                  <p className="text-xs text-slate-400">
                    Paid by {expense.paidBy.fullName} &middot;{" "}
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">
                    ${Number(expense.amount).toFixed(2)}
                  </span>
                  {expense.paidById === currentUserId && (
                    <button
                      onClick={() => deleteExpense.mutate(expense.id)}
                      className="text-xs font-medium text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Split: {expense.splits.map((s) => `${s.user.fullName} $${Number(s.shareAmount).toFixed(2)}`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
