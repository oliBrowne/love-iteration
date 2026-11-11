import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, test } from 'node:test';
import { createApiServer } from './server.ts';
import { createMemorySessionStore } from './sessions.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';

after(closeTestDbs);

// The whole invitation story, driven over HTTP with cookies exactly as the
// browser would: invite, accept, cancel, and a refused late acceptance.
test('invitation, acceptance and revocation work end to end', async () => {
  const db = createTestDb();
  const server = createApiServer(
    undefined,
    [],
    undefined,
    db,
    createMemorySessionStore(),
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;
  try {
    const call = (method: string, path: string, cookie = '', body?: unknown) =>
      fetch(`${base}${path}`, {
        method,
        headers: { cookie, 'content-type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    const cookies: string[] = [];
    for (const handle of ['sam', 'alex', 'robin']) {
      const login = { handle, password: 'a long enough secret' };
      await call('POST', '/accounts', '', login);
      const res = await call('POST', '/login', '', login);
      cookies.push((res.headers.get('set-cookie') ?? '').split(';')[0] ?? '');
    }
    const [sam, alex, robin] = cookies as [string, string, string];

    const space = (await (
      await call('POST', '/spaces', sam, { name: 'Demo space' })
    ).json()) as { id: string };
    const invite = async () => {
      const res = await call('POST', `/spaces/${space.id}/invites`, sam);
      assert.equal(res.status, 201);
      return (await res.json()) as { id: string; link: string };
    };
    const tokenOf = (link: string) => ({ token: link.replace('/invite/', '') });

    // Invitation then acceptance: the second person joins.
    const first = await invite();
    const accepted = await call(
      'POST',
      '/invites/accept',
      alex,
      tokenOf(first.link),
    );
    assert.equal(accepted.status, 200);
    const alexSpaces = (await (await call('GET', '/spaces', alex)).json()) as {
      spaces: { id: string; role: string }[];
    };
    assert.deepEqual(
      alexSpaces.spaces.map((s) => [s.id, s.role]),
      [[space.id, 'member']],
    );

    // Revocation: a cancelled invitation can no longer be accepted.
    const second = await invite();
    const revoked = await call(
      'DELETE',
      `/spaces/${space.id}/invites/${second.id}`,
      sam,
    );
    assert.equal(revoked.status, 200);
    const late = await call(
      'POST',
      '/invites/accept',
      robin,
      tokenOf(second.link),
    );
    assert.equal(late.status, 400);
    const robinSpaces = (await (
      await call('GET', '/spaces', robin)
    ).json()) as {
      spaces: unknown[];
    };
    assert.equal(robinSpaces.spaces.length, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
