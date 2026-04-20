# Constantia — Habit Tracker

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL via Neon serverless + Drizzle ORM
- **Auth:** better-auth
- **Styling:** Tailwind CSS v3 (`--ignore-scripts` required — Smart App Control blocks native `.node`/`.exe` on X: drive)
- **Animations:** motion/react (Framer Motion v11+)
- **Forms:** react-hook-form + zod
- **Dev server:** `npm run dev` → http://localhost:1244

## Commands

```bash
npm run dev          # start dev server on port 1244
npm run build        # production build
npm run db:generate  # generate Drizzle migrations
npm run db:migrate   # run pending migrations
npm run db:push      # push schema changes directly (dev only)
npm run db:studio    # open Drizzle Studio
```

## Project structure

```
src/
  app/
    (auth)/            # login, register pages
    (app)/
      dashboard/       # daily habit check-off view
      habits/          # habits overview + detail + new/edit
        _components/   # habits-overview.tsx (overview page UI)
        [id]/          # habit detail page
      tasks/           # task list feature
      settings/        # profile and password settings
  features/
    auth/              # login/register forms
    dashboard/         # date navigator, quote of the day
    entries/           # habit entry logic, actions, queries
    habits/            # habit CRUD, types, queries, logic
    tasks/             # task lists and items
    workouts/          # gym/cardio workout logger and history
    study/             # pomodoro timer and study log
    push/              # web push notification subscription
  db/
    schema/            # Drizzle table definitions
      habits.ts        # habit, habitEntry, workoutLog, studyLog
      tasks.ts         # taskList, task
      auth.ts          # user, session, account (better-auth)
    migrations/        # SQL migrations
  lib/
    auth.ts            # better-auth config
    colors.ts          # habit color palette helpers
    dates.ts           # date utility functions (YYYY-MM-DD local)
  components/
    layout/            # sidebar, header, mobile-nav, theme-toggle
    ui/                # shared UI primitives (button, card, badge…)
```

## Design system

The app uses a **stoic/parchment** aesthetic with Latin naming.

- **Color palette:** `parchment-50` through `parchment-950` (warm off-white to dark brown)
- **Typography:** serif font for headings, sans for body
- **Dark mode:** `dark:` variants throughout — always add both
- **App name shown to users:** *Constantia*

## Database schema — key tables

| Table | Purpose |
|---|---|
| `habit` | Habit definitions (name, icon, color, frequency, category, sortOrder…) |
| `habit_entry` | One row per habit per day completed. `date` stored as `"YYYY-MM-DD"` local string |
| `workout_log` | JSON workout data (gym sets / cardio) linked to a sport habit |
| `study_log` | Pomodoro sessions + total minutes per day, linked to a study habit |
| `task_list` | Named task lists |
| `task` | Individual tasks with priority, due date, listId |

`habitEntry` has a unique index on `(habitId, userId, date)` — one entry per habit per day.

## Habit logic (`src/features/entries/logic.ts`)

- **`calculateCurrentStreak(dates)`** — consecutive days ending today or yesterday
- **`calculateLongestStreak(dates)`** — all-time longest consecutive run
- **`getCompletionRate(dates, days)`** — % completion over last N days
- **`calculateVirtusScore(dates)`** — 0–100 forgiveness-based consistency score (see below)

## Virtus Score

Forgiveness-based alternative to binary streaks, introduced to prevent the *what-the-hell effect* (user breaks a streak, feels it's worthless to continue).

**Formula:** `C_t = C_(t-1) × 0.85 + (completed ? 15 : 0)`

- Converges to 100 on perfect consistency (100 = 15/0.15)
- One missed day drops ~15% of the current score — painful but not catastrophic
- Three active days after a miss recovers the score fully
- Computed from existing `habitEntry` rows — no DB migration needed

**Labels:**

| Score | Label |
|---|---|
| 85–100 | Virtus Perfecta |
| 60–84 | Virtus Fuerte |
| 35–59 | Creciendo |
| 1–34 | Iniciando |

**Where it appears:**
- `habits-overview.tsx` — circular mini-badge (28px ring) on each habit row + "Virtus" ranking section replacing old "Rachas activas"
- `habit-stat-card.tsx` — prominent 80px ring with label at the top of the stats section on the detail page

## Habit categories

`general` | `sport` | `study` | `health`

- **sport** habits get a workout logger (gym sets or cardio) and history view
- **study** habits get a Pomodoro timer and study session history

## Dates convention

All dates are stored and compared as `"YYYY-MM-DD"` strings in **local time** (never UTC). Use `getTodayString()` and `getDateString(offset)` from `src/lib/dates.ts` — never `new Date().toISOString()`.

## Entry actions

- `toggleHabitEntry(habitId, date)` — creates or deletes an entry (binary habits)
- `updateEntryCount(habitId, date, count)` — upserts count (count-based habits)
- `updateEntryNote(entryId, note)` — updates the note on an existing entry

## Environment notes

- Smart App Control on this machine blocks native `.node`/`.exe` binaries on the X: drive — always use `--ignore-scripts` when installing packages
- Tailwind v3 (not v4)
