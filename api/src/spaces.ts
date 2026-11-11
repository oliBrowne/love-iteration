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
