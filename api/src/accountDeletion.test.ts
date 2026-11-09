import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { deleteAccount, deleteConfirmation } from './accountDeletion.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';
import { hashPassword } from './password.ts';

after(closeTestDbs);

async function setup() {
  const db = createTestDb();
  const hash = await hashPassword('a long enough secret');
  const addAccount = db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  );
  addAccount.run('a1', 'Demo One', hash, 'now', 'now', 'one');
  addAccount.run('a2', 'Demo Two', hash, 'now', 'now', 'two');
  const addSpace = db.prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)');
  addSpace.run('solo', 'Solo demo', 'a1', 'now', 'now');
  addSpace.run('shared', 'Shared demo', 'a1', 'now', 'now');
  const addMember = db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)');
  addMember.run('solo', 'a1', 'owner', '1');
  addMember.run('shared', 'a1', 'owner', '1');
  addMember.run('shared', 'a2', 'member', '2');
  const addRecord = db.prepare(
    'INSERT INTO records (id, space_id, kind, body, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  addRecord.run('r1', 'solo', 'demo', '{}', 'a1', 'now', 'now');
  addRecord.run('r2', 'shared', 'demo', '{}', 'a1', 'now', 'now');
  addRecord.run('r3', 'shared', 'demo', '{}', 'a2', 'now', 'now');
  db.prepare('INSERT INTO tombstones VALUES (?, ?, ?, ?, ?)').run(
    'gone',
    'shared',
    2,
    'a1',
    'now',
  );
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(
    'h1',
    'a1',
    'now',
    'later',
  );
  return db;
}

const count = (db: ReturnType<typeof createTestDb>, sql: string) =>
  db.prepare(sql).all().length;

test('nothing is deleted without the password and the confirmation phrase', async () => {
  const db = await setup();
  assert.equal(
    await deleteAccount(db, 'a1', 'wrong password!', deleteConfirmation),
    'wrong_password',
  );
  assert.equal(
    await deleteAccount(db, 'a1', 'a long enough secret', 'yes'),
    'not_confirmed',
  );
  assert.equal(count(db, 'SELECT * FROM accounts'), 2);
  assert.equal(count(db, 'SELECT * FROM records'), 3);
});

test('deleting removes the account, its sessions and records, and solo spaces', async () => {
  const db = await setup();
  assert.equal(
    await deleteAccount(db, 'a1', 'a long enough secret', deleteConfirmation),
    'deleted',
  );
  assert.equal(count(db, "SELECT * FROM accounts WHERE id = 'a1'"), 0);
  assert.equal(count(db, 'SELECT * FROM sessions'), 0);
  assert.equal(count(db, "SELECT * FROM spaces WHERE id = 'solo'"), 0);
  assert.equal(count(db, "SELECT * FROM records WHERE space_id = 'solo'"), 0);
  assert.equal(count(db, "SELECT * FROM records WHERE created_by = 'a1'"), 0);
});

test('a shared space stays for the other member, who becomes its owner', async () => {
  const db = await setup();
  await deleteAccount(db, 'a1', 'a long enough secret', deleteConfirmation);
  assert.equal(count(db, "SELECT * FROM accounts WHERE id = 'a2'"), 1);
  assert.equal(
    db.prepare("SELECT created_by FROM spaces WHERE id = 'shared'").get()
      ?.created_by,
    'a2',
  );
  assert.deepEqual(
    db
      .prepare("SELECT role FROM memberships WHERE space_id = 'shared'")
      .all()
      .map((row) => row.role),
    ['owner'],
  );
  // The other person's record stays; the deleter's record goes.
  assert.deepEqual(
    db
      .prepare("SELECT id FROM records WHERE space_id = 'shared'")
      .all()
      .map((row) => row.id),
    ['r3'],
  );
  // The deletion marker survives so the other person's devices still learn of it.
  assert.equal(
    db
      .prepare("SELECT deleted_by FROM tombstones WHERE record_id = 'gone'")
      .get()?.deleted_by,
    'a2',
  );
});
