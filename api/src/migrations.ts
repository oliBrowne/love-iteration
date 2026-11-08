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
  {
    version: 4,
    sql: `
      CREATE TABLE invites (
        id TEXT PRIMARY KEY,
        space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
        created_by TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        accepted_by TEXT REFERENCES accounts(id) ON DELETE SET NULL,
        accepted_at TEXT,
        revoked_at TEXT
      )`,
  },
  {
    version: 5,
    sql: `
      CREATE TABLE records (
        id TEXT PRIMARY KEY,
        space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
        kind TEXT NOT NULL,
        body TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 1,
        created_by TEXT NOT NULL REFERENCES accounts(id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX records_by_space ON records (space_id, updated_at)`,
  },
  {
    version: 6,
    sql: `
      CREATE TABLE tombstones (
        record_id TEXT PRIMARY KEY,
        space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
        revision INTEGER NOT NULL,
        deleted_by TEXT NOT NULL REFERENCES accounts(id),
        deleted_at TEXT NOT NULL
      );
      CREATE INDEX tombstones_by_space ON tombstones (space_id, deleted_at)`,
  },
  {
    version: 7,
    sql: `
      CREATE TABLE sync_cursors (
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
        cursor TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (account_id, space_id)
      )`,
  },
  {
    version: 8,
    // People sign up with a handle, not an email, so email becomes optional and
    // handle (unique) is added. SQLite cannot relax a column in place, so the
    // table is rebuilt; no account could have been created before this step.
    sql: `
      CREATE TABLE accounts_new (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        handle TEXT UNIQUE
      );
      INSERT INTO accounts_new (id, email, display_name, password_hash, created_at, updated_at)
        SELECT id, email, display_name, password_hash, created_at, updated_at FROM accounts;
      DROP TABLE accounts;
      ALTER TABLE accounts_new RENAME TO accounts`,
  },
];
