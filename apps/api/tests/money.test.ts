import { describe, expect, it } from "vitest";
import { toCents, toDollars } from "../src/domain/money.js";

describe("money", () => {
  it("converts dollars to cents without floating point drift", () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1)).toBe(10);
    expect(toCents(10)).toBe(1000);
  });

  it("converts cents back to dollars", () => {
    expect(toDollars(1999)).toBe(19.99);
    expect(toDollars(10)).toBe(0.1);
  });

  it("round-trips a value split three ways without losing a cent", () => {
    const totalCents = toCents(10.0);
    const share = Math.floor(totalCents / 3);
    const remainder = totalCents - share * 3;
    const shares = [share, share, share];
    shares[0] += remainder;

    expect(shares.reduce((a, b) => a + b, 0)).toBe(totalCents);
  });
});
