# Daily runbook for the existing Claude automation

## Before editing

Work from this repository's root. Inspect `git status` and the most recent commit. If a roadmap commit was already pushed today (America/Denver), stop and report that. If there are unrelated uncommitted changes, leave them untouched and report the conflict.

Read `docs/ARCHITECTURE.md`. Then run:

```sh
node scripts/roadmap.mjs check
node scripts/roadmap.mjs next
```

The first unchecked task is the only task in progress at any time. The numbered task and its “Done when” clause define the smallest acceptable change. Do not work ahead or mark a task complete because code was written without checking its behavior.

## Pace

One run a day works on one task. Foundation tasks usually finish in a run. **A piece may take several days, and that is expected**: up to about four runs is fine when the result is more detailed and better.

- Each run makes one real pass on the current piece (for example: composition and subject, then texture and light, then timeline and particles, then polish) and commits it as `LNNN: what this pass added`. The app must build after every commit.
- Tick the checkbox only in the run where the piece meets the craft bar. Until then the task stays unchecked and stays next.
- Note in `PROGRESS.md` what is done and what the next pass should add.
- Never start a second piece in the same run to raise the count, and never ship a piece early.

## Implement and verify

1. Inspect the files involved. For a piece, decide the composition first: subject, layers, motion, and the small detail.
2. Build it in its own folder using the shared ASCII canvas or three.js stage. Add a focused test for pure helpers.
3. Run it and look at it. Take screenshots at 320px and desktop widths and with reduced motion on. Refine until it meets the craft bar in `README.md`.
4. Run `node --test scripts/roadmap.test.mjs` and the app's tests, lint, typecheck, format check, and build.
5. Review `git diff` for unrelated files, generated output, private content, and secrets.
6. Change exactly one `ROADMAP.md` checkbox from `[ ]` to `[x]`. Run `node scripts/roadmap.mjs check` again.
7. Commit the task and checkbox together as `LNNN: concise description`.

Push each task's commit to `origin main` right away. The daily automation is authorized to push directly to `main`; each run works on the one next task. Do not open pull requests.

If a check fails or a decision is missing, leave the task unchecked and report the exact blocker. Do not skip it.

## Handoff message

Report the task ID, the behavior added, verification performed, commit or review link, and any limitation. If no task was completed, say why and identify the next action needed. When L360 is complete, extend the roadmap with new piece ideas from the “Later ideas” in `README.md`.
