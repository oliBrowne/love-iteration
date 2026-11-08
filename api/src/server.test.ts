import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { after } from 'node:test';
import { loadConfig } from './config.ts';
import { createRateLimiter } from './rateLimit.ts';
import { createApiServer, startServer } from './server.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';
import { apiVersion } from './version.ts';

async function withServer(
  run: (base: string) => Promise<void>,
  allowedOrigins: string[] = [],
): Promise<void> {
  const server = createApiServer(undefined, allowedOrigins);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /health returns status and version', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/health`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /application\/json/);
    const body = (await res.json()) as { status: string; version: string };
    assert.equal(body.status, 'ok');
    assert.equal(body.version, apiVersion);
  });
});

test('an unknown path is a 404', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/nope`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), {
      code: 'not_found',
      message: 'Not found.',
    });
  });
});

test('each response has its own request ID', async () => {
  await withServer(async (base) => {
    const a = await fetch(`${base}/health`);
    const b = await fetch(`${base}/nope`);
    const idA = a.headers.get('x-request-id');
    const idB = b.headers.get('x-request-id');
    assert.ok(idA && idB);
    assert.notEqual(idA, idB);
  });
});

test('startServer binds to localhost by default config', async () => {
  const config = loadConfig({
    LOVE_SESSION_SECRET: 'x'.repeat(32),
    LOVE_PORT: '',
  });
  const server = await startServer({ ...config, port: 0 });
  try {
    assert.equal((server.address() as AddressInfo).address, '127.0.0.1');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('only a listed origin receives a CORS grant', async () => {
  await withServer(
    async (base) => {
      const listed = await fetch(`${base}/health`, {
        headers: { origin: 'https://love.example' },
      });
      assert.equal(
        listed.headers.get('access-control-allow-origin'),
        'https://love.example',
      );
      const unlisted = await fetch(`${base}/health`, {
        headers: { origin: 'https://evil.example' },
      });
      assert.equal(unlisted.headers.get('access-control-allow-origin'), null);
      const preflight = await fetch(`${base}/health`, {
        method: 'OPTIONS',
        headers: { origin: 'https://evil.example' },
      });
      assert.equal(preflight.status, 204);
      assert.equal(preflight.headers.get('access-control-allow-origin'), null);
    },
    ['https://love.example'],
  );
});

test('responses carry the security headers, even errors', async () => {
  await withServer(async (base) => {
    for (const path of ['/health', '/nope']) {
      const res = await fetch(`${base}${path}`);
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(res.headers.get('cache-control'), 'no-store');
      assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
      assert.match(
        res.headers.get('content-security-policy') ?? '',
        /default-src 'none'/,
      );
    }
  });
});

test('repeated requests receive 429 once the limit is passed', async () => {
  const allow = createRateLimiter({ limit: 2, windowMs: 60_000 });
  const server = createApiServer(undefined, [], allow);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const url = `http://127.0.0.1:${port}/health`;
    assert.equal((await fetch(url)).status, 200);
    assert.equal((await fetch(url)).status, 200);
    const limited = await fetch(url);
    assert.equal(limited.status, 429);
    assert.equal(
      ((await limited.json()) as { code: string }).code,
      'rate_limited',
    );
    assert.equal(limited.headers.get('retry-after'), '60');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

after(closeTestDbs);

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('POST /accounts stores one account and never returns the hash', async () => {
  const db = createTestDb();
  const server = createApiServer(undefined, [], undefined, db);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const res = await postJson(`${base}/accounts`, {
      handle: 'Sam',
      password: 'a long enough secret',
    });
    assert.equal(res.status, 201);
    const body = (await res.json()) as Record<string, unknown>;
    assert.equal(body.handle, 'sam');
    assert.equal('password_hash' in body || 'password' in body, false);
    assert.equal(db.prepare('SELECT * FROM accounts').all().length, 1);

    const bad = await postJson(`${base}/accounts`, {
      handle: '',
      password: 'x',
    });
    assert.equal(bad.status, 400);
    assert.equal(
      ((await bad.json()) as { code: string }).code,
      'invalid_request',
    );
    const notObject = await postJson(`${base}/accounts`, [1]);
    assert.equal(notObject.status, 400);
    assert.equal(db.prepare('SELECT * FROM accounts').all().length, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /accounts is not found when the server has no database', async () => {
  await withServer(async (base) => {
    const res = await postJson(`${base}/accounts`, {});
    assert.equal(res.status, 404);
  });
});
