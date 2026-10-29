# Progress

## 2026-09-30 — L002: add typecheck script
- Changed: npm run typecheck now runs the TypeScript check; npm run build already existed.
- Verified: npm run typecheck, npm run build, node --test scripts/roadmap.test.mjs all pass.
- Next: L003 add Vitest runner with a sample domain test.
- Blockers: none

## 2026-09-30 — L003: add Vitest test runner
- Changed: npm test runs Vitest over src/**/*.test.ts with a sample greeting domain test.
- Verified: npm test (2 passed), npm run typecheck, npm run build, node --test scripts/roadmap.test.mjs.
- Next: L004 add Playwright browser smoke test.
- Blockers: none

## 2026-09-30 — L004: add Playwright browser test runner
- Changed: npm run test:e2e builds the app, serves it, and a smoke test opens it and checks the Love Iteration heading.
- Verified: npm run test:e2e (1 passed, using pre-installed Chromium via PW_CHROMIUM_PATH), npm test, npm run typecheck, npm run build, node --test scripts/roadmap.test.mjs.
- Next: L005 add ESLint configuration.
- Blockers: none

## 2026-09-30 — L005: add ESLint configuration
- Changed: npm run lint checks TypeScript and React hooks rules across the project.
- Verified: npm run lint (clean), npm run typecheck, npm test, npm run build, node --test scripts/roadmap.test.mjs.
- Next: L006 add Prettier formatting script.
- Blockers: none

## 2026-10-01 — L006: add Prettier formatting script
- Changed: npm run format and npm run format:check now format and verify the project.
- Verified: npm run format:check, lint, typecheck, test, node --test roadmap.
- Next: L007 strict TypeScript settings.
- Blockers: none

## 2026-10-01 — L007: add strict TypeScript settings
- Changed: tsconfig now enables strict, noImplicitAny and noUncheckedIndexedAccess.
- Verified: Confirmed an implicit-any file fails typecheck (TS7006) then removed it; typecheck, build, lint, format:check, tests pass.
- Next: L008 source folder boundaries.
- Blockers: none

## 2026-10-01 — L008: create source folder boundaries
- Changed: src now has domain, data, features, and ui folders, each with an index file.
- Verified: typecheck, build, lint, format:check, npm test pass.
- Next: L009 route names type.
- Blockers: none

## 2026-10-01 — L009: define app route names
- Changed: A Route type and labels list Home, Check-in, Ideas, and Settings.
- Verified: typecheck, build, lint, format:check, npm test (new routes test) pass.
- Next: L010 render Home route.
- Blockers: none

## 2026-10-01 — L010: render Home route
- Changed: Direct load now shows a Home page with a Home heading under the app title.
- Verified: typecheck, build, lint, format:check; test:e2e (2 passed, incl. new home spec) with PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194.
- Next: L011 render Settings route via navigation.
- Blockers: none

## 2026-10-01 — L011: render Settings route
- Changed: A main navigation with Home and Settings links; Settings opens a Settings page via hash route.
- Verified: typecheck, build, lint, format:check, npm test (4 passed), test:e2e (3 passed incl. settings spec).
- Next: L012 shared page layout header.
- Blockers: none

## 2026-10-01 — L012: add shared page layout
- Changed: Home and Settings now render inside one PageLayout with the same header and navigation.
- Verified: typecheck, build, lint, format:check, npm test, test:e2e (4 passed incl. layout spec).
- Next: L013 skip-to-content link.
- Blockers: none

## 2026-10-01 — L013: add skip-to-content link
- Changed: A Skip to content link appears on first Tab and moves focus to the main area without changing the page route.
- Verified: typecheck, build, lint, format:check, test:e2e (6 passed, incl. keyboard skip specs).
- Next: L014 visible focus style.
- Blockers: none

## 2026-10-01 — L014: add visible focus style
- Changed: Links, buttons and focusable regions show a soft rose 3px focus ring on keyboard focus.
- Verified: typecheck, build, lint, format:check, test:e2e (7 passed incl. focus ring computed-style check).
- Next: L015 color tokens.
- Blockers: none

## 2026-10-02 — L015: define color tokens
- Changed: Paper, surface, ink and rose accent colors are now CSS custom properties; component styles use them with no literal colors.
- Verified: typecheck, build, lint, format:check, npm test (5 passed incl. new token test), roadmap test, test:e2e (7 passed).
- Next: L016 typography tokens.
- Blockers: none

## 2026-10-02 — L016: define typography tokens
- Changed: Body text and h1/h2 headings now take size and line height from shared CSS tokens.
- Verified: typecheck, build, lint, format:check, npm test (6 passed incl. typography test), roadmap test, test:e2e (7 passed).
- Next: L017 narrow-screen spacing, no overflow at 320px.
- Blockers: none

## 2026-10-02 — L017: add narrow-screen spacing
- Changed: The page has comfortable side padding and a readable max width; Home no longer overflows sideways at 320px.
- Verified: typecheck, build, lint, format:check, npm test, roadmap test, test:e2e (8 passed incl. new 320px overflow spec).
- Next: L018 Button component with unit test.
- Blockers: none

## 2026-10-02 — L018: create Button component
- Changed: A shared Button (rose accent, 44px tap target, disabled style) is available from the ui folder; added jsdom and Testing Library as dev dependencies for component tests.
- Verified: typecheck, build, lint, format:check, npm test (8 passed incl. Button click and disabled), roadmap test, test:e2e (8 passed).
- Next: L019 TextField component with connected label.
- Blockers: none

## 2026-10-02 — L019: create TextField component
- Changed: A shared TextField pairs a visible label with its input and shows the rose focus ring.
- Verified: typecheck, build, lint, format:check, npm test (9 passed incl. label-to-input test), roadmap test, test:e2e (8 passed).
- Next: L020 TextArea component.
- Blockers: none

## 2026-10-02 — L020: create TextArea component
- Changed: A shared TextArea pairs a visible label with its multi-line control, styled like TextField.
- Verified: typecheck, build, lint, format:check, npm test (10 passed incl. label-to-textarea test), roadmap test, test:e2e (8 passed).
- Next: L021 EmptyState component.
- Blockers: none

## 2026-10-03 — L021: create EmptyState component
- Changed: A shared EmptyState shows empty-list text as plain readable content.
- Verified: typecheck, build, lint, format:check, npm test (11 passed incl. new component test), roadmap test
- Next: L022 InlineError component.
- Blockers: none

## 2026-10-03 — L022: create InlineError component
- Changed: A shared InlineError shows a problem message that screen readers announce as an alert.
- Verified: typecheck, build, lint, format:check, npm test (12 passed incl. alert test), roadmap test
- Next: L023 LoadingState component.
- Blockers: none

## 2026-10-03 — L023: create LoadingState component
- Changed: A shared LoadingState announces a busy wait as a status message (no animation).
- Verified: typecheck, build, lint, format:check, npm test (13 passed incl. status test), roadmap test
- Next: L024 GitHub Actions checks workflow.
- Blockers: none

## 2026-10-04 — L024: add GitHub Actions checks
- Changed: Pull requests and pushes to main now run lint, typecheck, tests, roadmap test, and build in CI.
- Verified: ran each of those commands locally (all pass); prettier check on the workflow file.
- Next: L025 no-tracking CSP baseline for the static page.
- Blockers: none

## 2026-10-04 — L025: add no-tracking CSP baseline
- Changed: The built page carries a Content-Security-Policy that only allows same-origin scripts and connections (dev server unaffected).
- Verified: lint, typecheck, npm test (15 passed incl. new CSP test), build (dist/index.html contains the meta tag, only a same-origin script), format:check, roadmap test.
- Next: L026 domain record metadata type.
- Blockers: none

## 2026-10-04 — L026: define domain record metadata
- Changed: A shared RecordMetadata type (id, schemaVersion, createdAt, updatedAt) is available from the domain module.
- Verified: lint, typecheck, npm test (16 passed incl. type test), build, format:check, roadmap test.
- Next: L027 ID generator.
- Blockers: none

