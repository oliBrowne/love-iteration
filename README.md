# Love Iteration

> A little closer, one small step at a time.

I'm building this for my long-distance girlfriend: a little place to keep the things that make us feel close, even when we're far apart. A kind note. A memory worth keeping. An idea for our next evening together. Something beautiful that grows through everyday care.

Claude helps me build it a little each day. Every run should leave one useful improvement behind. Over time, those small changes become a thoughtful app and a GitHub contribution graph full of real progress.

## What we're building

A calm, personal web app that feels like opening a letter from someone you love. It should be comfortable on a phone and useful in a couple of minutes.

The experience can grow to include:

- **A little note for you:** a place for messages I write in my own words.
- **Our memories:** moments, gratitude, and stories we want to keep.
- **Time together:** simple date ideas and rituals we can enjoy across the distance.
- **Our two worlds:** optional time-zone clocks and a countdown when we have a real reunion date.
- **A quiet check-in:** room to notice how the day felt and what we appreciated.

Start with a personal space that stores entries on the device. Add sharing later, with clear choices about what each person can see. Personal writing and relationship details come from us; Claude builds the space to hold them.

### How it should feel

Warm paper tones, a soft rose accent, generous space, and readable type. Make the small details feel cared for: a welcoming empty state, a comfortable reading width, a button that is easy to tap. Keep motion gentle and respect reduced-motion preferences. Use affectionate, natural language.

## Where the project stands

