import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { loadConfig } from './config.ts';
import { createApiServer, startServer } from './server.ts';
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
