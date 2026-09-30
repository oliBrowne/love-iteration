# Daily development rules

Read `docs/ARCHITECTURE.md` and run `node scripts/roadmap.mjs next` before editing. Complete today's target number of tasks from `ROADMAP.md`, one at a time, in order. Keep each day's change small and coherent. Do not skip or silently rewrite tasks.

Inspect the current code and tests. Implement the task, add or adjust a meaningful test when behavior changes, run the relevant tests and build, and inspect the diff. Mark only that task `[x]` after verification. Commit with `LNNN: short description`. The daily automation is authorized to push directly to `main`; each run completes today's target number of tasks, one at a time, in order. If publication fails, keep the local commit and report the exact blocker without asking for secrets or putting credentials in the repository.

Do not fabricate a passing test, commit generated build output, or upload personal journal content. Never paste credentials into prompts or files. Sharing and network features require explicit product controls described in the architecture. If the next task depends on a missing service or policy decision, leave it unchecked and report what is needed.

Keep app and test code understandable for a small local model. Prefer pure functions, narrow modules, and direct tests. Avoid installing a dependency when a small standard API suffices. Update README only when setup or visible behavior changes.
