import type { Migration } from './migrate.ts';

// The server's schema, one numbered step at a time. Never edit a step that has
// been released; add a new one instead. Times are ISO 8601 strings.
export const migrations: Migration[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE accounts (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
  },
  {
    version: 2,
    sql: `
      CREATE TABLE spaces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_by TEXT NOT NULL REFERENCES accounts(id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
  },
  {
    version: 3,
    sql: `
      CREATE TABLE memberships (
        space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
        joined_at TEXT NOT NULL,
        PRIMARY KEY (space_id, account_id)
      )`,
  },
];
