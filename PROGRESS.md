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
