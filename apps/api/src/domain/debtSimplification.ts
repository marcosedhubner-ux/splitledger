export interface Balance {
  userId: string;
  amountCents: number;
}

export interface Settlement {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
}

export function simplifyDebts(balances: Balance[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.amountCents > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.amountCents - a.amountCents);

  const debtors = balances
    .filter((b) => b.amountCents < 0)
    .map((b) => ({ userId: b.userId, amountCents: -b.amountCents }))
    .sort((a, b) => b.amountCents - a.amountCents);

  const settlements: Settlement[] = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]!;
    const debtor = debtors[debtorIndex]!;
    const amount = Math.min(creditor.amountCents, debtor.amountCents);

    if (amount > 0) {
      settlements.push({ fromUserId: debtor.userId, toUserId: creditor.userId, amountCents: amount });
    }

    creditor.amountCents -= amount;
    debtor.amountCents -= amount;

    if (creditor.amountCents === 0) creditorIndex += 1;
    if (debtor.amountCents === 0) debtorIndex += 1;
  }

  return settlements;
}
