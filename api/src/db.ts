import { DatabaseSync } from 'node:sqlite';

export type Db = DatabaseSync;

// Opens a SQLite database using Node's built-in driver (no extra dependency).
// Pass ':memory:' for a throwaway database, or a file path for a real one.
export function openDb(location: string): Db {
  const db = new DatabaseSync(location);
  db.exec('PRAGMA foreign_keys = ON');
  return db;
}
