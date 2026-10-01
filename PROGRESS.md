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
