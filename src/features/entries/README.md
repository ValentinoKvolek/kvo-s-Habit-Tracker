# entries

## Purpose
A habit entry is a single-day completion record: "I did habit X on date Y, N times." This module owns writing those entries and deriving streaks from them.

## What's inside
- `actions.ts` — server mutations: `toggleHabitEntry`, `incrementHabitCount`, `rollbackHabitCount`.
- `queries.ts` — entry reads scoped to a habit + date range.
- `logic.ts` — pure functions: `calculateCurrentStreak`, `calculateLongestStreak`.

## Public exports
- `toggleHabitEntry`, `incrementHabitCount`, `rollbackHabitCount`
- `calculateCurrentStreak`, `calculateLongestStreak`

## What this module does NOT do
- Does not know about habit definitions beyond the `habitId` FK.
- Does not render anything — streak UI lives in `features/habits/components/`.

## Dependencies
- `@/db` — `habitEntry` schema
- `@/lib/dates` — `getTodayString`, `getDateString`
