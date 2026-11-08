import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateHandle } from './handle.ts';

test('a normal handle is accepted and normalised', () => {
  assert.deepEqual(validateHandle('  Sam_01 '), { ok: true, handle: 'sam_01' });
});

test('an empty or blank handle is rejected', () => {
  assert.equal(validateHandle('').ok, false);
  assert.equal(validateHandle('   ').ok, false);
});

test('too short or too long handles are rejected', () => {
  assert.equal(validateHandle('ab').ok, false);
  assert.equal(validateHandle('a'.repeat(33)).ok, false);
  assert.equal(validateHandle('a'.repeat(32)).ok, true);
});

test('disallowed characters and starts are rejected', () => {
  for (const bad of ['has space', 'dot.name', 'a@b', '1abc', '-abc', 'émile']) {
    assert.equal(validateHandle(bad).ok, false, bad);
  }
});

test('reserved handles are rejected in any letter case', () => {
  assert.equal(validateHandle('Admin').ok, false);
  assert.equal(validateHandle('support').ok, false);
});
