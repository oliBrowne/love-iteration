import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { apiName, apiVersion } from './version.ts';

test('the reported name and version match package.json', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
  ) as { name: string; version: string };
  assert.equal(apiName, pkg.name);
  assert.equal(apiVersion, pkg.version);
});