## 2026-10-04 — L027: add ID generator
- Changed: generateId() and isValidId() in the domain module create and check unique record IDs.
- Verified: lint, typecheck, npm test (18 passed incl. 100 distinct valid IDs), build, format:check, roadmap test.
- Next: L028 ISO timestamp helper.
- Blockers: none

## 2026-10-04 — L028: add ISO timestamp helper
- Changed: nowIso() in the domain module returns the current time as an ISO string.
- Verified: lint, typecheck, npm test (19 passed incl. frozen-time test), build, format:check, roadmap test.
- Next: L029 repository interface.
- Blockers: none

## 2026-10-04 — L029: define repository interface
- Changed: A Repository<T> interface (get, list, put, delete) is exported from the data module for later IndexedDB storage.
- Verified: lint, typecheck, npm test (20 passed incl. in-memory implementation test), build, format:check, roadmap test.
- Next: L030 Playwright smoke test from Home to Settings.
- Blockers: none

## 2026-10-04 — L030: add shell browser smoke test
- Changed: A Playwright test navigates Home to Settings and back, against the built page (so it also exercises the CSP).
- Verified: lint, typecheck, npm test, format:check, roadmap test; full Playwright suite 9 passed twice. One earlier cold-start run had the existing focus-ring test fail on first Tab (passed alone and in both reruns), likely a timing flake on a cold build.
- Next: L031 check-in record type.
- Blockers: none

## 2026-10-05 — L031: define check-in record
- Changed: A CheckIn type (date, mood, note, record metadata) and the moods list are exported from the domain module.
- Verified: lint, typecheck, npm test (type test), build, format:check, roadmap test.
- Next: L032 validate mood choice.
- Blockers: none

## 2026-10-05 — L032: validate mood choice
- Changed: parseMood/isMood and a DomainError class reject unsupported moods with code invalid-mood.
- Verified: lint, typecheck, npm test (23 passed), build, format:check, roadmap test.
- Next: L033 validate local date.
- Blockers: none

## 2026-10-05 — L033: validate local date
- Changed: parseLocalDate/isLocalDate reject malformed or impossible dates with code invalid-date.
- Verified: lint, typecheck, npm test (25 passed), build, format:check, roadmap test.
- Next: L034 IndexedDB database opener.
- Blockers: none

## 2026-10-05 — L034: add IndexedDB database opener
- Changed: openDatabase() opens the local database and creates the checkins store (fake-indexeddb added as a dev-only test dependency).
- Verified: lint, typecheck, npm test (27 passed incl. store creation), build, format:check, roadmap test.
- Next: L035 check-in repository save.
- Blockers: none

## 2026-10-05 — L035: add check-in repository save
- Changed: createCheckInRepository(db) can put and get check-ins in IndexedDB; a read after a write returns the record.
- Verified: lint, typecheck, npm test (30 passed incl. read-after-write), build, format:check, roadmap test.
- Next: L036 repository list, newest date first.
- Blockers: none

## 2026-10-05 — L036: add check-in repository list
- Changed: The check-in repository lists saved check-ins newest date first.
- Verified: lint, typecheck, npm test (32 passed incl. ordering), build, format:check, roadmap test.
- Next: L037 repository delete.
- Blockers: none

## 2026-10-05 — L037: add check-in repository delete
- Changed: The check-in repository now implements the full Repository interface, including delete.
- Verified: lint, typecheck, npm test (34 passed incl. delete), build, format:check, roadmap test.
- Next: L038 render Check-in route.
- Blockers: none

## 2026-10-05 — L038: render Check-in route
- Changed: A Check-in link in the header opens a Check-in screen at #/check-in.
- Verified: lint, typecheck, npm test (34 passed), build, format:check, roadmap test, Playwright 10 passed incl. new check-in navigation test.
- Next: L039 mood selection controls.
- Blockers: none

## 2026-10-05 — L039: add mood selection controls
- Changed: The Check-in screen shows a radio group of five moods; arrow keys move and select exactly one.
- Verified: lint, typecheck, npm test (36 passed), build, format:check, roadmap test, Playwright 11 passed incl. keyboard mood selection.
- Next: L040 note field.
- Blockers: none

## 2026-10-05 — L040: add note field
- Changed: The Check-in screen has an optional plain-text note field.
- Verified: lint, typecheck, npm test (38 passed), build, format:check, roadmap test.
- Next: L041 check-in submit action saving to the view.
- Blockers: none

## 2026-10-05 — L041: add check-in submit action
- Changed: Save check-in stores the mood and note locally (IndexedDB) and lists saved check-ins newest first, surviving reload.
- Verified: lint, typecheck, npm test (40 passed), build, format:check, roadmap test, Playwright 12 passed incl. save + reload.
- Next: L042 reject empty mood submit with inline error.
- Blockers: none

## 2026-10-05 — L042: reject empty mood submit
- Changed: Saving without a mood shows an inline error and stores nothing (also fixed the L038 e2e heading match, which the new Saved check-ins heading had made ambiguous).
- Verified: lint, typecheck, npm test (42 passed), build, format:check, roadmap test, Playwright 13 passed.
- Next: L043 limit note length.
- Blockers: none

## 2026-10-05 — L043: limit note length
- Changed: The note shows characters remaining (500 max); over the limit it shows how far over and Save is disabled.
- Verified: lint, typecheck, npm test (44 passed), build, format:check, roadmap test, Playwright 13 passed.
- Next: L044 today's check-in summary on Home.
- Blockers: none

## 2026-10-06 — L044: add today's check-in summary
- Changed: Home shows "Today you checked in feeling <mood>" when a check-in is saved for today.
- Verified: lint, typecheck, npm test (46 passed), build, format:check, roadmap test, Playwright 14 passed (using pre-installed Chromium).
- Next: L045 allow one check-in per day (repeat save updates the same day).
- Blockers: none

## 2026-10-06 — L045: allow one check-in per day
- Changed: Saving again on the same day updates today's check-in (same id and created time) instead of adding a second one.
- Verified: lint, typecheck, npm test (47 passed), build, format:check, roadmap test, Playwright 15 passed (using pre-installed Chromium).
- Next: L046 show today's edited time (summary renders updatedAt in local time).
- Blockers: none

## 2026-10-07 — L046: show today's edited time
- Changed: Home's summary now adds "Last edited at <time>" using the check-in's updatedAt in local time.
- Verified: lint, typecheck, npm test (49 passed), build, format:check, roadmap test, Playwright 15 passed (using pre-installed Chromium).
- Next: L047 add edit-today control (saved values populate the form).
- Blockers: none

## 2026-10-08 — L047: add edit-today control
- Changed: Home links to "Edit today's check-in", and the check-in form opens with today's saved mood and note filled in.
- Verified: lint, typecheck, npm test (51 passed), build, format:check, roadmap test, Playwright 15 passed (using pre-installed Chromium).
- Next: L048 add delete-today control (confirmation precedes deletion).
- Blockers: none

## 2026-10-09 — L048: add delete-today control
- Changed: Home offers a Delete today's check-in button that asks for confirmation (Yes, delete / Keep it) before removing it.
- Verified: lint, typecheck, npm test (53 passed), build, format:check, roadmap test.
- Next: L049 check-in history list (earlier dates under a heading).
- Blockers: none

## 2026-10-09 — L049: add check-in history list
- Changed: Home lists earlier check-ins (date and mood) under an "Earlier check-ins" heading, newest first.
- Verified: lint, typecheck, npm test (54 passed), build, format:check, roadmap test.
- Next: L050 history empty state with clear first-time instructions.
- Blockers: none

## 2026-10-09 — L050: add history empty state
- Changed: With no earlier check-ins, the history section tells first-time users to open Check-in, pick a feeling, and save.
- Verified: lint, typecheck, npm test (55 passed), build, format:check, roadmap test.
- Next: L051 history date labels distinguishing today from older dates.
- Blockers: none

