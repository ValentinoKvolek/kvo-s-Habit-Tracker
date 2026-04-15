# workouts

## Purpose
Detailed session logs for sport habits — gym (exercises/sets/reps/weight), cardio (distance/duration), and free-form "other". One log per `(habitId, date)`.

## What's inside
- `actions.ts` — `saveWorkoutLog`.
- `queries.ts` — `getWorkoutLog`, `getWorkoutHistory`.
- `schema.ts` — `gymWorkoutSchema`, `cardioWorkoutSchema`, `otherWorkoutSchema`, discriminator `isCardioType`, `SportType`, labels.
- `components/workout-logger/` — sport-type-aware form: `GymForm`, `CardioForm`, `OtherForm`, shared `SessionPicker`.
- `components/workout-history.tsx` — card list of past sessions.

## Public exports
- `saveWorkoutLog`
- `getWorkoutLog`, `getWorkoutHistory`, `WorkoutLogEntry`
- `WorkoutLogger`, `WorkoutHistory`
- `SportType`, `SPORT_TYPES`, `isCardioType`, `gymWorkoutSchema`, etc.

## What this module does NOT do
- Does not toggle habit completion — `saveWorkoutLog` is independent of the daily entry. The user marks the habit done via the `CompletionButton`.
- Does not own habit definitions — it reads `habit.sportType` as a string.

## Dependencies
- `@/db` — `workoutLog` schema
- `@/features/habits/constants` — `SPORT_ICONS` (for history card)
- `@/lib/dates` — `formatShortDate`, `formatDisplayDate`
