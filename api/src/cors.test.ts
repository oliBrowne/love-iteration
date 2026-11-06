import assert from 'node:assert/strict';
import { test } from 'node:test';
import { corsHeaders, parseOrigins } from './cors.ts';

const allowed = ['https://love.example'];

test('a listed origin gets a grant for exactly that origin', () => {
  const headers = corsHeaders('https://love.example', allowed);
  assert.equal(headers['access-control-allow-origin'], 'https://love.example');
});

test('an unlisted or missing origin gets no CORS headers', () => {
  assert.deepEqual(corsHeaders('https://evil.example', allowed), {});
  assert.deepEqual(corsHeaders(undefined, allowed), {});
  assert.deepEqual(corsHeaders('https://love.example', []), {});
});

test('parseOrigins trims and drops blanks', () => {
  assert.deepEqual(parseOrigins(' https://a.example , ,https://b.example'), [
    'https://a.example',
    'https://b.example',
  ]);
  assert.deepEqual(parseOrigins(undefined), []);
});
