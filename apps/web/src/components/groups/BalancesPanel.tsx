import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Balance, GroupMemberInfo } from "@/lib/types";

export function BalancesPanel({ balances, members }: { balances: Balance[]; members: GroupMemberInfo[] }) {
  const nameById = new Map(members.map((m) => [m.userId, m.user.fullName]));

  return (
    <Card>
      <h2 className="text-sm font-semibold text-ink">Balances</h2>
      <ul className="mt-3 divide-y divide-ink/10">
        {balances.map((balance) => (
          <li
            key={balance.userId}
            className="flex items-center justify-between py-2 text-sm transition-colors duration-200 hover:bg-paper/60 -mx-1 px-1 rounded-lg"
          >
            <span className="text-ink">{nameById.get(balance.userId) ?? "Unknown"}</span>
            {balance.balance > 0.005 ? (
              <Badge key={`${balance.userId}-${balance.balance}`} tone="success" pulse>
                is owed ${balance.balance.toFixed(2)}
              </Badge>
            ) : balance.balance < -0.005 ? (
              <Badge key={`${balance.userId}-${balance.balance}`} tone="danger" pulse>
                owes ${Math.abs(balance.balance).toFixed(2)}
              </Badge>
            ) : (
              <Badge key={`${balance.userId}-settled`} tone="neutral" pulse>
                settled up
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
