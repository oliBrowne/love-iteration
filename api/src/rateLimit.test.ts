import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRateLimiter } from './rateLimit.ts';

test('requests over the limit are refused until the window ends', () => {
  let time = 0;
  const allow = createRateLimiter({
    limit: 2,
    windowMs: 1000,
    now: () => time,
  });
  assert.equal(allow('a'), true);
  assert.equal(allow('a'), true);
  assert.equal(allow('a'), false);
  assert.equal(allow('b'), true);
  time = 1000;
  assert.equal(allow('a'), true);
});