## 2026-10-09 — L051: add history date labels
- Changed: History rows show Today, Yesterday, or a readable date like Jan 3, 2026 instead of raw ISO dates.
- Verified: lint, typecheck, npm test (58 passed), build, format:check, roadmap test.
- Next: L052 history mood labels with visible text alternatives for icons.
- Blockers: none

## 2026-10-09 — L052: add history mood labels
- Changed: Each history row shows a mood icon (hidden from screen readers) beside its visible mood word.
- Verified: lint, typecheck, npm test (59 passed), build, format:check, roadmap test.
- Next: L053 history pagination (load another page after 30 items).
- Blockers: none

## 2026-10-09 — L053: add history pagination
- Changed: History shows 30 check-ins at a time with a Show more button that loads the next page.
- Verified: lint, typecheck, npm test (60 passed), build, format:check, roadmap test.
- Next: L054 check-in detail view showing the complete note.
- Blockers: none

## 2026-10-09 — L054: add check-in detail view
- Changed: Each history row has a View button that opens that day's mood and complete note, with a Back to Home button.
- Verified: lint, typecheck, npm test (64 passed), build, format:check, roadmap test. Keyboard: View and Back are native buttons with the existing focus ring.
- Next: L055 previous-day navigation inside the detail view.
- Blockers: none

## 2026-10-09 — L055: add previous-day navigation
- Changed: The detail view has a Previous entry button that moves to the next older check-in (disabled at the oldest).
- Verified: lint, typecheck, npm test (65 passed), build, format:check, roadmap test.
- Next: L056 next-day navigation to a newer entry.
- Blockers: none

## 2026-10-09 — L056: add next-day navigation
- Changed: The detail view has a Next entry button that moves to the next newer check-in (disabled at the newest).
- Verified: lint, typecheck, npm test (65 passed), build, format:check, roadmap test.
- Next: L057 keyboard check-in flow test (tab, select, save, focus).
- Blockers: none

## 2026-10-09 — L057: add keyboard check-in flow test
- Changed: A Playwright test completes a check-in using only Tab, arrow keys, typing and Enter, and confirms focus order and that focus stays on Save.
- Verified: lint, typecheck, npm test (65 passed), build, format:check, roadmap test, Playwright 16 passed (pre-installed Chromium).
- Next: L058 persistence browser test (check-in survives a reload).
- Blockers: none

## 2026-10-09 — L058: add persistence browser test
- Changed: A Playwright test saves a check-in, reloads Home, and confirms the summary and the edit form still hold the saved mood and note.
- Verified: lint, typecheck, npm test (65 passed), build, format:check, roadmap test, Playwright persistence spec passed (pre-installed Chromium).
- Next: L059 check-in migration test (older schema opens without losing records).
- Blockers: none

## 2026-10-09 — L059: add check-in migration test
- Changed: A test seeds a database exactly as the first release stored it and confirms openDatabase keeps every record readable.
- Verified: lint, typecheck, npm test (66 passed), build, format:check, roadmap test. Only schema v1 exists so far, so the test guards the open path that future migrations must keep working.
- Next: L060 (see ROADMAP.md).
- Blockers: none

## 2026-10-10 — L060: add check-in privacy copy
- Changed: The check-in screen states that entries stay on this device.
- Verified: lint, typecheck, unit tests, build, format:check, roadmap test.
- Next: L061 define gratitude record.
- Blockers: none

## 2026-10-10 — L060: add check-in privacy copy
- Changed: The check-in screen states that entries stay on this device.
- Verified: lint, typecheck, unit tests, build, format:check, roadmap test.
- Next: L061 define gratitude record.
- Blockers: none

## 2026-10-10 — L061: define gratitude record
- Changed: A Gratitude type holds text, a local date, and standard record metadata.
- Verified: lint, typecheck, unit tests (type test), build, format:check, roadmap test.
- Next: L062 reject blank gratitude text.
- Blockers: none

## 2026-10-10 — L062: validate gratitude text
- Changed: Blank or whitespace-only gratitude text is rejected with a friendly DomainError; valid text is trimmed.
- Verified: lint, typecheck, unit tests (blank rejected), build, format:check, roadmap test.
- Next: L063 add gratitude object store via migration.
- Blockers: none

## 2026-10-10 — L063: add gratitude object store
- Changed: Schema v2 adds a gratitude store; databases from v1 upgrade in place and keep their check-ins.
- Verified: lint, typecheck, unit tests (fresh create + v1 upgrade), build, format:check, roadmap test.
- Next: L064 gratitude save method.
- Blockers: none

## 2026-10-10 — L064: add gratitude save method
- Changed: A gratitude repository saves and reloads records; check-in storage now shares one generic store repository.
- Verified: lint, typecheck, unit tests (save round trip + replace, existing check-in repo tests), build, format:check, roadmap test.
- Next: L065 list gratitude newest first.
- Blockers: none

## 2026-10-10 — L065: list gratitude newest first
- Changed: Gratitude entries list in newest-first order.
- Verified: lint, typecheck, unit tests (ordering + empty), build, format:check, roadmap test.
- Next: L066 gratitude delete test.
- Blockers: none

## 2026-10-10 — L066: add gratitude delete test
- Changed: Deleting a gratitude entry removes only that entry; unknown ids are ignored.
- Verified: lint, typecheck, unit tests (delete + unknown id), build, format:check, roadmap test.
- Next: L067 render Gratitude route.
- Blockers: none

## 2026-10-10 — L067: render Gratitude route
- Changed: A Gratitude link in the main nav opens a Gratitude page at #/gratitude.
- Verified: lint, typecheck, unit tests (route + page), build, format:check, roadmap test, Playwright 18 passed (pre-installed Chromium).
- Next: L068 gratitude composer.
- Blockers: none

## 2026-10-10 — L068: add gratitude composer
- Changed: On Gratitude you can type one appreciation, save it to this device, and see 'Saved.'; blank text shows a gentle inline message.
- Verified: lint, typecheck, unit tests (79), build, format:check, roadmap test, Playwright 19 passed (pre-installed Chromium).
- Next: L069 gratitude empty state.
- Blockers: none

## 2026-10-10 — L069: add gratitude empty state
- Changed: With no entries, Gratitude suggests a first appreciation; the hint disappears after saving.
- Verified: lint, typecheck, unit tests (80), build, format:check, roadmap test.
- Next: L070 show gratitude cards.
- Blockers: none

## 2026-10-10 — L070: show gratitude cards
- Changed: Saved appreciations appear as cards showing their text and date, newest first, styled with the warm tokens.
- Verified: lint, typecheck, unit tests (81, incl. color-token guard), build, format:check, roadmap test. Cards wrap long words for narrow phones.
- Next: L071 gratitude edit action.
- Blockers: none

## 2026-10-11 — L071: add gratitude edit action
- Changed: Each gratitude card has an Edit button that opens an inline editor; saved text persists.
- Verified: lint, typecheck, unit tests (83, incl. edit persists after reload + blank edit refused), build, format:check, roadmap test.
- Next: L072 gratitude delete confirmation.
- Blockers: none

## 2026-10-11 — L072: add gratitude delete confirmation
- Changed: Each gratitude card has a Delete button that asks for confirmation; Cancel keeps the entry, Yes removes it.
- Verified: lint, typecheck, unit tests (85, incl. cancel preserves + confirm removes), build, format:check, roadmap test.
- Next: L073 gratitude character limit.
- Blockers: none

## 2026-10-11 — L073: add gratitude character limit
- Changed: Gratitude entries over 500 characters are refused with a gentle inline message.
- Verified: lint, typecheck, unit tests (87, incl. limit boundary + UI block), build, format:check, roadmap test.
- Next: L074 gratitude Home preview.
- Blockers: none

