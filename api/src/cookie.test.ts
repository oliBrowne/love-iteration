import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearedSessionCookie,
  readSessionToken,
  sessionCookie,
} from './cookie.ts';

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

test('readSessionToken finds the session cookie among others', () => {
  assert.equal(readSessionToken('a=1; love_session=tok-en_9; b=2'), 'tok-en_9');
  assert.equal(readSessionToken('a=1'), undefined);
  assert.equal(readSessionToken(undefined), undefined);
  assert.equal(readSessionToken('love_session='), undefined);
});

test('the cleared cookie expires at once', () => {
  assert.match(
    clearedSessionCookie(true),
    /^love_session=; .*Max-Age=0.*Secure/,
  );
});
