# Mock Transactions Design

## Goal

Seed 100 additional sales transactions using only products already defined in
`prisma/seed.ts`. Existing transactions remain untouched when seeding runs
again.

## Behavior

- Load active products after category and product seeding completes.
- Load an existing admin or cashier user to own transactions and stock changes.
- Create 100 new transactions on every seed run.
- Generate unique transaction numbers with the current timestamp and index.
- Spread transaction dates across the last 30 days.
- Add 1-4 product items per transaction, using current product names and prices.
- Use `CASH`, `QRIS_MANUAL`, or `MANUAL_TRANSFER` payment methods.
- Create matching `TransactionItem` rows and `StockAdjustment` rows with type `OUT`.
- Decrease product stock only by quantities sold and never below zero.
- Set `amountPaid` and `change` consistently with transaction total.

## Scope

Changes stay in `prisma/seed.ts`. No new runtime API, UI, dependency, or
database schema change.

## Verification

Run the project checks required by `AGENTS.md`, plus the seed command when
database environment values are available. Confirm one run adds 100
transactions and a second run adds another 100 without deleting prior rows.
