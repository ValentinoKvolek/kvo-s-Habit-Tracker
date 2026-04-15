# dashboard

## Purpose
Home-screen UI pieces — the date navigator (jump between days, read-only past) and the quote-of-the-day card.

## What's inside
- `components/date-navigator.tsx` — date chips + prev/next controls, URL-synced.
- `components/quote-of-day.tsx` — deterministic daily quote.

## Public exports
- `DateNavigator`, `QuoteOfDay`

## What this module does NOT do
- Does not fetch habits — that happens in `app/(app)/dashboard/page.tsx` via `features/habits/queries`.
- Does not store any state server-side — the selected date lives in the URL (`?date=YYYY-MM-DD`).

## Dependencies
- `@/lib/dates` — date string helpers
- `@/lib/quotes` — `getQuoteOfDay`
