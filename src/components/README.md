# components

## Purpose
UI primitives and app-wide chrome. Anything tied to a feature (habits, tasks, etc.) lives in `features/<name>/components/`, not here.

## What's inside
- `ui/` — generic primitives: `Button`, `Input`, and similar. Reusable across any feature.
- `layout/` — global app chrome: sidebar, mobile nav, headers.
- `pwa/` — progressive web app glue (install prompt, service worker registration).
- `settings/` — the settings page UI. Small enough to keep here for now.

## What this module does NOT do
- Does not contain feature logic — no queries, no server actions, no habit/task/workout-specific UI.
- Does not import from `features/*`. If a primitive in `ui/` starts to need habit knowledge, it should move to `features/habits/components/` instead.

## Dependencies
- `@/lib/cn` — class merger used by every primitive
