import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDb } from './db.ts';
import type { Db } from './db.ts';
import { runMigrations } from './migrate.ts';
import { migrations } from './migrations.ts';

// Test fixture: every call returns a brand-new, fully migrated database in its
// own temporary folder, so no test can see another test's data. Call
// closeTestDbs() once when the test file finishes (for example with `after`).
const open: { db: Db; dir: string }[] = [];

export function createTestDb(): Db {
  const dir = mkdtempSync(join(tmpdir(), 'love-test-'));
  const db = openDb(join(dir, 'test.db'));
  runMigrations(db, migrations);
  open.push({ db, dir });
  return db;
}

export function closeTestDbs(): void {
  for (const { db, dir } of open.splice(0)) {
    if (db.isOpen) db.close();
    rmSync(dir, { recursive: true, force: true });
  }
}
