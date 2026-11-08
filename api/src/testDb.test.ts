import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { closeTestDbs, createTestDb } from './testDb.ts';

test('each test database is migrated, isolated, and removed afterwards', () => {
  const first = createTestDb();
  const second = createTestDb();
  const files = [first, second].map((db) => String(db.location()));
  assert.notEqual(files[0], files[1]);
  assert.ok(files.every((file) => file.endsWith('test.db')));

  first
    .prepare(
      'INSERT INTO accounts (id, email, display_name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run('a1', 'demo@example.test', 'Demo', 'hash', 'now', 'now');
  const count = (db: typeof first) =>
    db.prepare('SELECT COUNT(*) AS n FROM accounts').get()!.n;
  assert.equal(count(first), 1);
  assert.equal(count(second), 0);

  closeTestDbs();
  assert.ok(files.every((file) => !existsSync(file)));
});
