import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import {
  checkSpaceName,
  createSpace,
  deleteSpaceRecord,
  leaveSpace,
  listSpaceChanges,
  listSpaceRecords,
  putSpaceRecord,
  removeMember,
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

test('an owner can remove another member; others cannot', () => {
  const db = twoAccounts();
  const space = createSpace(db, 'a1', 'Demo space');
  db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
    space.id,
    'a2',
    'member',
    '2',
  );
  assert.equal(removeMember(db, 'a2', space.id, 'a1'), 'not_found');
  assert.equal(removeMember(db, 'a1', space.id, 'a1'), 'self');
  assert.equal(removeMember(db, 'a1', space.id, 'zz'), 'not_found');
  assert.equal(removeMember(db, 'a1', space.id, 'a2'), 'removed');
  assert.deepEqual(listSpaces(db, 'a2'), []);
  assert.equal(listSpaces(db, 'a1').length, 1);
  assert.equal(removeMember(db, 'a1', space.id, 'a2'), 'not_found');
});

test('a member only reads records of spaces they belong to', () => {
  const db = twoAccounts();
  const shared = createSpace(db, 'a1', 'Shared demo');
  const solo = createSpace(db, 'a1', 'Private demo');
  db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
    shared.id,
    'a2',
    'member',
    '2',
  );
  const add = db.prepare(
    'INSERT INTO records (id, space_id, kind, body, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  add.run('r1', shared.id, 'demo', '{"note":"shared"}', 'a1', 'now', 'now');
  add.run('r2', solo.id, 'demo', '{"note":"private"}', 'a1', 'now', 'now');
  assert.deepEqual(
    listSpaceRecords(db, 'a2', shared.id)?.map((r) => r.id),
    ['r1'],
  );
  assert.equal(listSpaceRecords(db, 'a2', solo.id), null);
  assert.equal(listSpaceRecords(db, 'a2', 'missing'), null);
});

test('an owner write increments the record revision', () => {
  const db = createTestDb();
  const add = (id: string, handle: string) =>
    db
      .prepare(
        'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .run(id, 'Demo', 'h', 'now', 'now', handle);
  add('a1', 'one');
  add('a2', 'two');
  const space = createSpace(db, 'a1', 'Demo space');
  const other = createSpace(db, 'a2', 'Other demo');
  const first = putSpaceRecord(db, 'a1', space.id, 'r1', 'demo', '{"a":1}');
  const second = putSpaceRecord(db, 'a1', space.id, 'r1', 'demo', '{"a":2}');
  assert.equal(first?.revision, 1);
  assert.equal(second?.revision, 2);
  assert.equal(listSpaceRecords(db, 'a1', space.id)?.[0]?.body, '{"a":2}');
  // Non-members and other spaces' ids are refused.
  assert.equal(putSpaceRecord(db, 'a2', space.id, 'r1', 'demo', 'x'), null);
  assert.equal(putSpaceRecord(db, 'a2', other.id, 'r1', 'demo', 'x'), null);
});

test('deleting a record removes it and writes a tombstone', () => {
  const db = createTestDb();
  const add = (id: string, handle: string) =>
    db
      .prepare(
        'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .run(id, 'Demo', 'h', 'now', 'now', handle);
  add('a1', 'one');
  add('a2', 'two');
  const space = createSpace(db, 'a1', 'Demo space');
  putSpaceRecord(db, 'a1', space.id, 'r1', 'demo', 'x');
  // A non-member cannot delete it.
  assert.equal(deleteSpaceRecord(db, 'a2', space.id, 'r1'), null);
  const gone = deleteSpaceRecord(db, 'a1', space.id, 'r1');
  assert.equal(gone?.revision, 2);
  assert.deepEqual(listSpaceRecords(db, 'a1', space.id), []);
  const row = db.prepare('SELECT * FROM tombstones').all();
  assert.equal(row.length, 1);
  assert.equal(row[0]?.record_id, 'r1');
  assert.equal(row[0]?.revision, 2);
  assert.equal(deleteSpaceRecord(db, 'a1', space.id, 'r1'), null);
});

test('changes after a cursor include writes and deletions only', async () => {
  const db = createTestDb();
  db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  ).run('a1', 'Demo', 'h', 'now', 'now', 'one');
  const space = createSpace(db, 'a1', 'Demo space');
  putSpaceRecord(db, 'a1', space.id, 'r1', 'demo', 'x');
  const first = listSpaceChanges(db, 'a1', space.id, '');
  assert.equal(first?.records.length, 1);
  const cursor = first?.cursor ?? '';
  // Nothing new: empty, and the cursor stays put.
  const quiet = listSpaceChanges(db, 'a1', space.id, cursor);
  assert.deepEqual(quiet, { records: [], deleted: [], cursor, more: false });
  await new Promise((resolve) => setTimeout(resolve, 5));
  putSpaceRecord(db, 'a1', space.id, 'r2', 'demo', 'y');
  deleteSpaceRecord(db, 'a1', space.id, 'r1');
  const next = listSpaceChanges(db, 'a1', space.id, cursor);
  assert.deepEqual(
    next?.records.map((r) => r.id),
    ['r2'],
  );
  assert.deepEqual(
    next?.deleted.map((d) => d.id),
    ['r1'],
  );
  assert.ok((next?.cursor ?? '') > cursor);
  assert.equal(listSpaceChanges(db, 'nobody', space.id, ''), null);
});

test('a large change set pages without omissions or repeats', () => {
  const db = createTestDb();
  db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  ).run('a1', 'Demo', 'h', 'now', 'now', 'one');
  const space = createSpace(db, 'a1', 'Demo space');
  // Many records with the very same timestamp, plus one deletion.
  for (let i = 0; i < 25; i++) {
    putSpaceRecord(
      db,
      'a1',
      space.id,
      `r${String(i).padStart(2, '0')}`,
      'demo',
      'x',
    );
  }
  db.prepare('UPDATE records SET updated_at = ?').run(
    '2026-01-01T00:00:00.000Z',
  );
  deleteSpaceRecord(db, 'a1', space.id, 'r00');
  const seen: string[] = [];
  let cursor = '';
  let pages = 0;
  for (;;) {
    const page = listSpaceChanges(db, 'a1', space.id, cursor, 10);
    assert.ok(page);
    pages += 1;
    seen.push(
      ...page.records.map((r) => r.id),
      ...page.deleted.map((d) => `gone:${d.id}`),
    );
    cursor = page.cursor;
    if (!page.more) break;
  }
  assert.equal(pages, 3);
  assert.equal(seen.length, 25);
  assert.equal(new Set(seen).size, 25);
  assert.ok(seen.includes('gone:r00'));
  assert.ok(!seen.includes('r00'));
});
