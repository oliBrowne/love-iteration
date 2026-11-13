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

## 2026-10-29 — L212: Add export serializer
- Changed: An export serializer reads all saved record kinds (check-ins, gratitude, memories, plans, ideas, rituals, ritual completions, reflections) into versioned JSON; not yet wired to a button.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L213 make sure the export excludes search and draft state.
- Blockers: none

## 2026-10-29 — L213: Exclude transient UI state
- Changed: A test confirms the export holds only saved records: timeline filters, search text, and unsaved drafts never appear in it.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L214 add an export JSON download with a named file.
- Blockers: none

## 2026-10-29 — L214: Add export JSON download
- Changed: Settings now has a Download export button that saves everything as love-iteration-export-YYYY-MM-DD.json on this device; nothing is uploaded.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L215 show per-kind counts in the export dialog.
- Blockers: none

## 2026-10-29 — L215: Add export preview counts
- Changed: Settings lists how many records of each kind the export will include (check-ins, gratitude, memories, plans, ideas, rituals, completions, reflections) before you download.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L216 add an export browser test: downloaded file parses as expected.
- Blockers: none

## 2026-10-29 — L216: Add export browser test
- Changed: Browser test saves a demo entry, downloads the export, and checks the file name and parsed contents; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L217 add an import schema validator rejecting a malformed root object.
- Blockers: none

## 2026-10-29 — L217: Add import schema validator
- Changed: An import validator checks the outer shape of a parsed export file (app name, version, time, record lists) and rejects malformed roots with plain messages; not yet connected to the UI.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L218 report missing or duplicate IDs in imported records.
- Blockers: none

## 2026-10-30 — L218: Validate imported IDs
- Changed: Import validation now reports records with missing IDs and IDs repeated within a list; not yet connected to the UI.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L219 report invalid imported dates before writing.
- Blockers: none

## 2026-10-30 — L219: Validate imported dates
- Changed: Import validation now reports invalid created/updated times, calendar days, and plan start times before anything is written; not yet connected to the UI.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L220 add an import dry run showing incoming counts without writes.
- Blockers: none

## 2026-10-30 — L220: Add import dry run
- Changed: Settings can preview an export file: it lists incoming counts per kind, or plain problems, and writes nothing.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L221 make the import file chooser keyboard-selectable with a clear label.
- Blockers: none

## 2026-10-30 — L221: Add import file chooser
- Changed: The import file picker has a visible label and focus ring, so a JSON file can be chosen with the keyboard alone.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L222 require confirmation before any imported record is written.
- Blockers: none

## 2026-10-30 — L222: Add import confirmation
- Changed: After previewing a file, Import asks for confirmation (with Cancel) before any record is written to this device.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L223 only replace existing records when the incoming updatedAt is newer.
- Blockers: none

## 2026-10-30 — L223: Add import merge rule
- Changed: Importing adds new records and replaces stored ones only when the incoming updatedAt is newer; older or equal versions are kept.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L224 show added, updated, and skipped counts for an import.
- Blockers: none

## 2026-10-30 — L224: Add import conflict summary
- Changed: Before confirming, the import step says how many records are new, updated, or skipped because the stored copy is as new or newer.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L225 make an import all-or-nothing so a failure leaves storage unchanged.
- Blockers: none

## 2026-10-30 — L225: Add import transaction
- Changed: An import that fails part-way puts back every record it wrote, so local storage stays as it was and the person sees an error.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L226 show final counts after a successful import.
- Blockers: none

## 2026-10-30 — L226: Add import success message
- Changed: After a successful import, Settings reports the final counts of new, updated, and skipped records.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L227 add a browser test: export then re-import restores records.
- Blockers: none

## 2026-10-30 — L227: Add import browser test
- Changed: Browser test exports a demo entry, imports the file into a fresh browser context, and checks the record is restored; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L228 add a full data delete action with a confirmation explaining local removal.
- Blockers: none

## 2026-10-31 — L228: Add full data delete action
- Changed: Settings has a "Delete all data" action; it asks for confirmation, explaining that everything is removed from this device only and cannot be undone, then clears every record kind.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L229 add a test that all domain stores become empty after delete.
- Blockers: none

## 2026-10-31 — L229: Add full data delete test
- Changed: A test seeds one demo record in each of the eight stores, runs the delete, and checks every store is empty; no visible change.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L230 add a per-kind delete action that clears only the selected record kind.
- Blockers: none

## 2026-10-31 — L230: Add per-kind delete action
- Changed: Settings can delete one chosen kind of record (picked from a labelled list, with confirmation); other kinds are kept.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L231 add a privacy dashboard listing locally stored record counts.
- Blockers: none

## 2026-10-31 — L231: Add privacy dashboard
- Changed: Settings opens with "Privacy: stored on this device", saying data stays in this browser and listing how many records of each kind are stored.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L232 show a clear error when the browser lacks local storage support.
- Blockers: none

