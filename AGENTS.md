# Daily development rules

Love Iteration is a gallery of hand-made ASCII and three.js art pieces. Read `docs/ARCHITECTURE.md` and run `node scripts/roadmap.mjs next` before editing. Complete today's target number of tasks from `ROADMAP.md`, one at a time, in order. Do not skip or silently rewrite tasks.

A piece is one task and one commit. Plan its composition, build it, then run it and look at it: take a screenshot at a phone width and at desktop width, and with reduced motion on. Refine it until it meets the craft bar in `README.md` (composed, alive, detailed, polished, considerate). A piece that is technically working but plain is not done. Quality comes before the count: finishing fewer pieces well is a good run.

Add or adjust a test when behavior changes (registry entries, frame generators, fallbacks). Run tests, lint, typecheck, and build, and inspect the diff. Mark only that task `[x]` after verification. Commit with `LNNN: short description`. The daily automation is authorized to push directly to `main`; each run completes today's target number of tasks, one at a time, in order. If publication fails, keep the local commit and report the exact blocker.

Do not fabricate a passing test or commit generated build output. Never invent relationship details, names, dates, or messages; words inside a piece are clearly labelled demo text. Do not extend the old journal features or the `api/` server. No analytics, tracking, or third-party fonts.

Keep each piece in its own small module with pure helpers where possible (frame generators, geometry builders). Use three.js for 3D scenes; avoid other new dependencies unless a piece truly needs one.
