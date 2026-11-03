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
