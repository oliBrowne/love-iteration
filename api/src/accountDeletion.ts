import type { Db } from './db.ts';
import { verifyPassword } from './password.ts';

// The person must type this exactly, so a stray request cannot delete anything.
export const deleteConfirmation = 'delete my account';

export type AccountDeletion = 'deleted' | 'wrong_password' | 'not_confirmed';

// Deletes an account and everything it owns, in one transaction:
// - its sessions, memberships, invites and sync positions;
// - every record it wrote;
// - every space it was alone in.
// A space shared with someone else is kept for them: the longest-standing other
// member becomes its owner. Nothing changes unless the password and the
// confirmation phrase both match.
export async function deleteAccount(
  db: Db,
  accountId: string,
  password: unknown,
  confirm: unknown,
): Promise<AccountDeletion> {
  const row = db
    .prepare('SELECT password_hash FROM accounts WHERE id = ?')
    .get(accountId);
  if (
    !row ||
    typeof password !== 'string' ||
    !(await verifyPassword(password, String(row.password_hash)))
  ) {
    return 'wrong_password';
  }
  if (confirm !== deleteConfirmation) return 'not_confirmed';

  db.exec('BEGIN');
  try {
    const spaces = db
      .prepare('SELECT space_id FROM memberships WHERE account_id = ?')
      .all(accountId);
    for (const space of spaces) {
      const spaceId = String(space.space_id);
      const heir = db
        .prepare(
          `SELECT account_id FROM memberships
           WHERE space_id = ? AND account_id != ?
           ORDER BY joined_at, account_id LIMIT 1`,
        )
        .get(spaceId, accountId);
      if (!heir) {
        db.prepare('DELETE FROM spaces WHERE id = ?').run(spaceId);
        continue;
      }
      const heirId = String(heir.account_id);
      db.prepare(
        "UPDATE memberships SET role = 'owner' WHERE space_id = ? AND account_id = ?",
      ).run(spaceId, heirId);
      db.prepare(
        'UPDATE spaces SET created_by = ? WHERE id = ? AND created_by = ?',
      ).run(heirId, spaceId, accountId);
      db.prepare(
        'UPDATE tombstones SET deleted_by = ? WHERE space_id = ? AND deleted_by = ?',
      ).run(heirId, spaceId, accountId);
    }
    // Anything left that points at the account has no one else to keep it.
    db.prepare('DELETE FROM records WHERE created_by = ?').run(accountId);
    db.prepare('DELETE FROM tombstones WHERE deleted_by = ?').run(accountId);
    db.prepare('DELETE FROM spaces WHERE created_by = ?').run(accountId);
    db.prepare('DELETE FROM accounts WHERE id = ?').run(accountId);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return 'deleted';
}
