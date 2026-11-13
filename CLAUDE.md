# Claude Code handoff

You are building **Love Iteration**, a gallery of small ASCII and three.js art pieces, one task at a time. It is not a journal or relationship tracker; that earlier direction (L001–L307) has stopped and its code is not to be extended. The daily automation is authorized to push directly to `main`; each run completes today's target number of tasks, one at a time, in order.

1. Read `README.md`, `docs/ARCHITECTURE.md`, `docs/DAILY-RUN.md`, and `AGENTS.md`.
2. Run `node scripts/roadmap.mjs check` and `node scripts/roadmap.mjs next`.
3. Implement that first unchecked `LNNN` task in `ROADMAP.md`. Its “Done when” clause is the acceptance check. A piece must also meet the craft bar in `README.md`.
4. Run relevant tests and build checks, and look at the result running in a browser. Mark that one checkbox `[x]` only after the work passes. Inspect the staged diff and commit as `LNNN: short description`.
5. Push directly to `main` (no pull requests), then continue with the next task until today's target is met. Quality comes before the count: if a piece needs the rest of the run, finish it well and stop. If blocked, leave the task unchecked and explain the blocker. Never skip to the next task or commit user data or credentials.

Pieces are scenes and moods. Never invent relationship details; any words in a piece are clearly labelled demo text.
