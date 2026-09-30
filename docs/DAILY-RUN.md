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

1. Inspect the files involved and select the smallest coherent implementation.
2. Add a focused test when behavior changes. For documentation or styling, verify the specific acceptance check directly.
3. Run `node --test` for the roadmap tool. Run the app's tests, lint, typecheck, and build scripts that exist at this point in the roadmap. Early tasks may not have every script yet.
4. For a UI task, check keyboard access and a narrow viewport when relevant.
5. Review `git diff` for unrelated files, generated output, private content, and secrets.
6. Change exactly one `ROADMAP.md` checkbox from `[ ]` to `[x]`. Run `node scripts/roadmap.mjs check` again.
7. Commit the task and checkbox together as `LNNN: concise description`.

Push each task's commit to `origin main` right away. The daily automation is authorized to push directly to `main`; each run completes today's target number of tasks, one at a time, in order. Do not open pull requests. If tests fail or a policy, service, or design decision is missing, leave the task unchecked, preserve useful work in a reviewable state, and report the exact blocker. Do not silently skip it.

## Handoff message

Report the task ID, the behavior added, verification performed, commit or review link, and any limitation. If no task was completed, say why and identify the next action needed. When L360 is complete, report the finished roadmap so the owner can stop the existing automation.
