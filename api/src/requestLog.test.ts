import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { createApiServer } from './server.ts';
import { formatLogLine } from './requestLog.ts';

test('log lines drop the query string', () => {
  const line = formatLogLine({
    requestId: 'abc',
    method: 'GET',
    url: '/health?note=hello',
    status: 200,
    ms: 3,
  });
  assert.equal(line, 'abc GET /health 200 3ms');
});

test('journal text in a query or body never reaches the logs', async () => {
  const lines: string[] = [];
  const server = createApiServer((line) => lines.push(line));
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const url = `http://127.0.0.1:${port}/health?entry=PRIVATE-WORDS`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ text: 'PRIVATE-WORDS' }),
    });
    await res.text();
    await new Promise((resolve) => setTimeout(resolve, 20));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
  assert.equal(lines.length, 1);
  assert.ok(!lines.join('\n').includes('PRIVATE-WORDS'));
  assert.match(lines[0], /POST \/health 404/);
});
