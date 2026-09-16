"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { BalancesPanel } from "@/components/groups/BalancesPanel";
import { SettlementsPanel } from "@/components/groups/SettlementsPanel";
import { ExpenseList } from "@/components/groups/ExpenseList";
import { NewExpenseForm } from "@/components/groups/NewExpenseForm";
import { AddMemberForm } from "@/components/groups/AddMemberForm";
import { RecordPaymentForm } from "@/components/groups/RecordPaymentForm";
import { useGroupDetail } from "@/hooks/useGroups";
import { useRealtime } from "@/hooks/useRealtime";
import { useSession } from "@/hooks/useAuth";
import type { Settlement } from "@/lib/types";

function GroupDetailView({ groupId }: { groupId: string }) {
  useRealtime(groupId);
  const { data: session } = useSession();
  const { data, isLoading } = useGroupDetail(groupId);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [paymentPrefill, setPaymentPrefill] = useState<Settlement | null>(null);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  if (isLoading || !data || !session) {
    return <p className="text-sm text-slate-400">Loading group...</p>;
  }

  const { group, balances, settlements } = data;
  const currentUserId = session.user.id;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
          <p className="text-xs text-slate-400">
            {group.members.length} member{group.members.length === 1 ? "" : "s"} &middot; {group.currency}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsAddingMember(true)}>
            Add member
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPaymentPrefill(null);
              setIsRecordingPayment(true);
            }}
          >
            Record payment
          </Button>
          <Button onClick={() => setIsAddingExpense(true)}>Add expense</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BalancesPanel balances={balances} members={group.members} />
        <SettlementsPanel
          settlements={settlements}
          members={group.members}
          currentUserId={currentUserId}
          onRecord={(settlement) => {
            setPaymentPrefill(settlement);
            setIsRecordingPayment(true);
          }}
        />
      </div>

      <div className="mt-6">
        <ExpenseList groupId={groupId} expenses={group.expenses} currentUserId={currentUserId} />
      </div>

      {isAddingExpense && (
        <NewExpenseForm
          groupId={groupId}
          members={group.members}
          currentUserId={currentUserId}
          onClose={() => setIsAddingExpense(false)}
        />
      )}
      {isAddingMember && <AddMemberForm groupId={groupId} onClose={() => setIsAddingMember(false)} />}
      {isRecordingPayment && (
        <RecordPaymentForm
          groupId={groupId}
          members={group.members}
          prefill={paymentPrefill}
          onClose={() => setIsRecordingPayment(false)}
        />
      )}
    </div>
  );
}

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <AuthGuard>
      <GroupDetailView groupId={params.id} />
    </AuthGuard>
  );
}
