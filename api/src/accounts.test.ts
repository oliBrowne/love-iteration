import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { checkAccountInput, createAccount } from './accounts.ts';
import { verifyPassword } from './password.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';

after(closeTestDbs);

const good = { handle: ' Sam ', password: 'a long enough secret' };

test('a valid request is accepted; the display name defaults to the handle', () => {
  assert.deepEqual(checkAccountInput(good), {
    ok: true,
    handle: 'sam',
    password: 'a long enough secret',
    displayName: 'sam',
  });
});

test('bad handles, short passwords and bad display names are rejected', () => {
  assert.equal(checkAccountInput({ ...good, handle: '' }).ok, false);
  assert.equal(checkAccountInput({ ...good, handle: 5 }).ok, false);
  assert.equal(checkAccountInput({ ...good, password: 'short' }).ok, false);
  assert.equal(checkAccountInput({ ...good, password: 12345678901 }).ok, false);
  assert.equal(checkAccountInput({ ...good, displayName: '  ' }).ok, false);
  assert.equal(
    checkAccountInput({ ...good, displayName: 'x'.repeat(61) }).ok,
    false,
  );
});

test('createAccount stores one account with a hash, not the password', async () => {
  const db = createTestDb();
  const made = await createAccount(db, {
    handle: 'sam',
    password: 'a long enough secret',
    displayName: 'Sam',
  });
  const rows = db.prepare('SELECT * FROM accounts').all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.handle, 'sam');
  assert.equal(rows[0]?.id, made.id);
  const hash = String(rows[0]?.password_hash);
  assert.notEqual(hash, 'a long enough secret');
  assert.equal(await verifyPassword('a long enough secret', hash), true);
});
