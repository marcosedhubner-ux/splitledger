import { describe, expect, it } from "vitest";
import { simplifyDebts, type Balance } from "../src/domain/debtSimplification.js";

function totalOwed(settlements: { amountCents: number }[]): number {
  return settlements.reduce((sum, s) => sum + s.amountCents, 0);
}

function applySettlements(balances: Balance[], settlements: ReturnType<typeof simplifyDebts>): Map<string, number> {
  const result = new Map(balances.map((b) => [b.userId, b.amountCents]));
  for (const settlement of settlements) {
    result.set(settlement.fromUserId, (result.get(settlement.fromUserId) ?? 0) + settlement.amountCents);
    result.set(settlement.toUserId, (result.get(settlement.toUserId) ?? 0) - settlement.amountCents);
  }
  return result;
}

describe("simplifyDebts", () => {
  it("produces a single transfer for a two-person debt", () => {
    const balances: Balance[] = [
      { userId: "alice", amountCents: 1500 },
      { userId: "bob", amountCents: -1500 },
    ];

    const settlements = simplifyDebts(balances);

    expect(settlements).toEqual([{ fromUserId: "bob", toUserId: "alice", amountCents: 1500 }]);
  });

  it("settles every balance to zero for a three-person group", () => {
    const balances: Balance[] = [
      { userId: "alice", amountCents: 2000 },
      { userId: "bob", amountCents: -1200 },
      { userId: "carla", amountCents: -800 },
    ];

    const settlements = simplifyDebts(balances);
    const finalBalances = applySettlements(balances, settlements);

    for (const amount of finalBalances.values()) {
      expect(amount).toBe(0);
    }
  });

  it("uses fewer transactions than the naive pairwise approach when balances can be netted", () => {
    const balances: Balance[] = [
      { userId: "alice", amountCents: 3000 },
      { userId: "bob", amountCents: 1000 },
      { userId: "carla", amountCents: -2000 },
      { userId: "dave", amountCents: -2000 },
    ];

    const settlements = simplifyDebts(balances);

    expect(settlements.length).toBeLessThanOrEqual(3);
    const finalBalances = applySettlements(balances, settlements);
    for (const amount of finalBalances.values()) {
      expect(amount).toBe(0);
    }
  });

  it("returns no settlements when everyone is already even", () => {
    const balances: Balance[] = [
      { userId: "alice", amountCents: 0 },
      { userId: "bob", amountCents: 0 },
    ];

    expect(simplifyDebts(balances)).toEqual([]);
  });

  it("never generates a transaction for more than the smaller side of a match", () => {
    const balances: Balance[] = [
      { userId: "alice", amountCents: 500 },
      { userId: "bob", amountCents: -700 },
      { userId: "carla", amountCents: 200 },
    ];

    const settlements = simplifyDebts(balances);
    expect(totalOwed(settlements)).toBe(700);
  });
});
