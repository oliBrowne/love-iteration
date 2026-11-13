# Daily runbook for the existing Claude automation

## Before editing

Work from this repository's root. Inspect `git status` and the most recent commit. If today's target is already met (see below), stop and report that. If there are unrelated uncommitted changes, leave them untouched and report the conflict.

Read `docs/ARCHITECTURE.md`. Then run:

```sh
node scripts/roadmap.mjs check
node scripts/roadmap.mjs next
```

The first unchecked task is the only task in progress at any time. The numbered task and its “Done when” clause define the smallest acceptable change. Do not work ahead or mark a task complete because code was written without checking its behavior.

## Daily target

Timezone is `America/Denver`. The target is deterministic, so a re-run on the same day never overshoots:

```sh
export TZ=America/Denver
TODAY=$(date +%F)
TARGET=$(node -e 'console.log(require("crypto").createHash("sha256").update(process.argv[1]).digest()[0]%12+1)' "$TODAY")
DONE=$(git log origin/main --since="$TODAY 00:00" --author=ofbrowne4@gmail.com --grep='^L[0-9]\{3\}:' --oneline | wc -l)
```

Complete `TARGET - DONE` tasks (1–12 per day). If that is 0 or less, report that today's target is already met and stop. Each task is its own real commit; never make empty commits or split a task to pad the count.

## Implement and verify

1. Inspect the files involved. For a piece, decide the composition first: subject, layers, motion, and the small detail.
2. Build it in its own folder using the shared ASCII canvas or three.js stage. Add a focused test for pure helpers.
3. Run it and look at it. Take screenshots at 320px and desktop widths and with reduced motion on. Refine until it meets the craft bar in `README.md`.
4. Run `node --test scripts/roadmap.test.mjs` and the app's tests, lint, typecheck, format check, and build.
5. Review `git diff` for unrelated files, generated output, private content, and secrets.
6. Change exactly one `ROADMAP.md` checkbox from `[ ]` to `[x]`. Run `node scripts/roadmap.mjs check` again.
7. Commit the task and checkbox together as `LNNN: concise description`.

Push each task's commit to `origin main` right away. The daily automation is authorized to push directly to `main`; each run completes today's target number of tasks, one at a time, in order. Do not open pull requests.

**Quality comes before the count.** The target is an upper aim, not a quota. If a piece needs the rest of the run to be good, finish it and stop, and report how many tasks were completed. Never ship a plain or rushed piece to reach the number. If a check fails or a decision is missing, leave the task unchecked and report the exact blocker. Do not skip it.

## Handoff message

Report the task ID, the behavior added, verification performed, commit or review link, and any limitation. If no task was completed, say why and identify the next action needed. When L360 is complete, extend the roadmap with new piece ideas from the “Later ideas” in `README.md`.
