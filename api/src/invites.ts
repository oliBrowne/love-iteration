import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Db } from './db.ts';

const hourMs = 60 * 60 * 1000;

// An invite lasts 7 days unless the owner asks for 1 to 720 hours (30 days).
export const defaultInviteHours = 24 * 7;
export const maxInviteHours = 24 * 30;
export const inviteHoursRule = `Invite hours must be a whole number from 1 to ${maxInviteHours}.`;

// Reads an hours setting from text such as "24". Missing text means the
// default; anything that is not a whole number in range is undefined.
export function parseInviteHours(text: string | null): number | undefined {
  if (text === null) return defaultInviteHours;
  if (!/^\d{1,4}$/.test(text)) return undefined;
  const hours = Number(text);
  return hours >= 1 && hours <= maxInviteHours ? hours : undefined;
}

export type CreatedInvite = { id: string; link: string; expiresAt: string };

// Only a hash of the token is stored, so a copy of the database cannot be used
// to join a space.
export function hashInviteToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Creates a one-time invite for a space and returns its link. Only the owner
// of the space may do this; anyone else gets 'not_owner' (also for a space
// that does not exist, so a stranger learns nothing about it). The secret
// token appears in the returned link only and is never stored.
export function createInvite(
  db: Db,
  accountId: string,
  spaceId: string,
  hours: number = defaultInviteHours,
  now: () => number = Date.now,
): CreatedInvite | 'not_owner' {
  const owner = db
    .prepare(
      "SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ? AND role = 'owner'",
    )
    .get(spaceId, accountId);
  if (!owner) return 'not_owner';
  const id = randomUUID();
  const token = randomBytes(32).toString('base64url');
  const created = new Date(now()).toISOString();
  const expiresAt = new Date(now() + hours * hourMs).toISOString();
  db.prepare(
    `INSERT INTO invites (id, space_id, created_by, token_hash, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, spaceId, accountId, hashInviteToken(token), created, expiresAt);
  return { id, link: `/invite/${token}`, expiresAt };
}

// Looks up an invite by the token from its link. A token names exactly one
// space (the invites table requires a space and has no wildcard form), so it
// can only ever open the space it was created for.
// An unknown token and an
// expired one (or one already used) are told apart so the screen can say what happened; an expired
// invite can never be accepted.
export function findInvite(
  db: Db,
  token: string,
  now: () => number = Date.now,
):
  | { inviteId: string; spaceId: string }
  | 'unknown'
  | 'expired'
  | 'used'
  | 'revoked' {
  const row = db
    .prepare(
      'SELECT id, space_id, expires_at, accepted_at, revoked_at FROM invites WHERE token_hash = ?',
    )
    .get(hashInviteToken(token));
  if (!row) return 'unknown';
  if (row.revoked_at !== null) return 'revoked';
  if (row.accepted_at !== null) return 'used';
  if (Date.parse(String(row.expires_at)) <= now()) return 'expired';
  return { inviteId: String(row.id), spaceId: String(row.space_id) };
}

export type Accepted = { spaceId: string };

// Accepts an invite: the person becomes a member of the one space it names and
// the invite records who accepted it and when. Someone already in the space
// stays a member (never downgraded from owner).
export function acceptInvite(
  db: Db,
  accountId: string,
  token: string,
  now: () => number = Date.now,
): Accepted | 'unknown' | 'expired' | 'used' | 'revoked' {
  const found = findInvite(db, token, now);
  if (typeof found === 'string') return found;
  const when = new Date(now()).toISOString();
  db.exec('BEGIN');
  try {
    db.prepare(
      "INSERT OR IGNORE INTO memberships VALUES (?, ?, 'member', ?)",
    ).run(found.spaceId, accountId, when);
    // The WHERE clause makes the claim atomic: of two simultaneous
    // acceptances only one changes a row.
    const claimed = db
      .prepare(
        'UPDATE invites SET accepted_by = ?, accepted_at = ? WHERE id = ? AND accepted_at IS NULL',
      )
      .run(accountId, when, found.inviteId);
    if (claimed.changes !== 1) {
      db.exec('ROLLBACK');
      return 'used';
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return { spaceId: found.spaceId };
}

// Lets the owner of a space cancel an invite nobody has accepted yet. A
// stranger, a plain member, or an invite of another space is 'not_found'
// (nothing is revealed); an accepted invite cannot be revoked ('used').
export function revokeInvite(
  db: Db,
  accountId: string,
  spaceId: string,
  inviteId: string,
  now: () => number = Date.now,
): 'revoked' | 'not_found' | 'used' {
  const row = db
    .prepare(
      `SELECT i.accepted_at FROM invites i
       JOIN memberships m ON m.space_id = i.space_id
       WHERE i.id = ? AND i.space_id = ? AND m.account_id = ? AND m.role = 'owner'`,
    )
    .get(inviteId, spaceId, accountId);
  if (!row) return 'not_found';
  if (row.accepted_at !== null) return 'used';
  db.prepare(
    'UPDATE invites SET revoked_at = COALESCE(revoked_at, ?) WHERE id = ?',
  ).run(new Date(now()).toISOString(), inviteId);
  return 'revoked';
}
