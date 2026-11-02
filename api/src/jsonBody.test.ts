import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { parseJsonBody, readJsonBody, rejectBadJson } from './jsonBody.ts';

test('valid JSON parses', () => {
  assert.deepEqual(parseJsonBody('{"a":1}'), { ok: true, value: { a: 1 } });
});

test('invalid JSON is a 400 that does not repeat the text', () => {
  const result = parseJsonBody('{"secret": oops');
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 400);
    assert.ok(!result.message.includes('secret'));
  }
});

test('an HTTP request with an invalid body gets 400, a valid one 200', async () => {
  const server = createServer(async (req, res) => {
    const body = await readJsonBody(req);
    if (rejectBadJson(res, body)) return;
    res.writeHead(200).end('ok');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  const url = `http://127.0.0.1:${port}/`;
  try {
    const bad = await fetch(url, { method: 'POST', body: '{nope' });
    assert.equal(bad.status, 400);
    const good = await fetch(url, { method: 'POST', body: '{"ok":true}' });
    assert.equal(good.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
