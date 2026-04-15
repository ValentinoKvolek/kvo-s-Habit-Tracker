<div align="center">

# Constantia

**A habit tracker that respects your time — and your wallet.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

## About

During my vacation I started using a habit tracker to build a reading routine. On day 10, the app dropped a paywall on me. Instead of paying, I built my own.

Constantia is a self-hosted habit tracker with a tree-shaped dashboard, streaks that actually reward showing up, multi-tap habits, weekly scheduling, time-of-day buckets, a Pomodoro timer, workout logs, and a day navigator so you can look back at any past day. The UI is in Spanish — the codebase is in English, so contributing should feel familiar regardless of your native language.

It's free, open-source, and runs on your machine. No paywalls, no tracking, no "premium tier".

## Features

- **Daily and weekly habits** with per-day scheduling (pick which days of the week each habit should appear)
- **Time-of-day grouping** — morning, afternoon, night, or unscheduled
- **Multi-tap habits** — set a target count per day, tap to increment, tap again to undo
- **Streaks** with milestone toasts (only counts days that actually hit the target)
- **Day navigator** — scroll back through past days in read-only mode to see how you did
- **Calendar view** per habit with full history
- **Tasks** — one-off to-dos with optional date, separate from habits, grouped by day
- **Workout logs** with gym sets/reps, cardio distance/time, and freeform entries
- **Study sessions** via built-in Pomodoro timer with a soft bell
- **Reminders** — opt-in browser notifications at a time you pick
- **Categories** — general, sport, study, health — each with its own color
- **Fully self-hosted** — your data stays in your Postgres instance

## Screenshots

> Screenshots coming soon. The dashboard uses a "tree" layout grouping habits by category or time slot, with streak rings and completion buttons per habit.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 15](https://nextjs.org/) App Router, [React 19](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v3 + custom `sienna`/`parchment` palette |
| Animation | [Motion](https://motion.dev/) (Framer Motion successor) |
| Database | [PostgreSQL 17](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [better-auth](https://www.better-auth.com/) |
| Validation | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) |
| Icons | [Lucide](https://lucide.dev/) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for the local Postgres)
- npm (or pnpm / yarn)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/kvo-s-Habit-Tracker.git
cd kvo-s-Habit-Tracker
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```dotenv
DATABASE_URL="postgres://momentum:momentum_dev@localhost:5432/momentum"
DATABASE_URL_UNPOOLED="postgres://momentum:momentum_dev@localhost:5432/momentum"
BETTER_AUTH_SECRET="change-me-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:1244"
NEXT_PUBLIC_APP_URL="http://localhost:1244"
```

Generate a proper secret with:

```bash
openssl rand -base64 32
```

### 3. Start the database

```bash
docker compose up -d
```

This spins up a Postgres 17 container named `momentum-db` on port `5432`.

### 4. Push the schema

```bash
npm run db:push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:1244](http://localhost:1244). Register an account and you're in.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js in dev mode on port 1244 |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run db:generate` | Generate a new Drizzle migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema directly to the DB (dev only) |
| `npm run db:studio` | Open Drizzle Studio to browse your data |

## Project Structure

The project is organized by **feature**, not by technical layer. Everything related to habits lives under `src/features/habits/` — actions, queries, validation, components, the lot.

```
src/
├── app/                  Next.js routes (pages, layouts, API)
├── features/             Domain features, each self-contained
│   ├── habits/           Habit tracking — the core
│   ├── tasks/            One-off to-dos
│   ├── workouts/         Sport session logs
│   ├── study/            Pomodoro + study sessions
│   ├── dashboard/        Dashboard-specific UI (date nav, greeting)
│   ├── auth/             Login / register forms
│   └── entries/          Habit daily entries (toggle, streak)
├── db/                   Drizzle schema + client
├── lib/                  Shared utilities (dates, colors, cn, auth)
└── components/           Reusable UI (buttons, layout, nav)
```

> **Note:** the repo is being refactored from a flat `components/` + `lib/actions/` + `lib/queries/` layout into the feature-based structure above. See [CONTRIBUTING.md](./CONTRIBUTING.md) for current status.

## Contributing

Contributions are welcome. The short version:

1. Fork the repo and create a branch (`git checkout -b feat/my-feature`)
2. Make your changes — keep diffs focused, one logical change per PR
3. Run `npm run build` to make sure nothing breaks
4. Open a PR describing what and why

Issues and ideas are equally welcome — open one [here](../../issues).

Looking for something to work on? Check the issues tagged `good first issue`.

## Roadmap

- [ ] PWA / installable app
- [ ] Data export (JSON / CSV)
- [ ] Dark mode polish
- [ ] Multi-language support (start with English)
- [ ] Mobile push notifications
- [ ] Habit statistics & charts

## License

[MIT](./LICENSE) — do whatever you want, just don't sue me.

## Acknowledgements

Built on the shoulders of giants:

- [Drizzle ORM](https://orm.drizzle.team/) — the best TypeScript ORM I've used
- [better-auth](https://www.better-auth.com/) — auth without the pain
- [shadcn/ui](https://ui.shadcn.com/) — inspiration for the component patterns
- [Next.js](https://nextjs.org/) + the Vercel team
- Everyone who wrote an open-source habit tracker before me

---

<div align="center">

Made with too much coffee ☕ during a vacation that should have been restful.

</div>
