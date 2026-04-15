# habits

## Purpose
The core feature: a habit definition (name, color, icon, frequency, category, time slot) and everything needed to display, create, edit and archive one.

## What's inside
- `actions.ts` — server mutations: `createHabit`, `updateHabit`, `deleteHabit`, `archiveHabit`.
- `queries.ts` — DB reads: `getHabitsForDate`, `getHabitsWithTodayEntries`, `getHabitById`, `getHabitWithAllEntries`.
- `schema.ts` — Zod `habitSchema`, constants (`HABIT_COLORS`, `HABIT_ICONS`, `HABIT_CATEGORIES`, `TIME_SLOTS`, labels).
- `logic.ts` — pure predicates: `isHabitScheduledToday`, `isHabitScheduledForDate`.
- `constants.ts` — shared UI constants: `DAY_LABELS`, `SPORT_ICONS`, `CATEGORY_ICONS`.
- `types.ts` — `HabitWithMeta` (habit row + today's completion state).
- `components/` — every habit-specific UI piece (trees, form sections, calendar, streak ring, completion button...).

## Public exports
- `createHabit`, `updateHabit`, `deleteHabit`, `archiveHabit` (actions)
- `getHabitsForDate`, `getHabitsWithTodayEntries`, `getHabitById`, `getHabitWithAllEntries` (queries)
- `habitSchema`, `HabitInput`, `TIME_SLOTS`, `HABIT_CATEGORIES` (schema)
- `isHabitScheduledForDate` (logic)
- `HabitTree`, `TimeSlotTree`, `HabitForm`, `HabitCalendar`, `CompletionButton` (components)

## What this module does NOT do
- Does not know about workout or study logs — those live in `features/workouts/` and `features/study/` and are linked by `habitId`.
- Does not write daily completion entries — that's `features/entries/actions.ts` (`toggleHabitEntry`).
- Does not manage auth/session — callers pass a `userId`.

## Dependencies
- `@/db` — schema and client
- `@/lib/dates` — date helpers for `logic.ts`
- `@/lib/colors` — `getHabitColor` for UI
- `@/features/entries/logic` — streak calculations in queries
