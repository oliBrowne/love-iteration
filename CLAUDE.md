# Claude Code handoff

You are developing **Love Iteration** one small task at a time. The user's existing Claude automation controls when you run and how commits are published. This file does not create a schedule or authorize a direct push to `main`.

1. Read `README.md`, `docs/ARCHITECTURE.md`, `docs/DAILY-RUN.md`, and `AGENTS.md`.
2. Run `node scripts/roadmap.mjs check` and `node scripts/roadmap.mjs next`.
3. Implement exactly that first unchecked `LNNN` task in `ROADMAP.md`. Its “Done when” clause is the acceptance check. Keep the change narrow.
4. Run relevant tests and build checks. Mark that one checkbox `[x]` only after the work passes. Inspect the staged diff and commit as `LNNN: short description`.
5. Publish according to the automation's existing branch policy. If blocked, leave the task unchecked and explain the blocker. Never skip to the next task or commit user data or credentials.

The first task is **L001: Create Vite React TypeScript app**. The offline personal app is built through L240. Sharing and sync begin only after export, deletion, and privacy controls exist. Product and data boundaries in `docs/ARCHITECTURE.md` take priority over an ambiguous task title.
