import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openApiDocument } from './openapi.ts';
import { apiVersion } from './version.ts';

test('the health route appears in the schema', () => {
  assert.equal(openApiDocument.openapi, '3.0.3');
  assert.equal(openApiDocument.info.version, apiVersion);
  assert.ok(openApiDocument.paths['/health'].get.responses['200']);
});
