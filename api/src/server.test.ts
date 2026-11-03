import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { createApiServer } from './server.ts';
import { apiVersion } from './version.ts';

async function withServer(run: (base: string) => Promise<void>): Promise<void> {
  const server = createApiServer();
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
