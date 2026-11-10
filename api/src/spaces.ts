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
