import type { Db } from './db.ts';

export type Migration = { version: number; sql: string };

export function getSchemaVersion(db: Db): number {
  const row = db.prepare('PRAGMA user_version').get();
  return Number(row?.user_version ?? 0);
}

// Applies each migration newer than the stored schema version, in order.
// Every step runs in its own transaction and bumps the version with it, so a
// migration is applied exactly once and a failed one leaves nothing half-done.
// Returns the versions that were applied this time.
export function runMigrations(db: Db, migrations: Migration[]): number[] {
  const applied: number[] = [];
  const ordered = [...migrations].sort((a, b) => a.version - b.version);
  for (const [index, m] of ordered.entries()) {
    if (m.version !== index + 1) {
      throw new Error('Migration versions must be 1, 2, 3 with no gaps.');
    }
  }
  for (const m of ordered) {
    if (m.version <= getSchemaVersion(db)) continue;
    db.exec('BEGIN');
    try {
      db.exec(m.sql);
      db.exec(`PRAGMA user_version = ${m.version}`);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
    applied.push(m.version);
  }
  return applied;
}
