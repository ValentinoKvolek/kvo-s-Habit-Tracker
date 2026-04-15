# auth

## Purpose
UI forms and client pieces for sign-in / sign-up / sign-out. The actual auth engine (sessions, cookies, adapters) lives in `@/lib/auth.ts` via `better-auth`.

## What's inside
- `schema.ts` — Zod `loginSchema`, `registerSchema`.
- `components/login-form.tsx`, `register-form.tsx`, `sign-out-button.tsx`.

## Public exports
- `LoginForm`, `RegisterForm`, `SignOutButton`
- `loginSchema`, `registerSchema`

## What this module does NOT do
- Does not configure better-auth (see `@/lib/auth.ts`).
- Does not handle route protection — see middleware and server-side `auth.api.getSession()` calls in `app/`.

## Dependencies
- `@/lib/auth-client` — `authClient` for sign-in/up calls
- `@/components/ui/*` — Button, Input
