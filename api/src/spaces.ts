import { randomUUID } from 'node:crypto';
import type { Db } from './db.ts';

export const spaceNameRule = 'A space name needs 1 to 80 characters.';

export type Space = { id: string; name: string; role: 'owner' | 'member' };

// Returns the trimmed name, or undefined when it is not acceptable.
export function checkSpaceName(name: unknown): string | undefined {
  if (typeof name !== 'string') return undefined;
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 80 ? trimmed : undefined;
}

// Creates a shared space and makes its creator the owner, in one transaction.
export function createSpace(db: Db, accountId: string, name: string): Space {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.exec('BEGIN');
  try {
    db.prepare('INSERT INTO spaces VALUES (?, ?, ?, ?, ?)').run(
      id,
      name,
      accountId,
      now,
      now,
    );
    db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
      id,
      accountId,
      'owner',
      now,
    );
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return { id, name, role: 'owner' };
}

// Lists only the spaces this account belongs to, oldest membership first.
export function listSpaces(db: Db, accountId: string): Space[] {
  return db
    .prepare(
      `SELECT s.id, s.name, m.role FROM memberships m
       JOIN spaces s ON s.id = m.space_id
       WHERE m.account_id = ?
       ORDER BY m.joined_at, s.id`,
    )
    .all(accountId)
    .map((row) => ({
      id: String(row.id),
      name: String(row.name),
      role: row.role === 'owner' ? 'owner' : 'member',
    }));
}

// Removes the account's membership. Their records stay in the space for the
// others. If the owner leaves and others remain, the longest-standing other
// member becomes owner; if nobody remains, the space and its records are
// deleted. Returns 'not_found' when the account is not a member.
export function leaveSpace(
  db: Db,
  accountId: string,
  spaceId: string,
): 'left' | 'not_found' {
  const mine = db
    .prepare('SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ?')
    .get(spaceId, accountId);
  if (!mine) return 'not_found';
  db.exec('BEGIN');
  try {
    const heir = db
      .prepare(
        `SELECT account_id FROM memberships
         WHERE space_id = ? AND account_id != ?
         ORDER BY joined_at, account_id LIMIT 1`,
      )
      .get(spaceId, accountId);
    if (!heir) {
      db.prepare('DELETE FROM spaces WHERE id = ?').run(spaceId);
    } else {
      const stillOwned = db
        .prepare(
          "SELECT 1 FROM memberships WHERE space_id = ? AND account_id != ? AND role = 'owner'",
        )
        .get(spaceId, accountId);
      if (!stillOwned) {
        db.prepare(
          "UPDATE memberships SET role = 'owner' WHERE space_id = ? AND account_id = ?",
        ).run(spaceId, String(heir.account_id));
      }
      db.prepare(
        'DELETE FROM memberships WHERE space_id = ? AND account_id = ?',
      ).run(spaceId, accountId);
      db.prepare(
        'DELETE FROM sync_cursors WHERE space_id = ? AND account_id = ?',
      ).run(spaceId, accountId);
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return 'left';
}

// Lets a space's owner remove another member. Their records stay for the
// others. Non-owners and unknown spaces or members get 'not_found'; the owner
// removing themselves gets 'self' (they should leave instead).
export function removeMember(
  db: Db,
  ownerId: string,
  spaceId: string,
  memberId: string,
): 'removed' | 'not_found' | 'self' {
  const owner = db
    .prepare(
      "SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ? AND role = 'owner'",
    )
    .get(spaceId, ownerId);
  if (!owner) return 'not_found';
  if (memberId === ownerId) return 'self';
  const target = db
    .prepare('SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ?')
    .get(spaceId, memberId);
  if (!target) return 'not_found';
  db.exec('BEGIN');
  try {
    db.prepare(
      'DELETE FROM memberships WHERE space_id = ? AND account_id = ?',
    ).run(spaceId, memberId);
    db.prepare(
      'DELETE FROM sync_cursors WHERE space_id = ? AND account_id = ?',
    ).run(spaceId, memberId);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return 'removed';
}

export type SpaceRecord = {
  id: string;
  kind: string;
  body: string;
  revision: number;
  updatedAt: string;
};

// Returns the records of one shared space, but only to its members. Personal
// entries are never stored in a space, and records from any other space are
// never included. Non-members get null.
export function listSpaceRecords(
  db: Db,
  accountId: string,
  spaceId: string,
): SpaceRecord[] | null {
  const member = db
    .prepare('SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ?')
    .get(spaceId, accountId);
  if (!member) return null;
  return db
    .prepare(
      'SELECT id, kind, body, revision, updated_at FROM records WHERE space_id = ? ORDER BY updated_at, id',
    )
    .all(spaceId)
    .map((row) => ({
      id: String(row.id),
      kind: String(row.kind),
      body: String(row.body),
      revision: Number(row.revision),
      updatedAt: String(row.updated_at),
    }));
}

// Writes one record into a space, only for its members. The first write makes
// revision 1; each later write of the same id adds one. A record id that
// belongs to another space is refused. Returns null for non-members and for
// ids that live elsewhere, so neither reveals anything.
export function putSpaceRecord(
  db: Db,
  accountId: string,
  spaceId: string,
  recordId: string,
  kind: string,
  body: string,
): SpaceRecord | null {
  const member = db
    .prepare('SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ?')
    .get(spaceId, accountId);
  if (!member) return null;
  const now = new Date().toISOString();
  const existing = db
    .prepare('SELECT space_id, revision FROM records WHERE id = ?')
    .get(recordId);
  if (!existing) {
    db.prepare(
      'INSERT INTO records (id, space_id, kind, body, revision, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?, ?)',
    ).run(recordId, spaceId, kind, body, accountId, now, now);
    return { id: recordId, kind, body, revision: 1, updatedAt: now };
  }
  if (existing.space_id !== spaceId) return null;
  const revision = Number(existing.revision) + 1;
  db.prepare(
    'UPDATE records SET kind = ?, body = ?, revision = ?, updated_at = ? WHERE id = ? AND space_id = ?',
  ).run(kind, body, revision, now, recordId, spaceId);
  return { id: recordId, kind, body, revision, updatedAt: now };
}

export type Tombstone = { id: string; revision: number; deletedAt: string };

// Deletes one record from a space, only for its members, and leaves a
// tombstone (the record id with its next revision) so other devices learn it
// is gone. Returns null for non-members, unknown ids and other spaces' ids.
export function deleteSpaceRecord(
  db: Db,
  accountId: string,
  spaceId: string,
  recordId: string,
): Tombstone | null {
  const member = db
    .prepare('SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ?')
    .get(spaceId, accountId);
  if (!member) return null;
  const existing = db
    .prepare('SELECT revision FROM records WHERE id = ? AND space_id = ?')
    .get(recordId, spaceId);
  if (!existing) return null;
  const revision = Number(existing.revision) + 1;
  const now = new Date().toISOString();
  db.exec('BEGIN');
  try {
    db.prepare('DELETE FROM records WHERE id = ? AND space_id = ?').run(
      recordId,
      spaceId,
    );
    db.prepare(
      'INSERT OR REPLACE INTO tombstones (record_id, space_id, revision, deleted_by, deleted_at) VALUES (?, ?, ?, ?, ?)',
    ).run(recordId, spaceId, revision, accountId, now);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return { id: recordId, revision, deletedAt: now };
}
