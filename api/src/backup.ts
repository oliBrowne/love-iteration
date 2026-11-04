import { existsSync } from 'node:fs';
import { openDb } from './db.ts';
import type { Db } from './db.ts';

// True when SQLite reports the database file as healthy.
export function passesIntegrityCheck(db: Db): boolean {
  const rows = db.prepare('PRAGMA integrity_check').all();
  return rows.length === 1 && rows[0]?.integrity_check === 'ok';
}

// Copies a live database to a new file (VACUUM INTO makes a consistent copy)
// and opens the copy to confirm it is healthy. Never overwrites a file.
export function backupDb(db: Db, destination: string): void {
  if (existsSync(destination)) {
    throw new Error(`Backup file already exists: ${destination}`);
  }
  db.prepare('VACUUM INTO ?').run(destination);
  const copy = openDb(destination);
  try {
    if (!passesIntegrityCheck(copy)) {
      throw new Error(`Backup failed its integrity check: ${destination}`);
    }
  } finally {
    copy.close();
  }
}