## 2026-10-11 — L074: add gratitude Home preview
- Changed: Home shows the latest appreciation with a link to Gratitude; nothing appears when there are none.
- Verified: lint, typecheck, unit tests (89, incl. newest preview + none), build, format:check, roadmap test.
- Next: L075 gratitude week count.
- Blockers: none

## 2026-10-11 — L075: add gratitude week count
- Changed: Gratitude shows 'This week: N' counting entries from the current Monday–Sunday week.
- Verified: lint, typecheck, unit tests (93, incl. week boundaries + page count), build, format:check, roadmap test.
- Next: L076 gratitude filter by month.
- Blockers: none

## 2026-10-11 — L076: add gratitude filter by month
- Changed: Gratitude has a 'Show month' selector that limits visible cards to one month; 'All months' restores them.
- Verified: lint, typecheck, unit tests (97, incl. filter helpers + page selection), build, format:check, roadmap test; select shares field focus styling.
- Next: L077 gratitude keyboard test.
- Blockers: none

## 2026-10-11 — L077: add gratitude keyboard test
- Changed: Playwright test proves an appreciation can be created and deleted (with confirmation) using only the keyboard.
- Verified: lint, typecheck, unit tests (97), build, format:check, roadmap test, Playwright 20 passed (pre-installed Chromium; one unrelated focus.spec flake passed on re-run).
- Next: L078 define memory record.
- Blockers: none

## 2026-10-12 — L078: define memory record
- Changed: A `Memory` type (title, date, note, record metadata) exists in the domain layer, ready for storage.
- Verified: lint, typecheck, unit tests, build, format:check, roadmap test.
- Next: L079 validate memory title (reject blank).
- Blockers: none

## 2026-10-12 — L079: validate memory title
- Changed: `parseMemoryTitle` trims a title and rejects blank input with a gentle message.
- Verified: lint, typecheck, unit tests, build, format:check, roadmap test.
- Next: L080 add memories IndexedDB store via migration.
- Blockers: none

## 2026-10-12 — L080: add memories store
- Changed: Local database v3 adds a `memories` store; older databases upgrade without losing check-ins or gratitude.
- Verified: lint, typecheck, unit tests (migration from v1 checks the new store), build, format:check, roadmap test.
- Next: L081 memory save method with repository round trip.
- Blockers: none

## 2026-10-12 — L081: add memory save method
- Changed: A memory repository can save, replace, read and delete memories in the local database.
- Verified: lint, typecheck, unit tests (round trip, replace by id, store isolation), build, format:check, roadmap test.
- Next: L082 memory list sorted by date.
- Blockers: none

## 2026-10-12 — L082: add memory list method
- Changed: Memory lists come back sorted by memory date, newest first (same-day ties by write time).
- Verified: lint, typecheck, unit tests (date order, same-day tie, empty), build, format:check, roadmap test.
- Next: L083 render Memories route reachable from navigation.
- Blockers: none

## 2026-10-12 — L083: render Memories route
- Changed: A "Memories" link in the main navigation opens a Memories page (placeholder copy for now).
- Verified: lint, typecheck, unit tests (route parsing, nav link, page heading), build, format:check, roadmap test, Playwright (21 passed, pre-installed Chromium).
- Next: L084 memory composer saving title and date.
- Blockers: none

## 2026-10-13 — L084: add memory composer
- Changed: The Memories page has a title and date form; saving stores the memory and lists it below.
- Verified: lint, typecheck, unit tests (save, blank title, missing date), build, format:check, roadmap test.
- Next: L085 optional memory note persisting after reload.
- Blockers: none

## 2026-10-13 — L085: add optional memory note
- Changed: The memory form has an optional note; it is saved with the memory and shown on its card after reload.
- Verified: lint, typecheck, unit tests (note persists across remount, empty note), build, format:check, roadmap test.
- Next: L086 memory detail showing full fields for the selected card.
- Blockers: none

## 2026-10-14 — L086: add memory detail
- Changed: Memory titles on the Memories page are buttons; selecting one shows a detail panel with its title, date, and full note.
- Verified: lint, typecheck, unit tests (detail fields, empty-note copy), build, format:check, roadmap test.
- Next: L087 memory edit persisting title, date, and note changes.
- Blockers: none

## 2026-10-14 — L087: add memory edit
- Changed: Selected memories have an Edit memory form; title, date, and note changes are saved and survive reload.
- Verified: lint, typecheck, unit tests (edit persists after remount, blank title refused), build, format:check, roadmap test.
- Next: L088 memory delete with confirmation.
- Blockers: none

## 2026-10-14 — L088: add memory delete
- Changed: A selected memory can be deleted after an explicit confirmation; cancelling keeps it.
- Verified: lint, typecheck, unit tests (cancel keeps, confirm removes), build, format:check, roadmap test.
- Next: L089 memories empty state with first-use copy.
- Blockers: none

## 2026-10-14 — L089: add memories empty state
- Changed: The Memories page shows first-use copy explaining what to add until a memory is saved.
- Verified: lint, typecheck, unit test (copy shown then hidden after save), build, format:check, roadmap test.
- Next: L090 gratitude and memory browser test (saved entries survive reload).
- Blockers: none

## 2026-10-14 — L090: add gratitude and memory browser test
- Changed: Browser tests confirm saved appreciations and memories are still shown after a page reload.
- Verified: lint, Playwright (23 passed), build, format:check, roadmap test.
- Next: L091 define date idea record type.
- Blockers: none

## 2026-10-15 — L091: define date idea record
- Changed: A DateIdea type (title, note, active/completed state, record metadata) exists in the domain layer.
- Verified: lint, typecheck, unit type test, build, format:check, roadmap test.
- Next: L092 validate idea title (reject blank).
- Blockers: none

## 2026-10-15 — L092: validate idea title
- Changed: Blank or whitespace date idea titles are rejected with a gentle message; valid titles are trimmed.
- Verified: lint, typecheck, unit tests (blank/whitespace/non-text rejected, trim), build, format:check, roadmap test.
- Next: L093 add idea IndexedDB store via migration.
- Blockers: none

## 2026-10-15 — L093: add idea store
- Changed: The local database upgrades to v4 and gains an ideas store; older data is kept.
- Verified: lint, typecheck, unit tests (fresh and older-database migration), build, format:check, roadmap test.
- Next: L094 idea save method with repository round trip.
- Blockers: none

## 2026-10-15 — L094: add idea save method
- Changed: Date ideas can be saved to and read back from the local ideas store.
- Verified: lint, typecheck, repository round-trip and replace tests, build, format:check, roadmap test.
- Next: L095 idea list with active ideas above completed.
- Blockers: none

## 2026-10-15 — L095: add idea list method
- Changed: Listing ideas returns active ideas first, completed after, newest first in each group.
- Verified: lint, typecheck, unit tests (sort order, empty list), build, format:check, roadmap test.
- Next: L096 idea delete method with a deletion test.
- Blockers: none

## 2026-10-15 — L096: add idea delete method
- Changed: Saved date ideas can be removed from the local store without touching the others.
- Verified: lint, typecheck, unit tests (delete one, delete missing), build, format:check, roadmap test.
- Next: L097 render the Ideas route.
- Blockers: none

## 2026-10-16 — L097: render Ideas route
- Changed: Navigation now opens an Ideas page.
- Verified: lint, typecheck, unit tests (route + nav link), build, format:check, roadmap test.
- Next: L098 new idea form creating a card.
- Blockers: none

