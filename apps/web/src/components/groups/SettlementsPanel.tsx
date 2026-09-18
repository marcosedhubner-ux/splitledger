import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { GroupMemberInfo, Settlement } from "@/lib/types";

export function SettlementsPanel({
  settlements,
  members,
  currentUserId,
  onRecord,
}: {
  settlements: Settlement[];
  members: GroupMemberInfo[];
  currentUserId: string;
  onRecord: (settlement: Settlement) => void;
}) {
  const nameById = new Map(members.map((m) => [m.userId, m.user.fullName]));

  return (
    <Card className="border-t-2 border-dashed border-terracotta/40 pt-6">
      <h2 className="text-sm font-semibold text-ink">Suggested settlements</h2>
      <p className="mt-1 text-xs text-ink-soft">
        The fewest transfers that would bring everyone to zero.
      </p>
      {settlements.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">Everyone is settled up.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {settlements.map((settlement, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-xl bg-paper px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium text-ink">
                  {nameById.get(settlement.fromUserId) ?? "Unknown"}
                </span>{" "}
                pays{" "}
                <span className="font-medium text-ink">
                  {nameById.get(settlement.toUserId) ?? "Unknown"}
                </span>
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-ink">${settlement.amount.toFixed(2)}</span>
                {settlement.fromUserId === currentUserId && (
                  <Button variant="secondary" onClick={() => onRecord(settlement)}>
                    Record
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
