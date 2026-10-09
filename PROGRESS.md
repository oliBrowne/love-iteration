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
