import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import {
  checkAccountInput,
  changePassword,
  checkLogin,
  createAccount,
  HandleTakenError,
} from './accounts.ts';
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

test('a second account with the same handle is refused and stores nothing', async () => {
  const db = createTestDb();
  const details = {
    handle: 'sam',
    password: 'a long enough secret',
    displayName: 'Sam',
  };
  await createAccount(db, details);
  await assert.rejects(createAccount(db, details), HandleTakenError);
  assert.equal(db.prepare('SELECT * FROM accounts').all().length, 1);
});

test('checkLogin accepts the right password in any handle case only', async () => {
  const db = createTestDb();
  const made = await createAccount(db, {
    handle: 'sam',
    password: 'a long enough secret',
    displayName: 'Sam',
  });
  assert.equal(await checkLogin(db, ' SAM ', 'a long enough secret'), made.id);
  assert.equal(await checkLogin(db, 'sam', 'the wrong secret!'), undefined);
  assert.equal(
    await checkLogin(db, 'nobody', 'a long enough secret'),
    undefined,
  );
});

test('changePassword needs the old password and changes nothing otherwise', async () => {
  const db = createTestDb();
  const made = await createAccount(db, {
    handle: 'sam',
    password: 'a long enough secret',
    displayName: 'Sam',
  });
  assert.equal(
    await changePassword(db, made.id, 'not the old one', 'a brand new secret'),
    'wrong_password',
  );
  assert.equal(
    await changePassword(db, made.id, undefined, 'a brand new secret'),
    'wrong_password',
  );
  assert.equal(
    await changePassword(db, made.id, 'a long enough secret', 'short'),
    'invalid_new',
  );
  assert.equal(await checkLogin(db, 'sam', 'a long enough secret'), made.id);
  assert.equal(
    await changePassword(
      db,
      made.id,
      'a long enough secret',
      'a brand new secret',
    ),
    'changed',
  );
  assert.equal(await checkLogin(db, 'sam', 'a long enough secret'), undefined);
  assert.equal(await checkLogin(db, 'sam', 'a brand new secret'), made.id);
});
