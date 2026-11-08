import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMemorySessionStore, sessionLifetimeMs } from './sessions.ts';

test('a created session finds its account; unknown tokens find nothing', () => {
  const store = createMemorySessionStore();
  const token = store.create('acct-1');
  assert.equal(store.find(token), 'acct-1');
  assert.equal(store.find('not-a-token'), undefined);
});

test('each session gets a different token', () => {
  const store = createMemorySessionStore();
  assert.notEqual(store.create('a'), store.create('a'));
});

test('a session expires after its lifetime', () => {
  let time = 1000;
  const store = createMemorySessionStore(() => time);
  const token = store.create('acct-1');
  time += sessionLifetimeMs - 1;
  assert.equal(store.find(token), 'acct-1');
  time += 1;
  assert.equal(store.find(token), undefined);
});
