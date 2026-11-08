import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hashPassword, verifyPassword } from './password.ts';

test('a password verifies against its own hash', async () => {
  const stored = await hashPassword('correct horse battery');
  assert.equal(await verifyPassword('correct horse battery', stored), true);
});

test('a wrong password does not verify', async () => {
  const stored = await hashPassword('correct horse battery');
  assert.equal(await verifyPassword('wrong horse battery', stored), false);
  assert.equal(await verifyPassword('', stored), false);
});

test('the same password hashes differently each time', async () => {
  const a = await hashPassword('same secret');
  const b = await hashPassword('same secret');
  assert.notEqual(a, b);
  assert.equal(await verifyPassword('same secret', b), true);
});

test('the stored text does not contain the password', async () => {
  const stored = await hashPassword('plain-text-check');
  assert.equal(stored.includes('plain-text-check'), false);
});

test('a malformed stored value never verifies', async () => {
  for (const bad of ['', 'nonsense', 'scrypt$1$2', 'bcrypt$1$1$1$a$b']) {
    assert.equal(await verifyPassword('x', bad), false, bad);
  }
  assert.equal(await verifyPassword('x', 'scrypt$0$8$1$AAAA$AAAA'), false);
});
