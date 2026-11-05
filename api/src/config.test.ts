import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from './config.ts';

const secret = 'x'.repeat(32);

test('a valid environment gives a config with the default port', () => {
  assert.deepEqual(loadConfig({ LOVE_SESSION_SECRET: secret }), {
    sessionSecret: secret,
    port: 8787,
  });
});

test('a missing secret names the variable in the error', () => {
  assert.throws(() => loadConfig({}), /LOVE_SESSION_SECRET is missing/);
});

test('a short secret is rejected', () => {
  assert.throws(
    () => loadConfig({ LOVE_SESSION_SECRET: 'short' }),
    /too short/,
  );
});

test('a bad port is rejected and all problems are listed together', () => {
  assert.throws(
    () => loadConfig({ LOVE_PORT: 'abc' }),
    (error: Error) =>
      /LOVE_SESSION_SECRET is missing/.test(error.message) &&
      /LOVE_PORT must be/.test(error.message),
  );
  assert.equal(
    loadConfig({ LOVE_SESSION_SECRET: secret, LOVE_PORT: '9000' }).port,
    9000,
  );
});
