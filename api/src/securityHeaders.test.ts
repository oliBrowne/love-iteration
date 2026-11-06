import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { securityHeaders } from './securityHeaders.ts';

test('every header is documented in the API README', () => {
  const readme = readFileSync(
    new URL('../README.md', import.meta.url),
    'utf-8',
  );
  for (const name of Object.keys(securityHeaders)) {
    assert.ok(readme.includes(`\`${name}\``), `${name} missing from README`);
  }
});
