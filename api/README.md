# Love Iteration API

The optional self-hostable server for sharing and sync. The offline app does not need it and never talks to it unless the person turns sharing on.

```sh
npm run build -w love-iteration-api   # compile to api/dist (not committed)
npm test -w love-iteration-api        # run the API tests
```

The server needs Node 22.5 or newer, because the database uses the built-in `node:sqlite` module.

The server listens on `127.0.0.1` only by default. Set `LOVE_HOST` (for example `0.0.0.0` in a container) to change that on purpose.

Browsers may call the API only from origins listed in `LOVE_ALLOWED_ORIGINS` (comma-separated, for example `https://love.example`). With none listed, no origin receives a CORS grant.

Back up a database with `npm run backup -w love-iteration-api -- <database-file> <backup-file>`. The copy is opened and integrity-checked, and an existing backup file is never overwritten.

## Response headers

Every API response, including errors, sets these headers:

- `x-content-type-options`: `nosniff`, so browsers do not guess content types.
- `cache-control`: `no-store`, so shared data is never cached.
- `referrer-policy`: `no-referrer`, so no address is leaked to other sites.
- `content-security-policy`: `default-src 'none'; frame-ancestors 'none'`, so a response can never load content or be framed.

Each response also has an `x-request-id`. Use HTTPS in front of the server outside local development.

## Request size limit

JSON request bodies larger than 1 MiB are refused with `413` and the `too_large` error code.

## Rate limiting

`createApiServer` accepts an optional rate limiter (`createRateLimiter` in `src/rateLimit.ts`). A client over its limit gets `429` with the `rate_limited` error code and a `retry-after` header. Counts are kept in memory only.

## Tests use temporary databases

Database tests call `createTestDb()` from `src/testDb.ts`. Each call creates a fresh, migrated database file in its own temporary folder, and `closeTestDbs()` deletes them all. No test shares data with another, and no test touches a real database.

## Docker image

Build from the repository root and run with a secret of at least 32 characters:

```sh
docker build -f api/Dockerfile -t love-iteration-api .
docker run --rm -p 8787:8787 -e LOVE_SESSION_SECRET=<long random string> love-iteration-api
```

The image runs as the unprivileged `node` user and listens on `0.0.0.0:8787` inside the container.

## Local development with Compose

From the repository root:

```sh
export LOVE_SESSION_SECRET=<long random string>
docker compose up --build
```

The API is reachable at `http://127.0.0.1:8787/health`. Data lives in the `love-data` volume mounted at `/data`, which survives `docker compose down` (add `-v` to delete it). Compose refuses to start without `LOVE_SESSION_SECRET`.
