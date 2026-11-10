import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import {
  checkSpaceName,
  createSpace,
  leaveSpace,
  listSpaces,
} from './spaces.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';

after(closeTestDbs);

test('a space name is trimmed and must be 1 to 80 characters', () => {
  assert.equal(checkSpaceName('  Demo space '), 'Demo space');
  assert.equal(checkSpaceName('   '), undefined);
  assert.equal(checkSpaceName('x'.repeat(81)), undefined);
  assert.equal(checkSpaceName(42), undefined);
});

test('the creator becomes the owner of the new space', () => {
  const db = createTestDb();
  db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  ).run('a1', 'Demo One', 'h', 'now', 'now', 'one');
  const space = createSpace(db, 'a1', 'Demo space');
  assert.equal(space.role, 'owner');
  const member = db
    .prepare(
      'SELECT role FROM memberships WHERE space_id = ? AND account_id = ?',
    )
    .get(space.id, 'a1');
  assert.equal(member?.role, 'owner');
  assert.equal(
    db.prepare('SELECT created_by FROM spaces WHERE id = ?').get(space.id)
      ?.created_by,
    'a1',
  );
});

test('listing returns only the spaces the account belongs to', () => {
  const db = createTestDb();
  const add = db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  );
  add.run('a1', 'Demo One', 'h', 'now', 'now', 'one');
  add.run('a2', 'Demo Two', 'h', 'now', 'now', 'two');
  const mine = createSpace(db, 'a1', 'Mine');
  createSpace(db, 'a2', 'Theirs');
  const joined = createSpace(db, 'a2', 'Joined');
  db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
    joined.id,
    'a1',
    'member',
    '9999',
  );
  const spaces = listSpaces(db, 'a1');
  assert.deepEqual(
    spaces.map((s) => [s.name, s.role]),
    [
      ['Mine', 'owner'],
      ['Joined', 'member'],
    ],
  );
  assert.equal(spaces[0]?.id, mine.id);
  assert.deepEqual(listSpaces(db, 'nobody'), []);
});

function twoAccounts() {
  const db = createTestDb();
  const add = db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  );
  add.run('a1', 'Demo One', 'h', 'now', 'now', 'one');
  add.run('a2', 'Demo Two', 'h', 'now', 'now', 'two');
  return db;
}

test('a member who leaves is no longer a member; the space stays', () => {
  const db = twoAccounts();
  const space = createSpace(db, 'a1', 'Demo space');
  db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
    space.id,
    'a2',
    'member',
    '2',
  );
  db.prepare(
    'INSERT INTO records (id, space_id, kind, body, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run('r1', space.id, 'demo', '{}', 'a2', 'now', 'now');
  assert.equal(leaveSpace(db, 'a2', space.id), 'left');
  assert.deepEqual(listSpaces(db, 'a2'), []);
  assert.equal(listSpaces(db, 'a1').length, 1);
  assert.equal(db.prepare('SELECT * FROM records').all().length, 1);
  assert.equal(leaveSpace(db, 'a2', space.id), 'not_found');
});

test('an owner who leaves hands the space over; the last one out closes it', () => {
  const db = twoAccounts();
  const space = createSpace(db, 'a1', 'Demo space');
  db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
    space.id,
    'a2',
    'member',
    '2',
  );
  assert.equal(leaveSpace(db, 'a1', space.id), 'left');
  assert.equal(listSpaces(db, 'a2')[0]?.role, 'owner');
  assert.equal(leaveSpace(db, 'a2', space.id), 'left');
  assert.equal(db.prepare('SELECT * FROM spaces').all().length, 0);
  assert.equal(leaveSpace(db, 'a1', 'missing'), 'not_found');
});
