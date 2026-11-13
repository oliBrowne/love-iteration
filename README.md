# Love Iteration

> A little gallery, made one piece at a time.

I'm building this for my long-distance girlfriend: a small collection of art she can open whenever she likes. Every piece is hand-made in **ASCII** or **three.js**: a paper boat on a slow river, lanterns drifting up at dusk, a cat asleep on a letter. Nothing to fill in, nothing to track. Just something cute and carefully made, with one more piece added over time.

Claude helps me build it a little each day. Each run should leave the collection a little richer, and the GitHub history a record of real work.

## What it is

- **A gallery.** The home page is the collection: a grid of pieces with live previews.
- **Pieces.** Each one opens full screen with a title and a short caption. Some move on their own; some respond to a touch or the pointer.
- **Two mediums.** ASCII pieces are animated text art in a monospace frame. three.js pieces are small 3D scenes.

It is not a relationship tracker, a journal, or a planner. No forms, scores, streaks, or reminders.

### How it should feel

Cute, warm, and a bit magical. Paper and ink tones, a soft rose accent, dusk blues for night scenes. Slow, gentle motion. Small surprises that reward looking twice: an ear flick, a shooting star, steam that briefly curls together. It should look good on a phone first.

### The craft bar

A piece is finished only when all of this is true:

- **Composed.** It reads as a deliberate picture, with a clear subject, depth, and balance. Not a tech demo or a single spinning shape.
- **Alive.** It has at least two layers of motion or one real interaction, and it loops without a visible jump.
- **Detailed.** There is at least one small touch someone would smile at on a second look.
- **Polished.** It looks right at 320px wide and on desktop, has a title and caption, and stays smooth on a phone.
- **Considerate.** Reduced motion shows a composed still. A short text description stands in for screen readers.

One beautiful piece is worth more than five rushed ones. If a piece isn't there yet, keep working on it or leave the task unchecked and say why.

## Where the project stands

The roadmap in `ROADMAP.md` is on `main`. Tasks L001–L307 built an earlier version, a journal with a sharing server. That direction was wrong for this project and has stopped. The code is still in the repository (`src/features`, `api/`) but nothing new is built on it, and the gallery replaces it as the home page.

From L308 the roadmap is the gallery: first the foundation (ASCII canvas, three.js stage, gallery home), then the collection of pieces, then polish. `docs/ARCHITECTURE.md` describes how pieces are built.

## The daily rhythm for Claude

1. **Get your bearings.** Read `CLAUDE.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, and `docs/DAILY-RUN.md`. Check `git status` and recent commits.
2. **Take the next task.** Run `node scripts/roadmap.mjs check` and `node scripts/roadmap.mjs next`. The first unchecked task is the only one in progress.
3. **Make it well.** For a piece, sketch the composition first, build it, then look at it running and refine it until it meets the craft bar.
4. **Verify.** Run typecheck, lint, tests, and build. Look at the piece at a phone width, with reduced motion on, and with the keyboard.
5. **Record it.** Tick the task, add a `PROGRESS.md` entry, and commit as `LNNN: short description`, pushed to `main`.
6. **Don't rush the count.** Stopping after fewer, finished pieces is a good run. A rushed piece is not.

Use honest dates and meaningful commits. Never make empty commits or split one piece into several commits.

### Progress entry

```text
## YYYY-MM-DD — task ID: short title
- Changed: what someone can now see.
- Verified: commands run and what was actually looked at.
- Next: the next task ID and its intended outcome.
- Blockers: none, or the exact unresolved issue.
```

## Running it

```sh
npm ci
npm run dev
```

Open the local address it prints. On Windows PowerShell, use `npm.cmd` if scripts are blocked.

## Rules for content

Pieces are scenes and moods, not our story. Never invent relationship details, names, dates, or messages. Any words inside a piece (a typed line, a postcard) are clearly labelled demo text. Never commit personal entries, secrets, or tokens. No analytics, tracking, or third-party fonts.

## Later ideas

More pieces in both mediums, seasonal pieces, pieces that change with the time of day, a piece that shows two time zones as two skies, a reunion countdown drawn as a scene once there is a real date, and pieces she can gently play with. Add them to the roadmap when the current list runs out.

---

*Made a little at a time, for someone I love.*