## 2026-10-31 — L232: Add storage availability check
- Changed: A browser without local database support now shows a clear "Storage is not available" error instead of a broken app.
- Verified: lint, typecheck, vitest (new unit and App tests), build, format:check, roadmap tests.
- Next: L233 offer export instructions when a storage write fails (quota).
- Blockers: none

## 2026-10-31 — L233: Add storage quota warning
- Changed: When a save fails because the device is out of storage, the form says nothing was lost and tells the person to use Settings > Download export, then free up space.
- Verified: lint, typecheck, vitest (quota conversion and check-in page tests), build, format:check, roadmap tests. A real quota failure was not reproduced in a browser.
- Next: L234 show the build version in Settings.
- Blockers: none

## 2026-10-31 — L234: Add app version display
- Changed: Settings ends with an "About" section showing the build version, taken from package.json at build time.
- Verified: lint, typecheck, vitest, build, format:check, roadmap tests.
- Next: L235 add a privacy policy page that accurately describes local storage.
- Blockers: none

## 2026-11-01 — L235: Add privacy policy page
- Changed: Settings links to a new "Privacy policy" page (#/privacy) describing what is stored in IndexedDB on this device, that nothing is uploaded, what clearing browser data means, and the export/delete controls.
- Verified: lint, typecheck, vitest (new page, link and route tests), build, format:check, roadmap tests. Not viewed in a real browser.
- Next: L236 add data model documentation describing each record and export field.
- Blockers: none

## 2026-11-02 — L236: Add data model documentation
- Changed: New `docs/DATA-MODEL.md` describes every record type, its stores and fields, the shared metadata, the export file envelope, and how records relate and merge on import.
- Verified: fields checked against `src/domain/*.ts`, `database.ts` and `mergeRecords.ts`; format:check and roadmap tests/check pass. Docs only, no code change.
- Next: L237 add a migrations rollback fixture so a bad migration leaves old data available.
- Blockers: none

## 2026-11-02 — L237: Add migrations rollback fixture
- Changed: A database test seeds a version 1 database, runs a deliberately failing upgrade, and confirms the old version, stores and saved record are still there afterwards. No app behaviour changed.
- Verified: vitest for the data tests, lint, typecheck, build, format:check, roadmap tests/check.
- Next: L238 screen reader pass so key forms announce labels and errors.
- Blockers: none

## 2026-11-02 — L238: Add screen reader pass
- Changed: Form errors on Gratitude, Ideas and Memories now carry an id and are linked to the main field with aria-describedby; the check-in note is linked to its characters-remaining message. Labels were already tied to every field and errors already use role="alert".
- Verified: lint, typecheck, vitest (new tests for the error link and InlineError id), build, format:check, roadmap tests/check. Not tested with an actual screen reader.
- Next: L239 keyboard-only pass over every primary flow.
- Blockers: none

## 2026-11-02 — L239: Add keyboard-only pass
- Changed: The mood radio buttons now show the same visible focus ring as other controls. New browser tests save a memory, add an idea, and use the skip link and main navigation using only the keyboard (check-in and gratitude were already covered).
- Verified: lint, typecheck, vitest (new focus-style test), build, format:check, full Playwright suite, roadmap tests/check. Reviewed that all controls are native buttons, links and inputs.
- Next: L240 tag the offline release candidate once local-only build and checks pass.
- Blockers: none

## 2026-11-02 — L240: Tag offline release candidate
- Changed: Added `docs/OFFLINE-RELEASE.md` and tagged the offline-only app `v0.1.0-rc.1` after all checks passed. The offline personal app is complete.
- Verified: npm ci state, lint, typecheck, vitest (442 tests), build, format:check, full Playwright suite (36), roadmap tests/check; searched src for network calls and found none.
- Next: L241 create the API workspace package (start of the sharing phase).
- Blockers: none

## 2026-11-02 — L241: Create API workspace package
- Changed: New `api/` npm workspace (`love-iteration-api`) with its own `build`, `typecheck` and `test` scripts, a tiny version module with a test, and a short README. The offline app does not use it.
- Verified: `npm run build -w love-iteration-api`, `npm test -w love-iteration-api`, typecheck, root lint, typecheck, build, vitest, format:check, `npm ci`, roadmap tests/check. Build output `api/dist` is git-ignored.
- Next: L242 add GET /health returning version and status.
- Blockers: none

## 2026-11-02 — L242: Add API health endpoint
- Changed: The API package has a small Node HTTP server (no dependencies). GET /health returns `{ status: "ok", name, version }` as JSON; other paths return 404.
- Verified: API build and tests (health and 404 over a real local port), root lint, typecheck, vitest, format:check, roadmap tests/check.
- Next: L243 add an input validation helper so an invalid JSON body yields 400.
- Blockers: none

## 2026-11-02 — L243: Add API input validation helper
- Changed: `api/src/jsonBody.ts` reads and parses a JSON request body; invalid JSON becomes a 400 reply with a fixed message that never repeats the submitted text.
- Verified: API build and tests (parse, message check, and a real HTTP request returning 400 then 200), root lint, typecheck, vitest, format:check, roadmap tests/check. The helper is not yet wired to a route (none accepts a body yet).
- Next: L244 give known API errors a shared code and message shape.
- Blockers: none

## 2026-11-03 — L244: Add API error response shape
- Changed: Known API errors (not found, bad JSON) now share one JSON shape with code and message fields, defined in api/src/errors.ts.
- Verified: API build and tests, root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L245 add a request ID to every response.
- Blockers: none

## 2026-11-03 — L245: Add request ID middleware
- Changed: Every API response (including errors) now carries a unique x-request-id header.
- Verified: API build and tests (IDs differ per response), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L246 add safe request logging that never records journal text.
- Blockers: none

## 2026-11-03 — L246: Add safe request logging
- Changed: The API can log one line per request (id, method, path, status, time). Query strings and bodies are never logged, so journal text cannot appear.
- Verified: API build and tests (private words in query and body absent from logs), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L247 add a SQLite connection module that opens an in-memory database in a test.
- Blockers: none

## 2026-11-03 — L247: Add SQLite connection module
- Changed: api/src/db.ts opens a SQLite database with Node's built-in driver (no new dependency) and turns on foreign keys; documented the Node 22.5+ requirement.
- Verified: API build and tests (in-memory open, insert, read, foreign keys on), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L248 add a migration runner so the schema version advances exactly once.
- Blockers: none

## 2026-11-03 — L248: Add migration runner
- Changed: api/src/migrate.ts applies ordered SQL migrations using SQLite's user_version; each runs once in a transaction and a failure rolls back.
- Verified: API build and tests (advances once, re-run is a no-op, failure rolls back, gaps rejected), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L249 create the accounts table as migration 1 with a schema test.
- Blockers: none

## 2026-11-03 — L249: Create accounts table
- Changed: Migration 1 creates the accounts table (id, unique email, display name, password hash, timestamps).
- Verified: API build and tests (column list and unique-email constraint), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L250 create the spaces table as migration 2.
- Blockers: none

## 2026-11-03 — L250: Create spaces table
- Changed: Migration 2 creates the spaces table (id, name, creator account, timestamps).
- Verified: API build and tests (columns and foreign key to accounts), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L251 create the memberships table as migration 3.
- Blockers: none

## 2026-11-03 — L251: Create memberships table
- Changed: Migration 3 creates memberships (space, account, owner/member role, joined time) with one row per person per space; leaving or deleting a space removes the rows.
- Verified: API build and tests (columns, duplicate and bad-role rejected, cascade delete), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L252 create the invites table as migration 4.
- Blockers: none

## 2026-11-03 — L252: Create invites table
- Changed: Migration 4 creates invites (space, inviter, token hash only, expiry, accepted and revoked times) so invitations can be revoked and tokens are never stored in plain form.
- Verified: API build and tests (columns, unique hash, foreign key, revoke update), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L253 create the records table as migration 5.
- Blockers: none

## 2026-11-03 — L253: Create records table
- Changed: Migration 5 creates the shared records table (space, kind, JSON body, revision starting at 1, author, timestamps) with an index by space.
- Verified: API build and tests (columns, default revision, foreign key), root lint, typecheck, build, vitest, format:check, roadmap tests/check.
- Next: L254 create the tombstones table as migration 6.
- Blockers: none

## 2026-11-04 — L254: Create tombstones table
- Changed: Migration 6 creates tombstones (record, space, last revision, deleter, deleted time) so deletions can sync as markers; removing a space clears them.
- Verified: API build and tests (columns, duplicate record and bad-space rejected, cascade delete), root lint, typecheck, build, format:check, roadmap tests/check.
- Next: L255 create the sync cursors table as migration 7.
- Blockers: none

## 2026-11-04 — L255: Create sync cursors table
- Changed: Migration 7 creates sync_cursors (one position per person per space) so sync can resume where it left off.
- Verified: API build and tests (columns, duplicate and bad-space rejected, cascade delete), root lint, typecheck, build, format:check, roadmap tests/check.
- Next: L256 add a database backup command whose copy passes an integrity check.
- Blockers: none

## 2026-11-04 — L256: Add database backup command
- Changed: `npm run backup -w love-iteration-api -- <db> <backup>` copies the server database to a new file and integrity-checks the copy; it never overwrites an existing backup.
- Verified: API build and tests (copy passes integrity_check, keeps data, refuses overwrite), ran the CLI by hand on a temp database (success, then refusal on second run), root lint, typecheck, build, format:check, roadmap tests/check.
- Next: L257 add a startup migration check so the server refuses a newer, unsupported schema.
- Blockers: none

## 2026-11-05 — L257: Add startup migration check
- Changed: Running migrations now refuses a database whose schema version is newer than this server knows, with a clear "upgrade the server" error, and leaves it untouched.
- Verified: API build and tests (new test for newer schema), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L258 add config validation so a missing secret gives a useful startup error.
- Blockers: none

## 2026-11-05 — L258: Add config validation
- Changed: A new `loadConfig` reads `LOVE_SESSION_SECRET` and `LOVE_PORT`; a missing or short secret or bad port gives one clear startup error listing every problem.
- Verified: API build and tests (missing, short, bad port, valid, default port), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L259 add a localhost dev config so the server does not bind publicly by default.
- Blockers: none

## 2026-11-06 — L259: Add localhost dev config
- Changed: Server config now has a `host` that defaults to `127.0.0.1` (override with `LOVE_HOST`), and `startServer` listens on it, so nothing is exposed publicly by default.
- Verified: API build and tests (default host, override, server binds to 127.0.0.1), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L260 add a CORS allowlist so an unlisted origin gets no CORS grant.
- Blockers: none

## 2026-11-06 — L260: Add CORS allowlist
- Changed: The API answers cross-origin calls only for origins in `LOVE_ALLOWED_ORIGINS`; any other origin gets no CORS grant, including on preflight.
- Verified: API build and tests (grant for listed origin, none for unlisted/missing, preflight, config parsing), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L261 add documented secure response headers to API responses.
- Blockers: none

## 2026-11-06 — L261: Add secure response headers
- Changed: Every API response (errors too) sets nosniff, no-store, no-referrer and a locked-down CSP; they are documented in the API README.
- Verified: API build and tests (headers on 200 and 404, README documents each header), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L262 add a request body size limit that returns 413 for oversized JSON.
- Blockers: none

## 2026-11-06 — L262: Add body size limit
- Changed: JSON request bodies over 1 MiB are refused with 413 `too_large`; reading stops early so huge uploads are not held in memory.
- Verified: API build and tests (oversized body 413, small body 200, error table), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L263 add an API rate-limit hook so repeated requests receive 429.
- Blockers: none

## 2026-11-06 — L263: Add API rate-limit hook
- Changed: The server accepts an optional rate limiter; a client over its limit gets 429 `rate_limited` with `retry-after`. Counts stay in memory.
- Verified: API build and tests (limiter window logic, 429 over HTTP after two requests), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L264 add an API test database fixture so tests use isolated temporary databases.
- Blockers: none

## 2026-11-06 — L264: Add API test database fixture
- Changed: `createTestDb()` gives each test its own migrated temporary database file and `closeTestDbs()` removes them; the migrations tests now use it.
- Verified: API build and tests (fixture isolation and cleanup, migrations tests on temp files), root lint, typecheck, build, format:check, vitest, roadmap tests/check.
- Next: L265 add a /health integration test asserting status and version.
- Blockers: none

## 2026-11-07 — L265: Confirm /health integration test
- Changed: The existing /health integration test (status ok and version equal to apiVersion) is now the recorded acceptance check for L265.
- Verified: API tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L266 add an OpenAPI base document that lists the health route.
- Blockers: none

## 2026-11-07 — L266: Add API OpenAPI base document
- Changed: api/src/openapi.ts describes the API as OpenAPI 3.0 with the /health route.
- Verified: API tests (health route in schema), root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L267 add a Dockerfile for the API.
- Blockers: none

## 2026-11-08 — L267: Add Dockerfile for API
- Changed: `api/Dockerfile` (plus `.dockerignore`) builds a small image that runs the API as a non-root user on port 8787; README shows build and run.
- Verified: `docker build` succeeded; the container started and answered `GET /health` with status ok. Root typecheck, lint, build, format:check, vitest, API tests, roadmap tests/check (see commit).
- Next: L268 add a compose development file so the API and a data volume start locally.
- Blockers: none (note: in this sandbox, npm inside docker fails on a proxy certificate, so the image has no install step; Docker Hub was rate-limited, base image pulled via mirror.gcr.io and tagged locally).

## 2026-11-08 — L268: Add compose development file
- Changed: `compose.yaml` starts the API on 127.0.0.1:8787 with a persistent `love-data` volume at `/data`; the image now has a writable `/data` folder. README documents it.
- Verified: `docker compose up --build` started the API, `/health` answered ok, `/data` was writable by the node user, the volume remained after `down`; compose refuses to start without the secret. Root typecheck, lint, build, format:check, vitest, API tests, roadmap tests/check.
- Next: L269 document self-host setup with start and backup steps.
- Blockers: none

## 2026-11-08 — L269: Document self-host setup
- Changed: README has a "Self-hosting the optional API" section with start, stop, data, secret, and backup steps.
- Verified: the backup command was run on a temporary database and produced a copy; start steps match the compose file tested in L268. Root typecheck, lint, build, format:check, vitest, API tests, roadmap tests/check.
- Next: L270 add an API CI job that runs migrations and tests on pull requests.
- Blockers: none

## 2026-11-08 — L270: Add API CI job
- Changed: `.github/workflows/checks.yml` has an `api` job (Node 22) that typechecks the API and runs its tests, including the migrations tests, on pull requests and pushes to main.
- Verified: workflow YAML parses and triggers on pull_request; the exact job commands (API typecheck and tests) pass locally. The job itself will first run on GitHub. Root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L271 validate account handles so empty or disallowed ones are rejected.
- Blockers: none

## 2026-11-08 — L271: Validate account handle
- Changed: `validateHandle` in the API trims and lowercases a handle, then rejects empty, too short/long, disallowed characters, and reserved names, with a plain reason.
- Verified: new API tests cover accepted, empty, length, characters, and reserved cases. API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L272 add a password hash helper whose round trip verifies and wrong secret fails.
- Blockers: none

## 2026-11-08 — L272: Add password hash helper
- Changed: `hashPassword` and `verifyPassword` in the API use Node's built-in scrypt with a random salt per hash and a constant-time comparison; settings are stored inside each hash.
- Verified: API tests (round trip, wrong/empty password, different hash each time, no plain text stored, malformed stored values). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L273 add the account creation endpoint so a valid request stores one account.
- Blockers: none

## 2026-11-08 — L273: Add account creation endpoint
- Changed: `POST /accounts` validates a handle, password (10–200 chars) and optional display name, stores one account with a salted scrypt hash, and answers 201 without the hash. The server now opens and migrates a SQLite file at `LOVE_DB_PATH` (default `love.db`; `/data/love.db` in the Docker image). Migration 8 makes email optional and adds a unique handle (no accounts could exist before). Added `invalid_request` and `server_error` error codes; OpenAPI and API README updated.
- Verified: API tests (input checks, one stored row, hash not password, 400s store nothing, 404 without a database, migration handle uniqueness, config path); in Docker, a POST created an account on the volume and it survived a restart. API typecheck, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L274 reject a duplicate handle with a conflict response (today a duplicate returns a generic 500).
- Blockers: none

## 2026-11-08 — L274: Reject duplicate handle
- Changed: registering a handle that is already used (any letter case) now returns 409 `conflict` with a plain message and stores nothing, instead of a generic server error. The database's unique index decides, so simultaneous requests cannot both succeed.
- Verified: API tests (createAccount throws on duplicate and leaves one row; POST /accounts returns 409 for "SAM" after "Sam"). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L275 add the login endpoint so valid credentials create a session.
- Blockers: none

## 2026-11-08 — L275: Add login endpoint
- Changed: `POST /login` checks a handle and password and, when they match, starts a session and returns `{ sessionToken }`; anything else gets a 401 with one shared message. Sessions are held in memory for 7 days behind a small store interface that keeps only a hash of each token.
- Verified: API tests (store lookup, uniqueness, expiry; checkLogin right/wrong/unknown; POST /login 200 with a token that finds the account, 401 for a wrong password and a malformed body). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L276 make failed logins reveal nothing about whether an account exists (including timing). The token is returned in the body only until L279 moves it into a cookie; L278 will back the store with the database.
- Blockers: none

## 2026-11-09 — L276: Add failed-login response
- Changed: a login for an unknown handle now does the same password-hashing work as a wrong password (against a decoy hash), so neither the 401 body nor the response time shows whether an account exists.
- Verified: API tests (unknown handle and wrong password return identical 401 status and body). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check. Timing equality reasoned from the shared scrypt path, not measured.
- Next: L277 limit repeated login failures.
- Blockers: none

## 2026-11-09 — L277: Add login throttling
- Changed: after 5 failed logins for a handle, or 5 from one client address, within 15 minutes, `POST /login` answers 429 (`retry-after: 900`) even for the right password. Unknown handles are counted too, so a block reveals nothing about accounts. A successful login clears the handle's count.
- Verified: API tests (throttle unit tests incl. window expiry; server test: 3 failures then a correct password is blocked with 429). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L278 back sessions with a database table of hashed tokens.
- Blockers: none

## 2026-11-09 — L278: Add session table
- Changed: migration 9 adds a `sessions` table that stores only a SHA-256 hash of each session token, the account, and creation/expiry times. Rows are removed with their account. Nothing reads or writes it yet; the store switches to it in a later step.
- Verified: migration test (columns, duplicate hash rejected, unknown account rejected, cascade on account delete). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L279 set the session cookie (HttpOnly, Secure in production).
- Blockers: none

## 2026-11-09 — L279: Set secure session cookie
- Changed: `POST /login` now sends the session as a `love_session` cookie (HttpOnly, SameSite=Lax, 7 days, plus Secure when `NODE_ENV=production`, which the Docker image sets) and no longer puts the token in the response body (`{ ok: true }`).
- Verified: cookie unit tests, config tests, server tests (cookie has HttpOnly; Secure appears when secure cookies are on and the token finds the account). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L280 add a logout endpoint that revokes the session.
- Blockers: none

## 2026-11-09 — L280: Add logout endpoint
- Changed: `POST /logout` ends the session named by the `love_session` cookie and clears the cookie; it answers 200 even with no session. Session stores gained `revoke(token)`.
- Verified: tests for store revoke, cookie parsing/clearing, and a server test where a token works after login, stops working after logout, and a repeat logout is harmless. API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L281 add the current-account endpoint (authenticated request returns the account ID).
- Blockers: none

## 2026-11-09 — L281: Add current-account endpoint
- Changed: `GET /me` returns `{ accountId }` for a request carrying a live session cookie, and 401 for no cookie, a forged token, or a revoked session.
- Verified: server test (login then /me gives the account ID; missing and forged cookies get 401). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L282 reject unauthenticated writes on protected routes with 401.
- Blockers: none

## 2026-11-09 — L282: Reject unauthenticated write
- Changed: any POST/PUT/PATCH/DELETE other than sign-up, login and logout now answers 401 unless the request carries a live session cookie, so future write routes are protected by default. Reads of unknown routes stay 404.
- Verified: server test (all four write methods get 401 without a session; GET of an unknown route is 404; once logged in the write reaches routing and gets 404). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L283 add the password change endpoint (old password required).
- Blockers: none

## 2026-11-09 — L283: Add password change endpoint
- Changed: `POST /password` (logged in) takes `{ oldPassword, newPassword }`, checks the old password, validates the new one with the sign-up rule, and stores a fresh salted hash. Wrong or missing old password, or a bad new one, returns 400 and changes nothing.
- Verified: account tests (wrong/missing old, bad new, success: old password stops working, new one works) and a server test (401 without a session; 400 cases; 200 then login with old fails and new succeeds). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L284 revoke other sessions when the password changes.
- Blockers: none

## 2026-11-09 — L284: Add password-change session revocation
- Changed: changing the password now ends every earlier session for the account (`revokeAll`) and gives the changing device a fresh session cookie, so it stays logged in while any other device or stolen cookie stops working.
- Verified: store test for revokeAll; server test (old cookie gets 401 from /me after the change, the new cookie gets 200). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L285 add the account deletion flow (records and sessions removed after confirmation).
- Blockers: none

## 2026-11-09 — L285: Add account deletion flow
- Changed: `DELETE /account` (logged in) needs the password and the exact phrase "delete my account". It then removes, in one transaction, the account, its sessions, invites, sync positions, every record it wrote, and every space it was alone in. A space shared with someone else is kept and the longest-standing other member becomes its owner (their records stay; deletion markers are reassigned). The cookie is cleared.
- Verified: deletion tests (nothing deleted on wrong password or phrase; solo space, records, sessions removed; shared space handed over with the other person's record and tombstone kept) and a server test (401 without session, 400 cases, 200 then session and login both fail). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L286 add the sharing opt-in screen (local data stays local until an explicit choice).
- Blockers: none. Note: the handover rule for shared spaces is my choice; revisit if you prefer deleting shared spaces too.

## 2026-11-09 — L286: Add sharing opt-in screen
- Changed: a new Sharing page (linked from Settings as "Sharing choices") says sharing is off and that everything stays on this device. "Turn on sharing" first asks for confirmation ("Nothing is sent yet…"); only "Yes, turn on sharing" records the choice (in this browser's localStorage, guarded so blocked storage leaves it off). It can be turned off again. The page sends nothing; no account or server is connected in the web app yet.
- Verified: unit tests for the stored choice (default off, save, blocked storage) and page tests (starts off and stores nothing, "Not now" leaves it off, confirm turns on, turn off, remembers earlier choice); route tests. Typecheck, lint, build, format:check, vitest, API tests, roadmap tests/check. UI reasoned (not browser-tested): plain text and buttons in the existing layout, so a narrow phone layout reflows; native buttons and links are keyboard reachable with the app's visible focus styles; no motion added.
- Next: L287 create shared space endpoint (authenticated creator becomes owner).
- Blockers: none

## 2026-11-10 — L287: Create shared space endpoint
- Changed: `POST /spaces` (logged in) takes a name (1–80 characters) and creates a shared space; the caller becomes its owner. 401 without a session, 400 for a bad name.
- Verified: spaces unit tests (name rule, creator is owner) and a server test (401, 400, 201 with owner membership row). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L288 list my spaces endpoint (only memberships returned).
- Blockers: none

## 2026-11-10 — L288: List my spaces endpoint
- Changed: `GET /spaces` (logged in) returns only the spaces the caller is a member of, with their role. 401 without a session.
- Verified: store test (own and joined spaces listed, others' not) and a server test with two accounts (each sees only their own; 401 logged out). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L289 create invite endpoint (owner receives a one-time invitation link).
- Blockers: none

## 2026-11-10 — L289: Create invite endpoint
- Changed: `POST /spaces/:id/invites` gives the space's owner a one-time invitation link (`/invite/<token>`, shown once; only a hash is stored). Members, strangers and unknown spaces get 404; no session gets 401. Invites currently last 7 days.
- Verified: invite unit tests (hash only stored, unique links, non-owner/unknown space refused) and a server test (401, 404, 201 link shape). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L290 set invite expiry (expired token cannot be accepted).
- Blockers: none

## 2026-11-10 — L290: Set invite expiry
- Changed: Invites take an optional `?hours=1..720` (default 168) and record when they expire. A new `findInvite` lookup reports an expired token as `expired`, so it can never be accepted.
- Verified: unit tests (hours parsing; token valid just before expiry, expired at and after it; unknown token) and a server test (hours=1 expires within the hour; hours=0 gives 400). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L291 limit invite scope (token names exactly one space).
- Blockers: none

## 2026-11-10 — L291: Limit invite scope
- Changed: Documented and tested that an invite token resolves to exactly one space: two invites for two spaces each open only their own, and the database refuses an invite with no space.
- Verified: invite test with two spaces plus a NOT NULL check. API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L292 accept invite endpoint (accepted person becomes member).
- Blockers: none

## 2026-11-10 — L292: Accept invite endpoint
- Changed: `POST /invites/accept` (logged in) takes the token in the JSON body (never the path, since paths are logged) and makes the caller a member of the one space the invite names; the invite records who accepted it. Unknown token 404, expired or missing token 400. An owner accepting their own invite stays owner.
- Verified: invite unit tests (member added and recorded; unknown/expired add no one; owner stays owner) and a server test (401, 400, 404, 200, then the space appears in the caller's list). API typecheck/tests, root typecheck, lint, build, format:check, vitest (one unrelated frontend test failed once in a run and passed on two reruns; this change touches only api/), roadmap tests/check.
- Next: L293 reject invite reuse (second acceptance fails).
- Blockers: none

## 2026-11-10 — L293: Reject invite reuse
- Changed: An invitation link now works once: a second acceptance (by anyone, including the first person) gets 409 and adds no one. The claim is a single conditional update, so two simultaneous tries cannot both succeed.
- Verified: unit test (second and third acceptance return used; no extra member; first acceptor recorded) and server test (409 for the same and a different account). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L294 revoke invite endpoint (owner can invalidate an unused token).
- Blockers: none

## 2026-11-10 — L294: Revoke invite endpoint
- Changed: `DELETE /spaces/:id/invites/:inviteId` lets the space's owner cancel an unused invitation; the link then fails with 400 "cancelled". Non-owners and wrong spaces get 404, an already-accepted invite gets 409.
- Verified: unit tests (owner revokes, repeat is safe, accept refused afterwards, non-owner/wrong space/missing not found, accepted can't be revoked) and a server test (401, 404, 200, accept then 400). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L295 leave shared space endpoint (membership is removed).
- Blockers: none

## 2026-11-10 — L295: Leave shared space endpoint
- Changed: `DELETE /spaces/:id/membership` removes the caller's membership. Their records stay for the others. If the owner leaves, the longest-standing member becomes owner; the last person out closes the space. Non-members get 404.
- Verified: unit tests (member leaves, space stays; owner hand-over; last one out deletes; not-a-member) and a server test (401, 200, 404 on repeat, lists updated). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check. Note: leaving keeps the leaver's records in the space — revisit if you prefer removing them.
- Next: L296 remove member endpoint (owner can remove another member).
- Blockers: none

## 2026-11-11 — L296: Remove member endpoint
- Changed: `DELETE /spaces/:id/members/:accountId` lets the space owner remove another member; their records stay. Non-owners and unknown members get 404, the owner removing themselves gets 400 (leave instead).
- Verified: unit test (owner removes, non-owner/self/unknown refused, repeat 404) and server test (401, 404, 400, 200, 404, removed member sees no spaces). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L297 protect personal records (shared member cannot fetch personal entries).
- Blockers: none

## 2026-11-11 — L297: Protect personal records
- Changed: `GET /spaces/:id/records` returns a shared space's records only to its members (others get 404). It never includes records from other spaces, and personal entries are never stored on the server.
- Verified: unit test (member sees only that space's record; other space and missing space give null) and server test (401, 404 for non-member, 200 for member). API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check.
- Next: L298 show shared-space member list in the UI.
- Blockers: none

## 2026-11-11 — L298: Show shared-space member list
- Changed: New `MemberList` names everyone in a shared space (owner marked, "Just you for now." when empty). The Sharing page shows it when given members; it stays hidden while no space is connected. Plain list, so it reads well on a narrow phone and with a screen reader.
- Verified: component tests (names + owner marker, empty state) and a page test; typecheck, lint, build, format:check, vitest (453), API tests, roadmap tests/check. Not yet wired to the API (no web client exists yet).
- Next: L299 invitation permission copy (UI explains visibility before acceptance).
- Blockers: none

## 2026-11-11 — L299: Show invitation permission copy
- Changed: New `InvitePermissions` explains, before accepting, that nothing is shared yet, what members can see (name, records added to the space), what they never see (personal entries, other spaces), and that the person can leave or the inviter can cancel.
- Verified: component tests for the space name, not-shared-yet line, visible/private lists and leave note; typecheck, lint, build, format:check, vitest (455) incl. no-judgment copy scan, API tests, roadmap tests/check. Headings and lists only, so it reads well on a narrow phone and with a screen reader; no web invite route exists yet to mount it.
- Next: L300 invite browser flow test (invitation, acceptance, revocation work).
- Blockers: none

## 2026-11-11 — L300: Add invite flow test
- Changed: Added `api/src/inviteFlow.test.ts`: one end-to-end test that creates accounts, invites, accepts (member appears), cancels a second invite, and confirms the late acceptance is refused and joins nothing.
- Verified: new flow test passes; API typecheck/tests, root typecheck, lint, build, format:check, vitest, roadmap tests/check. Note: it drives the real server over HTTP with cookies, not a Playwright page, because no invite UI exists in the web app yet.
- Next: L301 define sync record envelope (scope, id, revision, payload typed).
- Blockers: none

## 2026-11-11 — L301: Define sync record envelope
- Changed: New typed `SyncEnvelope` (scope personal/shared, optional spaceId, id, revision, kind, payload, deleted) and `makeEnvelope` (revision defaults to 1), exported from the domain. Nothing is sent anywhere.
- Verified: unit tests for fields and default/explicit revision; typecheck, lint, build, format:check, vitest, API tests, roadmap tests/check.
- Next: L302 validate sync scope (personal record cannot be uploaded as shared).
- Blockers: none

## 2026-11-11 — L302: Validate sync scope
- Changed: `assertUploadable` refuses to upload a personal record (even if it is labelled with a space) and a shared record with no space, with plain messages. Nothing is sent anywhere.
- Verified: unit tests for shared accepted, personal refused with and without a space label, shared without space refused; typecheck, lint, build, format:check, vitest (460), API tests, roadmap tests/check.
- Next: L303 server record put (owner write increments revision).
- Blockers: none

## 2026-11-12 — L303: Add server record put
- Changed: `PUT /spaces/:id/records/:recordId` lets a space member write one shared record; the first write is revision 1 and each rewrite adds one. Non-members and ids from another space get the same not-found. Documented in the OpenAPI summary.
- Verified: new unit test and HTTP test (revision 1 → 2, 400 on bad body, 401 without session); API typecheck/tests (116), root typecheck, lint, build, format:check, vitest (460), roadmap tests/check.
- Next: L304 server record list (only members can read space records).
- Blockers: none

## 2026-11-13 — L304: Add server record list
- Changed: Confirmed `GET /spaces/:id/records` (added with L297) already returns a space's records only to its members; non-members get the same not-found. Documented in the OpenAPI summary. No code change was needed.
- Verified: existing unit test (`a member only reads records of spaces they belong to`) and HTTP test (`GET /spaces/:id/records hides records from non-members`) pass; typecheck, build, API tests (116), vitest, roadmap tests/check.
- Next: L305 server record delete (deletion writes a tombstone).
- Blockers: none

## 2026-11-13 — L305: Add server record delete
- Changed: `DELETE /spaces/:id/records/:recordId` lets a member delete a shared record; it is removed and a tombstone with the next revision is stored so other devices can learn it is gone. Non-members and unknown ids get not-found. Documented in OpenAPI.
- Verified: new unit test (non-member refused, record gone, tombstone row with revision 2, second delete refused); API typecheck/tests (117), root typecheck, lint, build, format:check, roadmap tests/check. No HTTP-level test for the new route.
- Next: L306 server cursor response (changed records after a cursor are returned).
- Blockers: none

## 2026-11-13 — L306: Add server cursor response
- Changed: `GET /spaces/:id/changes?cursor=<time>` returns the shared records written and the tombstones deleted after that cursor, plus a new cursor (the newest change time; unchanged when nothing changed). Members only. Documented in OpenAPI.
- Verified: new unit test (first fetch, quiet fetch keeps cursor, later write + delete returned, non-member null); API typecheck/tests (118), root typecheck, lint, build, format:check, roadmap check. No HTTP-level test for the route. Cursor is a strict timestamp comparison, so L307 must handle many changes sharing one time.
- Next: L307 cursor pagination (a large change set pages without omissions).
- Blockers: none

## 2026-11-13 — L307: Add cursor pagination
- Changed: `GET /spaces/:id/changes` now pages with `?limit=` (default 100, max 500). Changes are ordered by a "time|id" position, so many changes with the same timestamp still page cleanly; each page returns the new cursor and a `more` flag. This also fixes the tie-at-one-timestamp gap noted in L306.
- Verified: new unit test (25 changes at one timestamp plus a deletion, pages of 10 → 3 pages, no omissions or repeats); API typecheck/tests (119), root typecheck, lint, build, format:check, roadmap tests/check. No HTTP-level test for the `limit` parameter.
- Next: L308 client sync queue store (an offline mutation stays queued).
- Blockers: none

## 2026-11-13 — Direction change: the project is now an art gallery
- Changed: README, CLAUDE.md, AGENTS.md, docs/ARCHITECTURE.md, and docs/DAILY-RUN.md now describe a gallery of ASCII and three.js art pieces with a craft bar. ROADMAP.md L308–L360 were replaced: gallery foundation (L308–L319), 32 pieces (L320–L351), polish (L352–L360). The journal and `api/` code stays but is no longer extended.
- Verified: roadmap check and tests, format:check, lint, vitest (460), build. No app code changed.
- Next: L308 add three.js with lazy loading.
- Blockers: none
