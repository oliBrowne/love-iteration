import assert from 'node:assert/strict';
import test from 'node:test';
import { sessionCookie } from './cookie.ts';

test('production cookie is HttpOnly and Secure', () => {
  const cookie = sessionCookie('abc', true);
  assert.match(cookie, /^love_session=abc; /);
  assert.match(cookie, /; HttpOnly/);
  assert.match(cookie, /; Secure/);
  assert.match(cookie, /; SameSite=Lax/);
  assert.match(cookie, /; Max-Age=604800/);
});

test('development cookie is HttpOnly but not Secure, so http://localhost works', () => {
  const cookie = sessionCookie('abc', false);
  assert.match(cookie, /; HttpOnly/);
  assert.doesNotMatch(cookie, /Secure/);
});
