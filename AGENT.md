# AGENT.md — AI Governance for kvo-s Habit Tracker

> Full rules live in [`.ai/RULES.md`](.ai/RULES.md).
> This file is the entry point; `.ai/RULES.md` is the source of truth.

---

## Quick Reference

### Stack
Next.js 15 · React 19 · TypeScript (strict) · Tailwind v3 · Drizzle ORM · Neon · better-auth

### Aesthetic — Stoic
- Neutral and earth tones: stone, slate, zinc, muted olive/amber
- **No generic gradients**
- Dark mode primary; whitespace is intentional, not decorative
- Motion only when it conveys state change

### Data Fetching — Hard Rules
- `useEffect` **must not** be used for data fetching — ever
- Fetch in React Server Components or Server Actions
- Client-side async: `useSWR` / React Query only
- See `.ai/RULES.md` for the full approved-patterns table

### Code Quality
- No `any`, no `console.log`, no dead code
- Comments explain *why*, never *what*
- `'use client'` only when browser APIs or interactivity require it

---

See [`.ai/RULES.md`](.ai/RULES.md) for the complete governance specification.
