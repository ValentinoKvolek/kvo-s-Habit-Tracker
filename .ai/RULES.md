# AI Governance Rules — kvo-s Habit Tracker

## Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript — strict mode, no `any`
- **Styling**: Tailwind CSS v3 — utility-first, no inline styles
- **Data layer**: Drizzle ORM + Neon (PostgreSQL)
- **Auth**: better-auth
- **Forms**: react-hook-form + zod
- **State**: React Server Components first; client state via `useState`/`useReducer` only when necessary

## Aesthetic — Stoic Design System

The visual language is **stoic**: restrained, purposeful, and honest. Every design decision must earn its place.

### Color
- Palette: neutral and earth tones — stone, slate, zinc, warm grays, muted olive/amber accents
- **No generic gradients** (no `bg-gradient-to-r from-purple-500 to-pink-500` or similar)
- Subtle tonal shifts are allowed (e.g., `stone-100` → `stone-200`) only when they carry meaning
- Dark mode is the primary experience; light mode is a supported variant, not an afterthought

### Typography
- Hierarchy through weight and size, not color noise
- Two-font system: **Playfair Display** (`font-serif`) for editorial headings only; **Inter** (`font-sans`) for all UI copy, labels, and body text
- `font-serif` is permitted on `h1`–`h6` and intentional editorial moments (e.g. empty states, section titles); never on buttons, inputs, or data
- Labels and UI copy: sentence case, no unnecessary capitalization

### Layout
- Whitespace is load-bearing — do not fill space for the sake of it
- Components align to an 8px grid
- Prefer single-column flows on mobile; avoid horizontal scrolling

### Iconography & Motion
- Icons: single stroke weight, consistent size (16px/20px)
- Motion: functional only — no entrance animations unless they convey state change
- No loading spinners for instant operations; skeleton screens for async data

## Data Fetching Rules

### useEffect is PROHIBITED for data fetching

```tsx
// FORBIDDEN
useEffect(() => {
  fetch('/api/habits').then(...) // never do this
}, [])
```

Approved patterns:

| Context | Approved pattern |
|---|---|
| Server data | React Server Component (`async function Page()`) |
| Mutations | Server Actions (`'use server'`) |
| Client-side revalidation | `useSWR` or `useQuery` (React Query) with a server-defined fetcher |
| Route-level loading | `loading.tsx` + Suspense boundaries |

### General data rules
- Co-locate fetchers with the feature that owns the data (`src/features/<feature>/actions/`)
- Never fetch in `layout.tsx` unless the data is truly layout-wide
- Avoid waterfalls: parallel-fetch with `Promise.all` in Server Components

## Component Rules

- Default to Server Components; add `'use client'` only when you need browser APIs, event handlers, or client state
- Props must be typed with explicit interfaces, not inlined object literals on complex components
- Do not mix presentation and data-fetching concerns in the same component
- File naming: `kebab-case.tsx`; component export name: `PascalCase`

## Code Quality

- No `console.log` in committed code
- No `eslint-disable` comments without a same-line explanation
- Dead code must be deleted, not commented out
- Comments explain *why*, never *what*

## File Structure

```
src/
  app/           # Next.js routes only — no business logic
  features/      # Feature-colocated: components, actions, hooks, types
  components/    # Shared UI primitives (no feature knowledge)
  lib/           # Pure utilities, no React
  db/            # Drizzle schema and client
```