The `main` branch starts with this guide. A React, TypeScript, and Vite starter, agent instructions, and a detailed 360-task roadmap are available in [draft pull request #1](https://github.com/oliBrowne/love-iteration/pull/1).

Always inspect the branch you're working on. If `ROADMAP.md` exists, it is the task queue: use its first unchecked task and its acceptance check. Read `CLAUDE.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, and `docs/DAILY-RUN.md` when present. Follow their task order and technical boundaries, and apply the personal direction above to the experience.

If the branch has only this README, use the starter queue below. Check existing code before beginning so completed work is never recreated.

## The daily rhythm for Claude

**One run. One small, complete improvement. One clear handoff.**

1. **Get your bearings.** Read the instructions, inspect `git status` and recent commits, and check the current app. Use the existing automation's working branch and synchronization policy. Preserve unrelated edits. If a daily task has already been completed today in the automation's configured timezone, report that and stop.
2. **Choose the next step.** With `ROADMAP.md`, complete exactly its first unchecked task. When the roadmap helper exists, run `node scripts/roadmap.mjs check` and `node scripts/roadmap.mjs next`. Otherwise, choose the first unchecked starter task below. State the intended result in one sentence.
3. **Keep the change small.** Finish that task's observable outcome. Reuse the current stack and components. Leave later features for later runs. If a task cannot fit in one run, record what remains and leave it unchecked.
4. **Verify the result.** Run the relevant checks that actually exist. Once the app has a build command, run it. Test meaningful behavior changes; inspect copy and styling directly. For UI work, check a narrow phone layout, keyboard access, visible focus, and any empty or error state you changed.
5. **Leave a useful handoff.** Mark the task complete only after its acceptance check passes. Append a short entry to `PROGRESS.md` using the format below, creating the file on the first completed implementation task. Update setup instructions when commands change.
6. **Commit the improvement.** Review the diff and stage only the task's files. Include its checkbox and progress entry in the same commit. Use `LNNN: short description` for the existing roadmap, or `SNN: short description` for the starter queue. Publish through the existing automation's branch policy. If it uses pull requests, keep that workflow.
7. **Stop with a clear result.** Report the task, what changed, checks performed, commit or review link, and the next task. If blocked, leave the task unchecked and explain the exact blocker. Preserve useful work and any local commit if publishing fails; do not skip ahead or claim success.

Keep the habit sustainable: a real bug fix, accessibility improvement, or useful documentation change can be a good day's work. Use honest dates and meaningful commits. Avoid empty commits, repetitive copy changes, or splitting one change into lots of commits just to add green squares.

### Progress entry

```text
## YYYY-MM-DD — task ID: short title
- Changed: the specific improvement someone can see or use.
- Verified: commands run and the manual checks actually performed.
- Next: the next task ID and its intended outcome.
- Blockers: none, or the exact unresolved issue.
```

A day is complete when the change works, relevant checks pass, the task record is accurate, and the next run has enough context to continue.

## Starter queue

Use this queue only while `ROADMAP.md` is absent. These are small increments, not deadlines. When the detailed roadmap is adopted, reconcile completed work with its acceptance checks and use that roadmap as the single queue.

- [ ] **S01 — Plant the first seed.** Create a minimal React, TypeScript, and Vite app. Done when the development server shows the Love Iteration heading, a production build succeeds, and the actual setup commands are documented.
- [ ] **S02 — Give it a warm welcome.** Add a short introduction and a calm page layout. Done when the home page reads well at phone and desktop widths without horizontal overflow.
- [ ] **S03 — Establish the visual style.** Define shared colors, type sizes, spacing, and focus styles. Done when the home page uses them consistently and its text is comfortably readable.
- [ ] **S04 — Make room for a note.** Add a labelled note field and an empty state. Done when someone can type a note and preview it on the page; clearly state that it is not saved yet.
- [ ] **S05 — Keep that note.** Add a small storage interface backed by IndexedDB. Done when the note survives a reload and a failed save produces a clear message. Verify save and load behavior.
- [ ] **S06 — Let the note change.** Add edit and delete controls. Done when both persist after reload and deletion requires an intentional confirmation.
- [ ] **S07 — Make it comfortable to use.** Check the current flow with a keyboard and at a narrow viewport. Done when labels, focus order, tap targets, and layout support the full note flow.
- [ ] **S08 — Start a memory collection.** Add a memory list with a thoughtful empty state. Done when the list renders from clearly labelled demo records, with no invented personal history.
- [ ] **S09 — Add our own memories.** Add a simple form and reuse the storage interface. Done when a new memory appears in the list and survives a reload.
- [ ] **S10 — Keep memories editable.** Add edit and delete actions. Done when both update the stored collection and the empty state returns after the last item is removed.
- [ ] **S11 — Plan a little time together.** Add a small collection of editable date ideas. Done when an idea can be added, marked as tried, and restored after reload.
- [ ] **S12 — See each other's time.** Add two optional, configurable time-zone clocks. Done when valid IANA time zones display the right local times and missing settings show a helpful prompt. Test daylight-saving behavior.
- [ ] **S13 — Protect what we've written.** Add an export of local notes, memories, and ideas. Done when a downloaded file contains the saved records and its format is documented. Use demo data for checks.
- [ ] **S14 — Make the next small plan.** Review the working experience and add five concrete tasks to this queue based on actual gaps. Give each a completion check. Prioritize restoring exports, reliability, accessibility, and feedback from using the app before adding more features.

Later ideas include a reunion countdown, favourite memories, gentle reading transitions, and shared rituals. Add them when they have a clear purpose. Keep extending a small, ordered queue based on what the app needs. If using the finite 360-task roadmap, report when it is finished so the owner can decide what comes next.

## Technical direction and setup

Use React, TypeScript, and Vite, matching the existing draft. Keep components small, put date and validation logic in testable functions, and keep browser storage behind an interface. Add dependencies when they solve a concrete problem. The first useful version should work without an account or a hosted backend.

On a branch that already contains the starter and its `package-lock.json`:

```sh
npm ci
npm run dev
```

Open the local URL printed by the development server. Inspect `package.json` for the available build, test, lint, and typecheck commands; run the checks relevant to the change. With only this README checked out, begin with S01 to create the app and those commands.

Keep personal entries out of the public repository, fixtures, logs, and screenshots. Use explicit demo content for development. Browser storage belongs to that browser and device; describe it accurately and provide export and recovery before depending on it for irreplaceable writing. Introduce partner sharing only after the app has clear export, deletion, and sharing controls.

## Prompt for the existing daily Claude run

Copy this into the automation that already runs Claude in this repository:

```text
Continue Love Iteration by one small, meaningful step today.

Read README.md and any CLAUDE.md, AGENTS.md, architecture, and daily-run
instructions present. Inspect the current branch, worktree, and recent
commits. Preserve unrelated work. If today's daily task is already complete
in the automation's configured timezone, report that and stop.

If ROADMAP.md exists, validate it with the helper when available and complete
exactly its first unchecked task. Otherwise, complete the first unchecked
starter task in README.md. Use its acceptance check to define the scope.

Build a warm, thoughtful space for my long-distance girlfriend and me.
Keep the implementation small and consistent with the current code. Use
clearly labelled demo content wherever personal details have not been given.

Verify the change with existing relevant checks and a build when available.
For UI changes, inspect phone layout and keyboard use. Mark only the completed
task, add a factual PROGRESS.md entry, and review the diff. Commit the task
and its records together with a descriptive task-ID message. Follow the
existing automation's branch and publishing policy.

If blocked, leave the task unchecked and report the blocker without skipping
ahead. Finish with what changed, checks performed, the commit or review link,
and the next task. Make a commit only for meaningful, verified progress.
```

## Helping the green squares reflect the work

Configure the daily runner's Git author email to an address connected to your GitHub account, including your GitHub-provided `noreply` address if preferred. Ensure completed work reaches the repository's default branch through your chosen workflow. Commits left only on a feature branch do not count toward the commit contribution graph until they reach an eligible branch, and qualifying contributions can take up to 24 hours to appear. See [GitHub's contribution troubleshooting guide](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions).

The existing Claude automation supplies the schedule. This README supplies a direction and a next step each time it runs.

---

*Built a little at a time, for someone I love.*
