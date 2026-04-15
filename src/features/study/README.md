# study

## Purpose
Pomodoro-backed study tracking: a timer the user runs session by session, and a per-day rollup of completed sessions linked to a study habit.

## What's inside
- `actions.ts` — `saveStudySession`, increments session count for the day.
- `queries.ts` — `getStudyLog` (today's rollup), `getStudyHistory` (all sessions).
- `schema.ts` — `studySessionSchema`.
- `components/pomodoro-timer.tsx` — the timer UI + bell on completion.
- `components/study-history.tsx` — history list.

## Public exports
- `saveStudySession`
- `getStudyLog`, `getStudyHistory`, `StudyLogEntry`
- `PomodoroTimer`, `StudyHistory`

## What this module does NOT do
- Does not own habit definitions — it reads `habit.targetCount` from the parent page.
- Does not play sound outside the pomodoro component — the bell is local to `pomodoro-timer.tsx`.

## Dependencies
- `@/db` — `studyLog` schema
- `@/lib/dates` — `formatShortDate`
