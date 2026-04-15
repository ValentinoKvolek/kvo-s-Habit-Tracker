# db

## Purpose
Single source of truth for the database: Drizzle client and all table schemas.

## What's inside
- `index.ts` — exports the `db` client (postgres connection pool + drizzle).
- `schema/index.ts` — re-exports every table for drizzle config.
- `schema/auth.ts` — `user`, `session`, `account`, `verification` (better-auth).
- `schema/habit.ts` — `habit` table + `HabitColor`, `HabitIcon` enums.
- `schema/entry.ts` — `habitEntry` (daily completion).
- `schema/workout.ts` — `workoutLog`.
- `schema/study.ts` — `studyLog`.
- `schema/task.ts` — `task`.
- `migrations/` — generated SQL migrations.

## Public exports
- `db` (from `@/db`)
- All table constants and row types (from `@/db/schema`)

## What this module does NOT do
- Does not define queries or mutations — those live in each feature's `queries.ts` / `actions.ts`.
- Does not handle auth sessions — better-auth reads these tables through its own adapter (`@/lib/auth.ts`).

## Dependencies
- `drizzle-orm`, `postgres`
- `DATABASE_URL` env var
