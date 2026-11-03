import assert from 'node:assert/strict';
import { test } from 'node:test';
import { apiErrors, errorBody } from './errors.ts';
import type { ApiErrorCode } from './errors.ts';

test('every known error has a code and a message', () => {
  for (const code of Object.keys(apiErrors) as ApiErrorCode[]) {
    const body = errorBody(code);
    assert.equal(body.code, code);
    assert.ok(body.message.length > 0);
  }
});
