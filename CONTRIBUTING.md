# Contributing to Constantia

Thanks for thinking about contributing. Here's how to make it painless for both of us.

## Getting set up

Follow the [Getting Started](./README.md#getting-started) section in the README. If anything there is unclear or broken, that's your first contribution opportunity — open an issue.

## Ways to help

- **Bug reports** — open an issue with the [bug template](./.github/ISSUE_TEMPLATE/bug_report.md). Repro steps are gold.
- **Feature requests** — same, but with the [feature template](./.github/ISSUE_TEMPLATE/feature_request.md). Don't hold back.
- **Pull requests** — pick up an issue labeled `good first issue` or propose something in a new issue first so we can agree on the approach before you sink time into it.
- **Docs** — README unclear? Module docs stale? PRs welcome.
- **Translations** — the UI is currently Spanish-only. If you want to help internationalize, open an issue so we can talk about the approach.

## PR workflow

1. Fork and clone.
2. Create a branch off `main`. Use a short, descriptive name: `feat/dark-mode`, `fix/streak-off-by-one`, `docs/readme-typo`.
3. Make your changes. **Keep PRs focused** — one logical change per PR.
4. Run `npm run build` to make sure nothing broke.
5. Open a PR against `main`. Fill out the [template](./.github/pull_request_template.md).
6. Expect review comments. They're not personal — they're how we keep the bar up.

## Code style

- TypeScript everywhere.
- Tailwind for styling — no CSS files unless there's a real reason.
- Follow the feature-based folder structure in [README.md](./README.md#project-structure). New code belongs in `src/features/<feature>/`.
- Keep components small. If a file is over 200 lines, it probably wants to be split.
- No unused imports, no console.log in committed code.
- Name things so a junior can read them six months from now without a guide.

## Commits

- Meaningful commit messages — `fix pomodoro bell on firefox` beats `fix bug`.
- Squash before merging if your branch has noisy WIP commits.
- Conventional Commits are nice but not required.

## What we won't merge

- Adding a tracking / analytics dependency without an opt-out.
- Adding a paywall or feature gate.
- Breaking self-hosting in any way.
- Large refactors without a prior issue / discussion.

## Code of Conduct

Be kind. Assume good faith. Don't be a jerk. If something feels off, reach out.

---

Questions? Open an issue or start a discussion. Happy to help.
