import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openDb } from './db.ts';
import type { Db } from './db.ts';
import { runMigrations } from './migrate.ts';
import { migrations } from './migrations.ts';

function freshDb(): Db {
  const db = openDb(':memory:');
  runMigrations(db, migrations);
  return db;
}

function columns(db: Db, table: string): string[] {
  return db
    .prepare(`PRAGMA table_info(${table})`)
    .all()
    .map((c) => String(c.name));
}

test('accounts table has the expected columns and unique email', () => {
  const db = freshDb();
  assert.deepEqual(columns(db, 'accounts'), [
    'id',
    'email',
    'display_name',
    'password_hash',
    'created_at',
    'updated_at',
  ]);
  const insert = db.prepare('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)');
  insert.run('a1', 'demo@example.test', 'Demo', 'hash', 'now', 'now');
  assert.throws(() =>
    insert.run('a2', 'demo@example.test', 'Other', 'hash', 'now', 'now'),
  );
  db.close();
});

test('spaces table has the expected columns and needs a real creator', () => {
  const db = freshDb();
  assert.deepEqual(columns(db, 'spaces'), [
    'id',
    'name',
    'created_by',
    'created_at',
    'updated_at',
  ]);
  assert.throws(() =>
    db
      .prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)')
      .run('s1', 'Demo space', 'missing', 'now', 'now'),
  );
  db.close();
});

test('memberships link accounts to spaces, once each, with a valid role', () => {
  const db = freshDb();
  assert.deepEqual(columns(db, 'memberships'), [
    'space_id',
    'account_id',
    'role',
    'joined_at',
  ]);
  db.prepare('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)').run(
    'a1',
    'demo@example.test',
    'Demo',
    'hash',
    'now',
    'now',
  );
  db.prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)').run(
    's1',
    'Demo space',
    'a1',
    'now',
    'now',
  );
  const add = db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)');
  add.run('s1', 'a1', 'owner', 'now');
  assert.throws(() => add.run('s1', 'a1', 'member', 'now'));
  assert.throws(() => add.run('s1', 'a1', 'admin', 'now'));
  db.prepare('DELETE FROM spaces WHERE id = ?').run('s1');
  assert.equal(db.prepare('SELECT * FROM memberships').all().length, 0);
  db.close();
});

test('invites store only a token hash and can be revoked or accepted', () => {
  const db = freshDb();
  assert.deepEqual(columns(db, 'invites'), [
    'id',
    'space_id',
    'created_by',
    'token_hash',
    'created_at',
    'expires_at',
    'accepted_by',
    'accepted_at',
    'revoked_at',
  ]);
  db.prepare('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)').run(
    'a1',
    'demo@example.test',
    'Demo',
    'hash',
    'now',
    'now',
  );
  db.prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)').run(
    's1',
    'Demo space',
    'a1',
    'now',
    'now',
  );
  const add = db.prepare(
    'INSERT INTO invites (id, space_id, created_by, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
  );
  add.run('i1', 's1', 'a1', 'hash-1', 'now', 'later');
  assert.throws(() => add.run('i2', 's1', 'a1', 'hash-1', 'now', 'later'));
  assert.throws(() => add.run('i3', 'nope', 'a1', 'hash-3', 'now', 'later'));
  db.prepare('UPDATE invites SET revoked_at = ? WHERE id = ?').run('now', 'i1');
  db.close();
});

test('records belong to a space and start at revision 1', () => {
  const db = freshDb();
  assert.deepEqual(columns(db, 'records'), [
    'id',
    'space_id',
    'kind',
    'body',
    'revision',
    'created_by',
    'created_at',
    'updated_at',
  ]);
  db.prepare('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)').run(
    'a1',
    'demo@example.test',
    'Demo',
    'hash',
    'now',
    'now',
  );
  db.prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)').run(
    's1',
    'Demo space',
    'a1',
    'now',
    'now',
  );
  const add = db.prepare(
    'INSERT INTO records (id, space_id, kind, body, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  add.run('r1', 's1', 'memory', '{"title":"Demo"}', 'a1', 'now', 'now');
  const row = db.prepare('SELECT revision FROM records').get();
  assert.equal(row?.revision, 1);
  assert.throws(() =>
    add.run('r2', 'nope', 'memory', '{}', 'a1', 'now', 'now'),
  );
  db.close();
});

test('tombstones remember deleted records per space', () => {
  const db = freshDb();
  assert.deepEqual(columns(db, 'tombstones'), [
    'record_id',
    'space_id',
    'revision',
    'deleted_by',
    'deleted_at',
  ]);
  db.prepare('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)').run(
    'a1',
    'demo@example.test',
    'Demo',
    'hash',
    'now',
    'now',
  );
  db.prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)').run(
    's1',
    'Demo space',
    'a1',
    'now',
    'now',
  );
  const add = db.prepare('INSERT INTO tombstones VALUES (?, ?, ?, ?, ?)');
  add.run('r1', 's1', 2, 'a1', 'now');
  assert.throws(() => add.run('r1', 's1', 3, 'a1', 'now'));
  assert.throws(() => add.run('r2', 'nope', 1, 'a1', 'now'));
  db.prepare('DELETE FROM spaces WHERE id = ?').run('s1');
  assert.equal(db.prepare('SELECT * FROM tombstones').all().length, 0);
  db.close();
});
