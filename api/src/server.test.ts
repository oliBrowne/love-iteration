import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { after } from 'node:test';
import { loadConfig } from './config.ts';
import { createRateLimiter } from './rateLimit.ts';
import { createApiServer, startServer } from './server.ts';
import { createLoginThrottle } from './loginThrottle.ts';
import { createMemorySessionStore } from './sessions.ts';
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
    const again = await postJson(`${base}/accounts`, {
      handle: 'SAM',
      password: 'another long secret',
    });
    assert.equal(again.status, 409);
    assert.equal(((await again.json()) as { code: string }).code, 'conflict');
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

test('POST /login starts a session for valid credentials only', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const made = await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const { id } = (await made.json()) as { id: string };

    const ok = await postJson(`${base}/login`, {
      handle: 'Sam',
      password: 'a long enough secret',
    });
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { ok: true });
    const cookie = ok.headers.get('set-cookie') ?? '';
    assert.match(cookie, /HttpOnly/);
    const token = /^love_session=([^;]+)/.exec(cookie)?.[1] ?? '';
    assert.equal(sessions.find(token), id);

    const wrong = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'not the secret!',
    });
    assert.equal(wrong.status, 401);
    const missing = await postJson(`${base}/login`, { handle: 5 });
    assert.equal(missing.status, 401);

    // An unknown handle answers exactly like a wrong password.
    const unknown = await postJson(`${base}/login`, {
      handle: 'nobody',
      password: 'not the secret!',
    });
    assert.equal(unknown.status, wrong.status);
    assert.deepEqual(await unknown.json(), await wrong.json());
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /login blocks a handle after repeated failures, even a right password', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const throttle = createLoginThrottle({ limit: 3 });
  const server = createApiServer(
    undefined,
    [],
    undefined,
    db,
    sessions,
    throttle,
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    for (let i = 0; i < 3; i += 1) {
      const bad = await postJson(`${base}/login`, {
        handle: 'sam',
        password: 'not the secret!',
      });
      assert.equal(bad.status, 401);
    }
    const blocked = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get('retry-after'), '900');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /login sets a Secure cookie when secure cookies are on', async () => {
  const db = createTestDb();
  const server = createApiServer(
    undefined,
    [],
    undefined,
    db,
    createMemorySessionStore(),
    undefined,
    true,
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const res = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const cookie = res.headers.get('set-cookie') ?? '';
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /logout revokes the session so its token stops working', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const made = await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const { id } = (await made.json()) as { id: string };
    const login = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const token =
      /^love_session=([^;]+)/.exec(
        login.headers.get('set-cookie') ?? '',
      )?.[1] ?? '';
    assert.equal(sessions.find(token), id);

    const out = await fetch(`${base}/logout`, {
      method: 'POST',
      headers: { cookie: `love_session=${token}` },
    });
    assert.equal(out.status, 200);
    assert.match(out.headers.get('set-cookie') ?? '', /Max-Age=0/);
    assert.equal(sessions.find(token), undefined);

    // Logging out again, or with no cookie, is harmless.
    const again = await fetch(`${base}/logout`, { method: 'POST' });
    assert.equal(again.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /me returns the account ID for a live session only', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const made = await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const { id } = (await made.json()) as { id: string };
    const login = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0] ?? '';

    const me = await fetch(`${base}/me`, { headers: { cookie } });
    assert.equal(me.status, 200);
    assert.deepEqual(await me.json(), { accountId: id });

    assert.equal((await fetch(`${base}/me`)).status, 401);
    const forged = await fetch(`${base}/me`, {
      headers: { cookie: 'love_session=forged' },
    });
    assert.equal(forged.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('writes to protected routes need a live session', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const res = await fetch(`${base}/spaces`, { method });
      assert.equal(res.status, 401, method);
    }
    // Reading an unknown route is still a plain 404.
    assert.equal((await fetch(`${base}/not-a-route`)).status, 404);

    await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const login = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
    // Logged in, the same write passes the guard and finds no such route yet.
    const res = await fetch(`${base}/not-a-route`, {
      method: 'POST',
      headers: { cookie },
    });
    assert.equal(res.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /password requires login and the old password', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const body = {
      oldPassword: 'a long enough secret',
      newPassword: 'a brand new secret',
    };
    assert.equal((await postJson(`${base}/password`, body)).status, 401);

    const login = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
    const send = (value: unknown) =>
      fetch(`${base}/password`, {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify(value),
      });

    assert.equal(
      (await send({ ...body, oldPassword: 'wrong one!!' })).status,
      400,
    );
    assert.equal(
      (await send({ newPassword: 'a brand new secret' })).status,
      400,
    );
    assert.equal((await send({ ...body, newPassword: 'short' })).status, 400);
    const changed = await send(body);
    assert.equal(changed.status, 200);

    // The old session stops working; the cookie sent back keeps this device in.
    assert.equal(
      (await fetch(`${base}/me`, { headers: { cookie } })).status,
      401,
    );
    const renewed =
      (changed.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
    assert.equal(
      (await fetch(`${base}/me`, { headers: { cookie: renewed } })).status,
      200,
    );

    const old = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    assert.equal(old.status, 401);
    const fresh = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a brand new secret',
    });
    assert.equal(fresh.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('DELETE /account needs login, the password and the confirmation phrase', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const login = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
    const send = (value: unknown, withCookie = true) =>
      fetch(`${base}/account`, {
        method: 'DELETE',
        headers: {
          ...(withCookie ? { cookie } : {}),
          'content-type': 'application/json',
        },
        body: JSON.stringify(value),
      });
    const good = {
      password: 'a long enough secret',
      confirm: 'delete my account',
    };

    assert.equal((await send(good, false)).status, 401);
    assert.equal(
      (await send({ ...good, password: 'wrong one!!' })).status,
      400,
    );
    assert.equal((await send({ ...good, confirm: 'yes' })).status, 400);
    assert.equal(db.prepare('SELECT * FROM accounts').all().length, 1);

    const done = await send(good);
    assert.equal(done.status, 200);
    assert.match(done.headers.get('set-cookie') ?? '', /Max-Age=0/);
    assert.equal(db.prepare('SELECT * FROM accounts').all().length, 0);
    assert.equal(
      (await fetch(`${base}/me`, { headers: { cookie } })).status,
      401,
    );
    const again = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    assert.equal(again.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /spaces makes the logged-in caller the owner', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    await postJson(`${base}/accounts`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const login = await postJson(`${base}/login`, {
      handle: 'sam',
      password: 'a long enough secret',
    });
    const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
    const send = (value: unknown, withCookie = true) =>
      fetch(`${base}/spaces`, {
        method: 'POST',
        headers: {
          ...(withCookie ? { cookie } : {}),
          'content-type': 'application/json',
        },
        body: JSON.stringify(value),
      });

    assert.equal((await send({ name: 'Demo space' }, false)).status, 401);
    assert.equal((await send({ name: '  ' })).status, 400);
    const made = await send({ name: 'Demo space' });
    assert.equal(made.status, 201);
    const space = (await made.json()) as { id: string; role: string };
    assert.equal(space.role, 'owner');
    const row = db
      .prepare('SELECT role FROM memberships WHERE space_id = ?')
      .get(space.id);
    assert.equal(row?.role, 'owner');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /spaces lists only my memberships', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const cookies: string[] = [];
    for (const handle of ['sam', 'alex']) {
      await postJson(`${base}/accounts`, {
        handle,
        password: 'a long enough secret',
      });
      const login = await postJson(`${base}/login`, {
        handle,
        password: 'a long enough secret',
      });
      cookies.push((login.headers.get('set-cookie') ?? '').split(';')[0] ?? '');
    }
    const make = (cookie: string, name: string) =>
      fetch(`${base}/spaces`, {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    await make(cookies[0] as string, 'Sam demo');
    await make(cookies[1] as string, 'Alex demo');

    assert.equal((await fetch(`${base}/spaces`)).status, 401);
    const res = await fetch(`${base}/spaces`, {
      headers: { cookie: cookies[0] as string },
    });
    assert.equal(res.status, 200);
    const body = (await res.json()) as { spaces: { name: string }[] };
    assert.deepEqual(
      body.spaces.map((s) => s.name),
      ['Sam demo'],
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /spaces/:id/invites gives the owner a link, others a 404', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const cookies: string[] = [];
    for (const handle of ['sam', 'alex']) {
      await postJson(`${base}/accounts`, {
        handle,
        password: 'a long enough secret',
      });
      const login = await postJson(`${base}/login`, {
        handle,
        password: 'a long enough secret',
      });
      cookies.push((login.headers.get('set-cookie') ?? '').split(';')[0] ?? '');
    }
    const made = await fetch(`${base}/spaces`, {
      method: 'POST',
      headers: {
        cookie: cookies[0] as string,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: 'Sam demo' }),
    });
    const { id } = (await made.json()) as { id: string };
    const invite = (cookie?: string) =>
      fetch(`${base}/spaces/${id}/invites`, {
        method: 'POST',
        headers: cookie ? { cookie } : {},
      });

    assert.equal((await invite()).status, 401);
    assert.equal((await invite(cookies[1])).status, 404);
    const ok = await invite(cookies[0]);
    assert.equal(ok.status, 201);
    const body = (await ok.json()) as { link: string; expiresAt: string };
    assert.match(body.link, /^\/invite\/[A-Za-z0-9_-]{40,}$/);
    assert.ok(Date.parse(body.expiresAt) > Date.now());

    const short = await fetch(`${base}/spaces/${id}/invites?hours=1`, {
      method: 'POST',
      headers: { cookie: cookies[0] as string },
    });
    const soon = ((await short.json()) as { expiresAt: string }).expiresAt;
    assert.ok(Date.parse(soon) < Date.now() + 61 * 60 * 1000);
    const bad = await fetch(`${base}/spaces/${id}/invites?hours=0`, {
      method: 'POST',
      headers: { cookie: cookies[0] as string },
    });
    assert.equal(bad.status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /invites/accept adds the caller to the invited space', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const cookies: string[] = [];
    for (const handle of ['sam', 'alex']) {
      await postJson(`${base}/accounts`, {
        handle,
        password: 'a long enough secret',
      });
      const login = await postJson(`${base}/login`, {
        handle,
        password: 'a long enough secret',
      });
      cookies.push((login.headers.get('set-cookie') ?? '').split(';')[0] ?? '');
    }
    const send = (path: string, cookie: string, body?: unknown) =>
      fetch(`${base}${path}`, {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    const made = await send('/spaces', cookies[0] as string, {
      name: 'Sam demo',
    });
    const { id } = (await made.json()) as { id: string };
    const inv = await send(`/spaces/${id}/invites`, cookies[0] as string);
    const { link } = (await inv.json()) as { link: string };
    const token = link.replace('/invite/', '');

    const anon = await fetch(`${base}/invites/accept`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    assert.equal(anon.status, 401);
    assert.equal(
      (await send('/invites/accept', cookies[1] as string, {})).status,
      400,
    );
    assert.equal(
      (await send('/invites/accept', cookies[1] as string, { token: 'nope' }))
        .status,
      404,
    );
    const ok = await send('/invites/accept', cookies[1] as string, { token });
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { spaceId: id });
    // The link works once: a second try fails, even for the same person.
    assert.equal(
      (await send('/invites/accept', cookies[1] as string, { token })).status,
      409,
    );
    assert.equal(
      (await send('/invites/accept', cookies[0] as string, { token })).status,
      409,
    );

    const list = await fetch(`${base}/spaces`, {
      headers: { cookie: cookies[1] as string },
    });
    const body = (await list.json()) as {
      spaces: { id: string; role: string }[];
    };
    assert.deepEqual(
      body.spaces.map((s) => [s.id, s.role]),
      [[id, 'member']],
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('DELETE /spaces/:id/invites/:inviteId cancels an unused invite', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const cookies: string[] = [];
    for (const handle of ['sam', 'alex']) {
      await postJson(`${base}/accounts`, {
        handle,
        password: 'a long enough secret',
      });
      const login = await postJson(`${base}/login`, {
        handle,
        password: 'a long enough secret',
      });
      cookies.push((login.headers.get('set-cookie') ?? '').split(';')[0] ?? '');
    }
    const send = (
      method: string,
      path: string,
      cookie?: string,
      body?: unknown,
    ) =>
      fetch(`${base}${path}`, {
        method,
        headers: {
          ...(cookie ? { cookie } : {}),
          'content-type': 'application/json',
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    const made = await send('POST', '/spaces', cookies[0], {
      name: 'Sam demo',
    });
    const { id } = (await made.json()) as { id: string };
    const inv = await send('POST', `/spaces/${id}/invites`, cookies[0]);
    const invite = (await inv.json()) as { id: string; link: string };
    const token = invite.link.replace('/invite/', '');
    const path = `/spaces/${id}/invites/${invite.id}`;

    assert.equal((await send('DELETE', path)).status, 401);
    assert.equal((await send('DELETE', path, cookies[1])).status, 404);
    assert.equal((await send('DELETE', path, cookies[0])).status, 200);
    const tried = await send('POST', '/invites/accept', cookies[1], { token });
    assert.equal(tried.status, 400);
    const list = await send('GET', '/spaces', cookies[1]);
    assert.deepEqual(await list.json(), { spaces: [] });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('DELETE /spaces/:id/membership removes my membership', async () => {
  const db = createTestDb();
  const sessions = createMemorySessionStore();
  const server = createApiServer(undefined, [], undefined, db, sessions);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const base = `http://127.0.0.1:${port}`;
    const cookies: string[] = [];
    for (const handle of ['sam', 'alex']) {
      await postJson(`${base}/accounts`, {
        handle,
        password: 'a long enough secret',
      });
      const login = await postJson(`${base}/login`, {
        handle,
        password: 'a long enough secret',
      });
      cookies.push((login.headers.get('set-cookie') ?? '').split(';')[0] ?? '');
    }
    const send = (
      method: string,
      path: string,
      cookie?: string,
      body?: unknown,
    ) =>
      fetch(`${base}${path}`, {
        method,
        headers: {
          ...(cookie ? { cookie } : {}),
          'content-type': 'application/json',
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    const made = await send('POST', '/spaces', cookies[0], {
      name: 'Sam demo',
    });
    const { id } = (await made.json()) as { id: string };
    const inv = await send('POST', `/spaces/${id}/invites`, cookies[0]);
    const { link } = (await inv.json()) as { link: string };
    await send('POST', '/invites/accept', cookies[1], {
      token: link.replace('/invite/', ''),
    });
    const path = `/spaces/${id}/membership`;

    assert.equal((await send('DELETE', path)).status, 401);
    assert.equal((await send('DELETE', path, cookies[1])).status, 200);
    assert.equal((await send('DELETE', path, cookies[1])).status, 404);
    const mine = await send('GET', '/spaces', cookies[1]);
    assert.deepEqual(await mine.json(), { spaces: [] });
    const theirs = await send('GET', '/spaces', cookies[0]);
    assert.equal(
      ((await theirs.json()) as { spaces: unknown[] }).spaces.length,
      1,
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
