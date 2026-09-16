export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function toDollars(cents: number): number {
  return Math.round(cents) / 100;
}
