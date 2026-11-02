# Offline release candidate

The local-only app (roadmap L001 to L240) is tagged `v0.1.0-rc.1`. It has no accounts, no server, and makes no network requests of its own: all records live in IndexedDB on the device, and export, import and delete-all controls exist (see `docs/DATA-MODEL.md`).

## Checks that passed for the tag

Run from a clean checkout:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
npm run test:e2e
node scripts/roadmap.mjs check
node --test scripts/roadmap.test.mjs
```

Also confirmed: no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` or external URLs in `src/` or `index.html`, and `dist/` is not committed.

## Known limits

- Not yet tried with a real screen reader or on a physical phone.
- Clearing browser data removes the records; use Settings > Download export first.

Sharing and sync (L241 onward) start only from this point.