## 2026-10-16 — L098: add new idea form
- Changed: Ideas page has a title form; a valid title creates a card, a blank one shows an error. Also adds the missing Ideas link to the main nav (L097's nav test was failing on its commit).
- Verified: lint, typecheck, full vitest (143 pass), build, format:check, roadmap test.
- Next: L099 optional idea note shown on the card.
- Blockers: none

## 2026-10-16 — L099: add optional idea note
- Changed: New ideas can include an optional note, shown on the card.
- Verified: lint, typecheck, full vitest (145 pass), build, format:check.
- Next: L100 idea empty state with first-idea prompt.
- Blockers: none

## 2026-10-16 — L100: add idea empty state
- Changed: Ideas page shows a first-idea prompt until an idea exists.
- Verified: lint, typecheck, full vitest (146 pass), build, format:check.
- Next: L101 completed toggle moving ideas between active and completed.
- Blockers: none

## 2026-10-16 — L101: add completed toggle
- Changed: Ideas are grouped under To do and Done, and a button moves an idea between them.
- Verified: lint, typecheck, full vitest (147 pass), build, format:check.
- Next: L102 idea edit persisting title and note.
- Blockers: none

## 2026-10-16 — L102: add idea edit
- Changed: Ideas can be edited; title and note changes persist and a blank title is refused.
- Verified: lint, typecheck, full vitest (149 pass), build, format:check.
- Next: L103 idea delete confirmation.
- Blockers: none

## 2026-10-16 — L103: add idea delete confirmation
- Changed: Deleting an idea asks first; cancel leaves the card, confirm removes it.
- Verified: lint, typecheck, full vitest (151 pass), build, format:check.
- Next: L104 idea category field saved with the idea.
- Blockers: none

## 2026-10-17 — L104: add idea category field
- Changed: Ideas now store a category (defaults to other); older ideas without one still load.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L105 keyboard-usable category selector.
- Blockers: none

## 2026-10-17 — L105: add category selector
- Changed: The new-idea form has a Category select (native, keyboard-operable); the chosen category shows on the card.
- Verified: lint, typecheck, vitest (155 pass), build, format:check, roadmap tests.
- Next: L106 category filter.
- Blockers: none

## 2026-10-17 — L106: add category filter
- Changed: A Show category select on Ideas limits the cards to one category; All categories restores the list.
- Verified: lint, typecheck, vitest (158 pass), build, format:check, roadmap tests.
- Next: L107 text search over title and note.
- Blockers: none

## 2026-10-17 — L107: add text search
- Changed: Ideas has a Search ideas box; cards whose title or note match (ignoring case) stay visible.
- Verified: lint, typecheck, vitest (161 pass), build, format:check, roadmap tests.
- Next: L108 clear-search action.
- Blockers: none

## 2026-10-17 — L108: add clear-search action
- Changed: A Clear search button appears while searching and restores the full list.
- Verified: lint, typecheck, vitest (162 pass), build, format:check, roadmap tests.
- Next: L109 active and completed counts.
- Blockers: none

## 2026-10-17 — L109: add active and completed counts
- Changed: Ideas shows how many are to do and how many are done, counted from saved data.
- Verified: lint, typecheck, vitest (164 pass), build, format:check, roadmap tests.
- Next: L110 Home preview of one active idea.
- Blockers: none

## 2026-10-17 — L110: add idea Home preview
- Changed: Home shows an 'An idea to try' card with the newest active idea and a link to Ideas.
- Verified: lint, typecheck, vitest (166 pass), build, format:check, roadmap tests.
- Next: L111 planned date record type.
- Blockers: none

## 2026-10-17 — L111: define planned date record
- Changed: A PlannedDate type (ideaId, startsAt, status) exists in the domain; no visible change yet.
- Verified: lint, typecheck (type test), vitest, build, format:check, roadmap tests.
- Next: L112 reject invalid planned date timestamps.
- Blockers: none

## 2026-10-17 — L112: validate planned date time
- Changed: parsePlannedStart rejects impossible days and times (e.g. 30 Feb); no visible change yet.
- Verified: lint, typecheck, vitest (177 pass), build, format:check, roadmap tests.
- Next: L113 plans object store migration.
- Blockers: none

## 2026-10-17 — L113: add planned date store
- Changed: Local database schema v5 adds a plans store; older databases upgrade and keep their records.
- Verified: lint, typecheck, vitest (177 pass incl. upgrade test), build, format:check, roadmap tests.
- Next: L114 schedule action on an idea.
- Blockers: none

## 2026-10-17 — L114: add schedule action
- Changed: Active idea cards have a Schedule button; picking a date and time saves a plan and shows 'Scheduled for …'.
- Verified: lint, typecheck, vitest (179 pass), build, format:check, roadmap tests; datetime-local input is native and keyboard-operable.
- Next: L115 plan list sorted soonest first.
- Blockers: none

## 2026-10-17 — L115: add plan list
- Changed: Ideas shows an Upcoming plans list of future planned dates, soonest first.
- Verified: lint, typecheck, vitest (182 pass), build, format:check, roadmap tests.
- Next: L116 plan edit action.
- Blockers: none

## 2026-10-18 — L116: add plan edit action
- Changed: Upcoming plans have a Change time button; the new time is saved and the list re-sorts.
- Verified: lint, typecheck, vitest (183 pass), build, format:check, roadmap tests.
- Next: L117 plan cancellation.
- Blockers: none

## 2026-10-18 — L117: add plan cancellation
- Changed: Upcoming plans have a Cancel plan button; cancelled plans leave the upcoming list.
- Verified: lint, typecheck, vitest (184; one unrelated gratitude route test timed out under load and passed on rerun), build, format:check, roadmap tests.
- Next: L118 show next planned date on Home.
- Blockers: none

## 2026-10-18 — L118: add plans Home preview
- Changed: Home shows a Next planned date card with the soonest upcoming plan and a link to Ideas.
- Verified: lint, typecheck, vitest (full suite), build, format:check, roadmap tests.
- Next: L119 board browser test.
- Blockers: none

## 2026-10-19 — L119: add board browser test
- Changed: A browser test covers creating, filtering, completing, and reloading ideas.
- Verified: playwright e2e/ideas.spec.ts, lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L120 plans browser test (schedule and cancel flow).
- Blockers: none

## 2026-10-19 — L120: add plans browser test
- Changed: A browser test covers scheduling an idea and cancelling the plan.
- Verified: playwright e2e/plans.spec.ts, lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L121 ritual record type.
- Blockers: none

## 2026-10-19 — L121: define ritual record
- Changed: Added the Ritual type (name, cadence, record metadata); no UI yet.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L122 reject empty ritual names.
- Blockers: none

## 2026-10-19 — L122: validate ritual name
- Changed: Blank ritual names are rejected with a friendly message (domain only; no UI yet).
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L123 accept only daily and weekly cadence.
- Blockers: none

## 2026-10-19 — L123: validate cadence
- Changed: Only daily and weekly ritual cadences are accepted (domain only; no UI yet).
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L124 rituals IndexedDB store and migration.
- Blockers: none

## 2026-10-19 — L124: add ritual store
- Changed: Local database version 6 adds a rituals store; older databases keep their records.
- Verified: lint, typecheck, vitest (migration test covers rituals), build, format:check, roadmap tests.
- Next: L125 ritual save method with repository round trip.
- Blockers: none

## 2026-10-19 — L125: add ritual save method
- Changed: A ritual repository saves and reads back rituals from the local database (no UI yet).
- Verified: lint, typecheck, vitest (round-trip and replace tests), build, format:check, roadmap tests.
- Next: L126 ritual list in name order.
- Blockers: none

## 2026-10-19 — L126: add ritual list method
- Changed: Rituals list back in name order from the repository (test added; no UI yet).
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L127 render a Rituals route reachable from navigation.
- Blockers: none

## 2026-10-20 — L127: render Rituals route
- Changed: A Rituals page opens from the main navigation at #/rituals.
- Verified: lint, typecheck, vitest (route and nav tests), build, format:check, roadmap tests; e2e spec added (not run).
- Next: L128 ritual creation form.
- Blockers: none

## 2026-10-20 — L128: add ritual creation form
- Changed: The Rituals page has a name and daily/weekly cadence form that saves a ritual and lists it.
- Verified: lint, typecheck, vitest (create and blank-name tests), build, format:check, roadmap tests.
- Next: L129 ritual empty state.
- Blockers: none

## 2026-10-20 — L129: add ritual empty state
- Changed: First-use instructions show on Rituals until a ritual is saved.
- Verified: lint, typecheck, vitest (empty-state test), build, format:check, roadmap tests.
- Next: L130 ritual edit action.
- Blockers: none

## 2026-10-20 — L130: add ritual edit action
- Changed: Each ritual has an Edit button; name and cadence changes save and persist.
- Verified: lint, typecheck, vitest (edit and blank-name tests), build, format:check, roadmap tests.
- Next: L131 ritual archive action.
- Blockers: none

## 2026-10-21 — L131: Add ritual archive action
- Changed: Each ritual has an Archive button; archived rituals leave the active list but stay stored.
- Verified: lint, typecheck, vitest (archive test), build, format:check, roadmap tests.
- Next: L132 archived ritual view.
- Blockers: none

## 2026-10-21 — L132: Add archived ritual view
- Changed: An Archived rituals section lists archived rituals read-only.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L133 ritual completion record type.
- Blockers: none

## 2026-10-21 — L133: Define ritual completion record
- Changed: No visible change: a RitualCompletion type now links a ritual id to a local date.
- Verified: lint, typecheck, vitest (type test), build, format:check, roadmap tests.
- Next: L134 completions store with migration.
- Blockers: none

## 2026-10-21 — L134: Add completion store
- Changed: No visible change: the local database (v7) gains a ritualCompletions store with a repository.
- Verified: lint, typecheck, vitest (migration and repository tests), build, format:check, roadmap tests.
- Next: L135 mark-today action for daily rituals.
- Blockers: none

## 2026-10-21 — L135: Add mark-today action
- Changed: Daily rituals have a Mark done today button that records today's completion and shows Done today.
- Verified: lint, typecheck, vitest (completion test), build, format:check, roadmap tests.
- Next: L136 prevent duplicate completion on a second click.
- Blockers: none

## 2026-10-21 — L136: Prevent duplicate completion
- Changed: Clicking Mark done today again no longer adds a second completion for the same day.
- Verified: lint, typecheck, vitest (double-click test), build, format:check, roadmap tests.
- Next: L137 undo-today action.
- Blockers: none

## 2026-10-21 — L137: Add undo-today action
- Changed: A ritual done today shows an Undo button that removes today's completion.
- Verified: lint, typecheck, vitest (undo test), build, format:check, roadmap tests.
- Next: L138 weekly completion action recording week start.
- Blockers: none

## 2026-10-21 — L138: Add weekly completion action
- Changed: Weekly rituals have a Mark done this week button that records the week's Monday; undo works too.
- Verified: lint, typecheck, vitest (weekStart and weekly completion tests), build, format:check, roadmap tests.
- Next: L139 last-done label on ritual cards.
- Blockers: none

## 2026-10-21 — L139: Add ritual last-done label
- Changed: Ritual cards show a Last done label with the most recent completion.
- Verified: lint, typecheck, vitest (helper and UI tests), build, format:check, roadmap tests.
- Next: L140 daily ritual Home preview.
- Blockers: none

## 2026-10-21 — L140: Add daily ritual Home preview
- Changed: Home lists active daily rituals not yet done today, linking to Rituals.
- Verified: lint, typecheck, vitest (helper and Home tests), build, format:check, roadmap tests.
- Next: L141 weekly ritual Home preview.
- Blockers: none

## 2026-10-21 — L141: Add weekly ritual Home preview
- Changed: Home also lists weekly rituals not yet done this week, labelled today or this week.
- Verified: lint, typecheck, vitest (dueRituals and Home tests), build, format:check, roadmap tests.
- Next: L142 ritual history on a detail view.
- Blockers: none

## 2026-10-21 — L142: Add ritual history
- Changed: Each ritual has a History button listing its completion dates (weekly ones as Week of).
- Verified: lint, typecheck, vitest (history test; full suite passed twice after one unrelated CheckInPage flake), build, format:check, roadmap tests.
- Next: L143 pure ritual streak helper.
- Blockers: none

## 2026-10-22 — L143: Add ritual streak helper
- Changed: Pure ritualStreak counts consecutive daily or weekly periods (no UI yet).
- Verified: lint, typecheck, vitest (streak tests), build, format:check, roadmap tests.
- Next: L144 show the streak on the ritual detail.
- Blockers: none

## 2026-10-22 — L144: Add ritual streak display
- Changed: Ritual history shows a Streak count in days or weeks.
- Verified: lint, typecheck, vitest (streak UI test), build, format:check, roadmap tests.
- Next: L145 add a ritual pause field.
- Blockers: none

## 2026-10-22 — L145: Add ritual pause field
- Changed: Rituals can carry pausedAt; paused rituals no longer appear as due on Home.
- Verified: lint, typecheck, vitest (paused dueRituals test), build, format:check, roadmap tests.
- Next: L146 add a resume action.
- Blockers: none

## 2026-10-22 — L146: Add ritual resume action
- Changed: Rituals have Pause and Resume buttons; a paused ritual shows Paused and a resumed one is due again.
- Verified: lint, typecheck, vitest (pause/resume UI + dueRituals tests; one unrelated Gratitude flake passed on rerun), build, format:check, roadmap tests.
- Next: L147 add ritual deletion confirmation.
- Blockers: none

## 2026-10-22 — L147: Add ritual deletion confirmation
- Changed: Rituals can be deleted after a confirmation; Cancel keeps the ritual and its history.
- Verified: lint, typecheck, vitest (cancel and confirm delete tests), build, format:check, roadmap tests.
- Next: L148 add a ritual browser test.
- Blockers: none

## 2026-10-22 — L148: Add ritual browser test
- Changed: Playwright test covers creating, completing, undoing and reloading a ritual.
- Verified: Playwright rituals spec (2 passed), lint, typecheck, build, format:check, roadmap tests.
- Next: L149 add a weekly boundary test.
- Blockers: none

## 2026-10-22 — L149: Add weekly boundary test
- Changed: Tests prove weekly due state and streaks roll over at local midnight Sunday to Monday and across month and year ends.
- Verified: lint, typecheck, vitest (boundary tests, also under TZ=Pacific/Auckland), build, format:check, roadmap tests.
- Next: L150 add ritual privacy copy.
- Blockers: none

## 2026-10-22 — L150: Add ritual privacy copy
- Changed: The Rituals page says rituals are private to you and not shared with a partner.
- Verified: lint, typecheck, vitest (copy test), build, format:check, roadmap tests.
- Next: L151 define the reflection record type.
- Blockers: none

## 2026-10-22 — L151: Define reflection record
- Changed: Added the Reflection type: weekStart plus four optional prompts (no UI yet).
- Verified: lint, typecheck, vitest (type tests), build, format:check, roadmap tests.
- Next: L152 validate the reflection week.
- Blockers: none

## 2026-10-23 — L152: Validate reflection week
- Changed: Added parseReflectionWeek, which rejects a weekStart that is not a real Monday date (no UI yet).
- Verified: lint, typecheck, vitest (parse tests), build, format:check, roadmap tests.
- Next: L153 add the reflections store via migration.
- Blockers: none

## 2026-10-23 — L153: Add reflection store
- Changed: Database schema v8 adds a reflections object store keyed by id; older data is kept.
- Verified: lint, typecheck, vitest (store and upgrade tests), build, format:check, roadmap tests.
- Next: L154 add the reflection save method.
- Blockers: none

## 2026-10-23 — L154: Add reflection save method
- Changed: Added a reflection repository; reflections can be saved and read back (data layer only).
- Verified: lint, typecheck, vitest (round trip and replace tests), build, format:check, roadmap tests.
- Next: L155 prove newest week lists first and add the app's local reflection getter.
- Blockers: none

## 2026-10-23 — L155: Add reflection list method
- Changed: Reflections list newest week first; added the app's local reflection repository getter.
- Verified: lint, typecheck, vitest (order and empty-list tests), build, format:check, roadmap tests.
- Next: L156 render a Reflection route reachable from navigation.
- Blockers: none

## 2026-10-23 — L156: Render Reflection route
- Changed: A Reflection link in the navigation opens a Reflection page with private-to-you copy.
- Verified: lint, typecheck, vitest (route and nav link tests), Playwright navigation/narrow specs, build, format:check, roadmap tests.
- Next: L157 show the current week's date range.
- Blockers: none

## 2026-10-23 — L157: Show current week dates
- Changed: The Reflection page shows this week's Monday-to-Sunday range, formatted for the browser locale.
- Verified: lint, typecheck, vitest (en-US, de-DE and year-boundary range tests, page test), build, format:check, roadmap tests. The week always starts Monday, matching the Reflection record; locale controls formatting.
- Next: L158 add the what-worked prompt that saves on submit.
- Blockers: none

## 2026-10-23 — L158: Add what-worked prompt
- Changed: The Reflection page has a "What worked this week?" prompt that saves for the current week on submit; blank answers are refused for now.
- Verified: lint, typecheck, vitest (save and blank tests), build, format:check, roadmap tests.
- Next: L159 add the what-was-hard prompt.
- Blockers: none

## 2026-10-23 — L159: Add what-was-hard prompt
- Changed: A "What was hard this week?" prompt now sits beside the first; either response saves on submit.
- Verified: lint, typecheck, vitest (what-was-hard save test), build, format:check, roadmap tests.
- Next: L160 add the what-to-try prompt.
- Blockers: none

## 2026-10-23 — L160: Add what-to-try prompt
- Changed: A "What would you like to try next week?" prompt saves with the others on submit.
- Verified: lint, typecheck, vitest (what-to-try save test), build, format:check, roadmap tests.
- Next: L161 add the appreciation prompt.
- Blockers: none

## 2026-10-23 — L161: Add appreciation prompt
- Changed: An appreciation prompt completes the four weekly prompts; each saves on submit.
- Verified: lint, typecheck, vitest (appreciation save test), build, format:check, roadmap tests.
- Next: L162 prove a partly answered reflection saves.
- Blockers: none

## 2026-10-23 — L162: Allow partial reflection
- Changed: A reflection with only one prompt answered saves; unanswered prompts stay unset.
- Verified: lint, typecheck, vitest (partial save test), build, format:check, roadmap tests.
- Next: L163 refill the form with this week's saved responses for editing.
- Blockers: none

## 2026-10-24 — L163: Add current-week edit
- Changed: Opening Reflection refills the form with this week's saved responses.
- Verified: lint, typecheck, vitest (refill test), build, format:check, roadmap tests.
- Next: L164 make saving update the existing week record instead of adding one.
- Blockers: none

## 2026-10-24 — L164: Prevent duplicate week record
- Changed: Saving a reflection again in the same week updates that week's record instead of adding another.
- Verified: lint, typecheck, vitest (update-in-place test), build, format:check, roadmap tests.
- Next: L165 show current week reflection status on Home.
- Blockers: none

## 2026-10-24 — L165: Add reflection preview
- Changed: Home shows whether this week's reflection is done, with a link to Reflection.
- Verified: lint, typecheck, vitest (reflected and not-started tests), build, format:check, roadmap tests.
- Next: L166 add a browsable list of prior weeks' reflections.
- Blockers: none

## 2026-10-25 — L166: Add reflection history list
- Changed: Reflection lists earlier weeks (newest first) under the form.
- Verified: lint, typecheck, vitest (history list tests), build, format:check, roadmap tests.
- Next: L167 show a selected week's full responses.
- Blockers: none

## 2026-10-25 — L167: Add reflection detail
- Changed: Choosing an earlier week shows all four responses, with a way back.
- Verified: lint, typecheck, vitest (detail test), build, format:check, roadmap tests.
- Next: L168 confirm before deleting a reflection.
- Blockers: none

## 2026-10-25 — L168: Add reflection delete confirmation
- Changed: Deleting an earlier week's reflection asks first; Cancel keeps it.
- Verified: lint, typecheck, vitest (cancel and confirm tests), build, format:check, roadmap tests.
- Next: L169 show the week's check-in mood labels in Reflection.
- Blockers: none

## 2026-10-25 — L169: Add optional check-in summary
- Changed: Reflection shows the week's check-in mood labels when there are any.
- Verified: lint, typecheck, vitest (summary and isInWeek tests), build, format:check, roadmap tests.
- Next: L170 show this week's gratitude entry count in Reflection.
- Blockers: none

## 2026-10-25 — L170: Add optional gratitude summary
- Changed: Reflection shows how many appreciations were written this week (hidden when zero).
- Verified: lint, typecheck, vitest (count tests), build, format:check, roadmap tests.
- Next: L171 show this week's completed ritual count in Reflection.
- Blockers: none

## 2026-10-25 — L171: Add optional ritual summary
- Changed: Reflection shows how many rituals were completed this week (hidden when zero).
- Verified: lint, typecheck, vitest (count tests), build, format:check, roadmap tests.
- Next: L172 add a one-line next-step text saved with the reflection.
- Blockers: none

## 2026-10-25 — L172: Add selected next action
- Changed: Reflection has a 'One small next step' field (max 140 characters) saved with the week and refilled on return.
- Verified: lint, typecheck, vitest (save, refill, maxlength tests), build, format:check, roadmap tests.
- Next: L173 show the saved next step on Home until next week.
- Blockers: none

## 2026-10-25 — L173: Show next action on Home
- Changed: Home's reflection card shows this week's saved next step until the week changes.
- Verified: lint, typecheck, vitest (shown / not shown tests), build, format:check, roadmap tests.
- Next: L174 add an explicit copy-previous-response action.
- Blockers: none

## 2026-10-25 — L174: Add copy-previous action
- Changed: An earlier week's detail has a 'Copy to this week' button per answered response; it adds the text to the form (never overwrites) and does not save.
- Verified: lint, typecheck, vitest (copy and no-overwrite tests), build, format:check, roadmap tests.
- Next: L175 add a print layout for reflection detail.
- Blockers: none

## 2026-10-25 — L175: Add reflection print layout
- Changed: Printing hides navigation, buttons, intro and the form so a week's saved responses print on their own.
- Verified: lint, typecheck, vitest (print CSS and markup tests; one unrelated timing flake passed on re-run), build, format:check, roadmap tests. Not checked in a real print preview.
- Next: L176 prove the reflection prompts and save work from the keyboard.
- Blockers: none

## 2026-10-25 — L176: Add reflection keyboard test
- Changed: No visible change; a test now proves the prompts and Save are native, labelled, in tab order, and Save submits.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests. jsdom cannot press keys, so the browser test (L177) covers real key presses.
- Next: L177 add a browser test that a partial save survives reload.
- Blockers: none

## 2026-10-25 — L177: Add reflection browser test
- Changed: No visible change; a Playwright test saves a one-prompt reflection, reloads, and sees it refilled.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests, Playwright e2e/reflection.spec.ts (2 passed).
- Next: L178 prove week selection stays stable near midnight across time zones.
- Blockers: none

## 2026-10-26 — L178: Add timezone boundary test
- Changed: No visible change; tests prove the week start stays stable at Sunday 23:59 and Monday 00:00 in four time zones, and follows the local day rather than the UTC day.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L179 add a calm empty state for the first reflection week.
- Blockers: none

## 2026-10-26 — L179: Add reflection empty state
- Changed: The first time someone opens Reflection, a gentle note says there is no right way to begin and any prompt can be left blank. It disappears once a week is saved.
- Verified: lint, typecheck, vitest (2 new tests), build, format:check, roadmap tests. Reused the shared EmptyState; text wraps naturally on a narrow phone.
- Next: L180 review UI copy so nothing makes partner performance claims.
- Blockers: none

## 2026-10-26 — L180: Add no-judgment copy review
- Changed: No visible change; I searched all UI copy for scoring or partner-judging language (none found) and added a test that fails if such phrases are ever shipped.
- Verified: lint, typecheck, vitest (9 new tests), build, format:check, roadmap tests; manual grep of src for score/rating/blame wording.
- Next: L181 define the timeline entry type covering every local record kind.
- Blockers: none

## 2026-10-26 — L181: Define timeline entry shape
- Changed: No visible change; the domain now has a `TimelineEntry` type and six kinds (check-in, gratitude, memory, plan, ritual completion, reflection). Date ideas and rituals are lists, not dated moments, so they are left out on purpose.
- Verified: lint, typecheck, vitest (2 new tests), build, format:check, roadmap tests.
- Next: L182 map a check-in to a timeline entry.
- Blockers: none

## 2026-10-26 — L182: Map check-in to timeline
- Changed: No visible change; a pure function turns a check-in into a timeline entry with the same id, day, and a one-line mood-and-note summary.
- Verified: lint, typecheck, vitest (4 new tests), build, format:check, roadmap tests.
- Next: L183 map gratitude to a timeline entry.
- Blockers: none

## 2026-10-26 — L183: Map gratitude to timeline
- Changed: No visible change; a pure function turns a gratitude entry into a timeline entry with the same id, day, and text as a one-line summary.
- Verified: lint, typecheck, vitest (2 new tests), build, format:check, roadmap tests.
- Next: L184 map memory to a timeline entry.
- Blockers: none

## 2026-10-26 — L184: Map memory to timeline
- Changed: No visible change; a pure function turns a memory into a timeline entry on the memory's own day with its title and note as the summary.
- Verified: lint, typecheck, vitest (4 new tests), build, format:check, roadmap tests.
- Next: L185 map a planned date to a timeline entry.
- Blockers: none

## 2026-10-26 — L185: Map plan to timeline
- Changed: No visible change; a pure function turns a planned date into a timeline entry on its local start day, with status and idea title in the summary.
- Verified: lint, typecheck, vitest (2 new tests), build, format:check, roadmap tests.
- Next: L186 map a ritual completion to a timeline entry.
- Blockers: none

## 2026-10-26 — L186: Map ritual completion to timeline
- Changed: No visible change; a pure function turns a ritual completion into a timeline entry with the ritual's name in the summary.
- Verified: lint, typecheck, vitest (2 new tests), build, format:check, roadmap tests.
- Next: L187 map a reflection to a timeline entry.
- Blockers: none

## 2026-10-26 — L187: Map reflection to timeline
- Changed: No visible change; a pure function turns a weekly reflection into a timeline entry on its week start, summarizing the first answered prompt.
- Verified: lint, typecheck, vitest (3 new tests), build, format:check, roadmap tests.
- Next: L188 merge all timeline sources newest first.
- Blockers: none

## 2026-10-26 — L188: Merge timeline sources
- Changed: No visible change; a pure function merges timeline entries from all sources into one feed, newest day first.
- Verified: lint, typecheck, vitest (4 new tests), build, format:check, roadmap tests.
- Next: L189 make same-time ordering deterministic by ID.
- Blockers: none

## 2026-10-26 — L189: Resolve same-time ties
- Changed: No visible change; entries with the same day and creation time now sort by ID (then kind), so the timeline order never depends on source order.
- Verified: lint, typecheck, vitest (2 new tests), build, format:check, roadmap tests.
- Next: L190 render a Timeline route in the navigation.
- Blockers: none

## 2026-10-27 — L190: Render Timeline route
- Changed: A Timeline link in the navigation opens a feed of saved records, newest first.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L191 explain the empty timeline for a new account.
- Blockers: none

## 2026-10-27 — L191: Add timeline empty state
- Changed: A new account sees a short explanation of what will appear on the Timeline.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L192 link each card to its source page.
- Blockers: none

## 2026-10-27 — L192: Add timeline card links
- Changed: Each timeline card links to the page where its record can be opened (per-record detail views do not exist yet, so it opens the source page).
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L193 add a kind filter to the timeline.
- Blockers: none

## 2026-10-27 — L193: Add timeline kind filter
- Changed: Timeline checkboxes limit the feed to the chosen kinds of record; none chosen shows all.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L194 add a date range to the timeline.
- Blockers: none

## 2026-10-27 — L194: Add timeline date range
- Changed: Timeline From and To dates exclude entries outside the range; both ends are included.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L195 add a clear-filters action.
- Blockers: none

## 2026-10-27 — L195: Add timeline clear filters
- Changed: A Clear filters button resets kinds and dates so every entry returns.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L196 paginate the timeline 30 at a time.
- Blockers: none

## 2026-10-27 — L196: Add timeline pagination
- Changed: The timeline loads 30 entries at a time with a Show more button.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L197 add month headings.
- Blockers: none

## 2026-10-27 — L197: Add timeline month headings
- Changed: The timeline groups entries under month headings such as March 2026.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L198 make timeline cards keyboard navigable in order.
- Blockers: none

## 2026-10-27 — L198: Add timeline keyboard navigation
- Changed: Timeline cards are real links in feed order, reachable with Tab; filter checkboxes now show a visible focus ring.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L199 add a search index helper.
- Blockers: none

## 2026-10-28 — L199: Add search index helper
- Changed: Records now produce normalized search text (lower-case, accent-free, single-spaced) that includes their kind label.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L200 add a global search input.
- Blockers: none

## 2026-10-28 — L200: Add global search input
- Changed: A Search page (linked in the main navigation) has a search box; typing shows entries from every record kind whose text contains all the words, ignoring case and accents. All text stays on the device.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L201 group search results by kind.
- Blockers: none

## 2026-10-28 — L201: Add search result grouping
- Changed: Search results are grouped under headings by kind (Check-ins, Gratitude, Memories, and so on).
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L202 show a no-results message.
- Blockers: none

## 2026-10-28 — L202: Add search no-results state
- Changed: Searching for something that matches nothing shows a gentle "Nothing matches" message with the query; it stays hidden until you type.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L203 add a clear-search action.
- Blockers: none

## 2026-10-28 — L203: Add search clear action
- Changed: A Clear search button empties the search box and its results.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L204 add a "/" shortcut to focus search.
- Blockers: none

## 2026-10-28 — L204: Add search keyboard shortcut
- Changed: On the Search page, pressing "/" outside a text field focuses the search box; typing "/" inside a field still types it.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L205 add a search privacy note.
- Blockers: none

## 2026-10-28 — L205: Add search privacy note
- Changed: The Search page says the query stays on this device and is never sent or saved (it is held only in the page, not in the URL or storage).
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L206 add a date-range boundary test.
- Blockers: none

## 2026-10-29 — L206: Add date-range boundary test
- Changed: Date-range filter boundaries (endpoints, month/year edges, inverted range) are now covered by tests; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L207 add a timeline merge test for six source kinds.
- Blockers: none

## 2026-10-29 — L207: Add timeline merge test
- Changed: Timeline merge ordering across all six source kinds is now covered by a test; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L208 add a search normalization test.
- Blockers: none

## 2026-10-29 — L208: Add search normalization test
- Changed: Tests now show search ignores case and whitespace differences; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L209 add a timeline browser test for filters surviving back navigation.
- Blockers: none

## 2026-10-29 — L209: Add timeline browser test
- Changed: Timeline filters (kinds and dates) are now kept in memory while you visit another page and press Back; a reload still starts fresh and nothing is stored. Verified in the browser test.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L210 add a search browser test: query opens the right detail.
- Blockers: none

## 2026-10-29 — L210: Add search browser test
- Changed: Browser test saves a demo entry, searches for it, and confirms the result opens the page that shows it; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L211 define an export schema version and timestamp envelope.
- Blockers: none

## 2026-10-29 — L211: Define export schema version
- Changed: An export envelope (app name, schema version, ISO timestamp, data) is defined and tested; no visible change yet.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L212 add an export serializer that includes every record kind.
- Blockers: none
