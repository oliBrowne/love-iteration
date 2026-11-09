import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from './config.ts';

const secret = 'x'.repeat(32);

test('a valid environment gives a config with the default port', () => {
  assert.deepEqual(loadConfig({ LOVE_SESSION_SECRET: secret }), {
    sessionSecret: secret,
    port: 8787,
    host: '127.0.0.1',
    databasePath: 'love.db',
    allowedOrigins: [],
    secureCookies: false,
  });
});

test('cookies are Secure only when NODE_ENV is production', () => {
  const env = { LOVE_SESSION_SECRET: secret };
  assert.equal(
    loadConfig({ ...env, NODE_ENV: 'production' }).secureCookies,
    true,
  );
  assert.equal(
    loadConfig({ ...env, NODE_ENV: 'development' }).secureCookies,
    false,
  );
});

test('the host defaults to localhost and can be set on purpose', () => {
  assert.equal(loadConfig({ LOVE_SESSION_SECRET: secret }).host, '127.0.0.1');
  assert.equal(
    loadConfig({ LOVE_SESSION_SECRET: secret, LOVE_HOST: '0.0.0.0' }).host,
    '0.0.0.0',
  );
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

test('allowed origins come from a comma-separated list', () => {
  const config = loadConfig({
    LOVE_SESSION_SECRET: secret,
    LOVE_ALLOWED_ORIGINS: 'https://a.example, https://b.example',
  });
  assert.deepEqual(config.allowedOrigins, [
    'https://a.example',
    'https://b.example',
  ]);
});

test('the database path defaults to love.db and can be set', () => {
  assert.equal(
    loadConfig({ LOVE_SESSION_SECRET: secret }).databasePath,
    'love.db',
  );
  assert.equal(
    loadConfig({ LOVE_SESSION_SECRET: secret, LOVE_DB_PATH: '/data/love.db' })
      .databasePath,
    '/data/love.db',
  );
});
