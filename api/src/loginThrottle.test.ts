import assert from 'node:assert/strict';
import test from 'node:test';
import { createLoginThrottle } from './loginThrottle.ts';

test('blocks a key after the limit of failures and frees it after the window', () => {
  let time = 0;
  const throttle = createLoginThrottle({
    limit: 3,
    windowMs: 1000,
    now: () => time,
  });
  for (let i = 0; i < 2; i += 1) throttle.recordFailure(['sam']);
  assert.equal(throttle.isBlocked(['sam']), false);
  throttle.recordFailure(['sam']);
  assert.equal(throttle.isBlocked(['sam']), true);
  assert.equal(throttle.isBlocked(['alex']), false);
  time = 1000;
  assert.equal(throttle.isBlocked(['sam']), false);
});

test('a block on any one key blocks the attempt, and clear frees a key', () => {
  const throttle = createLoginThrottle({ limit: 1 });
  throttle.recordFailure(['ip:1', 'sam']);
  assert.equal(throttle.isBlocked(['ip:1', 'other']), true);
  throttle.clear('ip:1');
  assert.equal(throttle.isBlocked(['ip:1', 'other']), false);
  assert.equal(throttle.isBlocked(['sam']), true);
});
