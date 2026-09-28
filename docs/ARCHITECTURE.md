# Love Iteration architecture

## Product

Love Iteration helps an individual or consenting pair notice what is going well, discuss what needs care, and turn ideas into shared time. It should feel calm and useful in under two minutes a day. The product is a journal and planner; it does not score people, diagnose relationships, or send automated advice about a partner.

The core loop is **check in → appreciate → plan → reflect**. Each step stands alone, so the app remains useful when someone skips a day. A local-only personal space comes first. Sharing is opt-in and can be turned off without losing a personal export.

## Release sequence

1. **Days 1–60:** Working app shell and personal check-ins.
2. **Days 61–150:** Gratitude, memories, date ideas, and rituals.
3. **Days 151–240:** Weekly reflection, search, accessibility, export, import, and privacy controls. This is a complete offline release.
4. **Days 241–330:** Self-hostable server, explicit partner invitations, sync, and conflict handling.
5. **Days 331–360:** Reliability, security review, documentation, and release packaging.

The 360 tasks in `ROADMAP.md` are sequential. A daily run implements one task, updates its checkbox, tests it, and makes one commit. Reordering requires an explicit roadmap edit with an explanation in the commit.

## Technical shape

The first application uses React, TypeScript, and Vite. Domain rules are pure TypeScript functions. Browser persistence is behind a small repository interface backed by IndexedDB. UI components do not read storage directly. Dates are stored as ISO strings and rendered in the user's locale. Stored records have stable IDs, a schema version, creation time, and update time. Runtime validation is at the persistence boundary.

Unit tests cover domain rules and repository behavior. Browser tests cover the core flows. Accessibility checks are part of feature completion. A simple static build works offline after first load. Avoid analytics, tracking, and third-party fonts.

Optional sharing adds a small Node/TypeScript API with SQLite and migrations. The API owns accounts, invitations, and synchronization. It never silently uploads local records. Sync is per record with a revision and deletion marker; the UI offers a clear resolution flow for conflicting edits. Do not promise end-to-end encryption: the server can read shared records in this design. Transport must use HTTPS outside local development. The server is self-hostable before any managed deployment is considered.

## Data boundaries

- Personal records stay on the device until the person explicitly enables sharing.
- Never put journal text in URLs, logs, crash reports, or Git commits.
- A partner invite grants access only to the selected shared space. Personal entries remain personal.
- Export and deletion must work before account or sync features ship.
- Provide clear controls for leaving a shared space and revoking invitations.
- No push notifications or email messages are sent until the person explicitly opts in.

## Definition of done for one day

The task's acceptance check passes, the smallest relevant automated tests pass, the app still builds once it exists, changed UI is keyboard-usable, and the commit contains the task ID. If a task cannot be completed safely, record a blocker and stop. Do not mark it complete or jump to the next task.
