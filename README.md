# Tab

Untangles a week of shared dinners into the fewest payments that make everyone even. Add an expense, pick who it's split between, and every member's balance updates instantly — including a suggested settlement plan computed by a debt-simplification algorithm, not just a raw "who owes who" list per expense.

[Leia em português](./README.pt-BR.md)

## Why this exists

Track expenses in a group of four for a week and you'll end up with a dozen small debts crossing each other — Alex owes Bob, Bob owes Carla, Carla owes Alex. Naively, settling up takes one transaction per debt. Tab nets those debts down to the minimum number of transfers that zero everyone out, which is the actual hard part of a bill-splitting app — the CRUD around it is the easy 80%.

## Architecture

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind) — groups, expenses, balances, settlements
  api/   Node/Express (TypeScript) — REST API + Socket.IO, Prisma ORM, PostgreSQL
```

```
src/
  domain/            debtSimplification.ts — pure settlement algorithm, framework-free, unit tested
                      money.ts — dollars/cents conversion so balance math never touches floating point
                      errors.ts — typed domain errors mapped to HTTP status codes
  modules/<name>/     <name>.schema.ts   Zod input validation
                      <name>.service.ts   business logic
                      <name>.routes.ts    Express router, thin controllers
  middlewares/        auth, rate limiting, centralized error handling
  realtime/           Socket.IO, one room per group
```

## The interesting part: settling debts in the fewest transactions

Every expense and payment updates a per-member balance (in integer cents — money is never represented as a JavaScript float anywhere in this codebase, see `domain/money.ts`). Handing that balance list to `simplifyDebts` (`domain/debtSimplification.ts`) sorts members into creditors and debtors and greedily matches the largest creditor against the largest debtor, repeatedly, until both sides are zero:

```ts
while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
  const amount = Math.min(creditor.amountCents, debtor.amountCents);
  settlements.push({ fromUserId: debtor.userId, toUserId: creditor.userId, amountCents: amount });
  // ...advance whichever side hit zero
}
```

This is a deliberate choice, not an accident: the mathematically optimal minimum-transaction solution is a subset-sum search (harder than polynomial in the general case), while the largest-first greedy strategy used here runs in `O(n log n)`, always fully settles the group, and in practice produces the same or very close to the same number of transactions — the same trade-off real expense-splitting apps make. `tests/debtSimplification.test.ts` verifies the correctness property that actually matters: applying the suggested settlements always brings every balance to exactly zero.

## Security

- Passwords hashed with bcrypt (cost factor 12); sessions are JWTs in `httpOnly`, `sameSite=lax` cookies.
- Every group route checks membership server-side before returning any data — a user who isn't in a group gets a `403`, not a 404 that would leak the group's existence.
- Only the person who paid an expense can delete it; only the person who owes a debt can record having paid it off (self-attested, like every peer-to-peer settle-up flow).
- All input validated with Zod at the boundary, including a discriminated union for split types (equal vs. custom) so the two shapes can't be confused at the type level.
- Prisma parameterizes every query; rate limiting on auth endpoints; `helmet` security headers; CORS locked to the configured web origin.
- No secret ever lives in source control — see [Getting started](#getting-started).

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL 14+ instance (local or hosted)

### 1. Configure the API

```bash
cd apps/api
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random string, 32+ characters (`openssl rand -hex 32`) |
| `WEB_ORIGIN` | URL of the frontend, for CORS (`http://localhost:3003` in dev) |

```bash
npm install
npm run prisma:migrate   # creates the schema
npm run prisma:seed      # demo friend group with expenses and one settled payment
npm run dev              # http://localhost:4003
```

Demo accounts created by the seed, all in the same "Lisbon Trip" group (password `Passw0rd!123`):

`alex@splitledger.dev` · `blair@splitledger.dev` · `casey@splitledger.dev` · `dana@splitledger.dev`

### 2. Configure the web app

```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev -- -p 3003             # http://localhost:3003
```

## Testing

```bash
cd apps/api
npm test        # debt-simplification and money-handling unit tests (Vitest)
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Node.js · Express · Socket.IO · Prisma · PostgreSQL · Zod · Vitest
