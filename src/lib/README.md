# lib

## Purpose
Cross-cutting utilities used by two or more features. Anything specific to one feature belongs in that feature folder, not here.

## What's inside
- `auth.ts` — better-auth server configuration (session, adapters).
- `auth-client.ts` — better-auth client (`authClient`) for browser-side calls.
- `dates.ts` — date string helpers: `getTodayString`, `getDateString`, `getDaysInMonth`, `getDayOfWeek`, `formatDisplayDate`, `formatShortDate`.
- `cn.ts` — Tailwind class merger (`clsx` + `tailwind-merge`).
- `colors.ts` — `getHabitColor` mapping a `HabitColor` enum to hex + Tailwind bg class.
- `quotes.ts` — `getQuoteOfDay` deterministic daily quote.

## Public exports
- `auth`, `authClient`
- `getTodayString`, `getDateString`, `getDaysInMonth`, `getDayOfWeek`, `formatDisplayDate`, `formatShortDate`
- `cn`, `getHabitColor`, `getQuoteOfDay`

## What this module does NOT do
- Does not own any feature logic (habit/entry/task/workout/study all live under `features/`).
- Does not talk to the database directly (except through `@/db`).

## Dependencies
- `@/db` — `auth.ts` wires better-auth to the DB adapter
