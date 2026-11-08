import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { backupDb, passesIntegrityCheck } from './backup.ts';
import { openDb } from './db.ts';
import { runMigrations } from './migrate.ts';
import { migrations } from './migrations.ts';

test('backup copies the database and the copy passes the integrity check', () => {
  const dir = mkdtempSync(join(tmpdir(), 'love-backup-'));
  const db = openDb(join(dir, 'live.db'));
  try {
    runMigrations(db, migrations);
    db.prepare(
      'INSERT INTO accounts (id, email, display_name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    ).run('a1', 'demo@example.test', 'Demo', 'hash', 'now', 'now');
    const target = join(dir, 'copy.db');
    backupDb(db, target);

    const copy = openDb(target);
    assert.ok(passesIntegrityCheck(copy));
    assert.equal(copy.prepare('SELECT * FROM accounts').all().length, 1);
    copy.close();

    assert.throws(() => backupDb(db, target), /already exists/);
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
