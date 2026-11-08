import { randomUUID } from 'node:crypto';
import type { Db } from './db.ts';
import { validateHandle } from './handle.ts';
import { hashPassword } from './password.ts';

export type NewAccount = { handle: string; displayName: string };
export type AccountInput = Record<string, unknown>;
export type AccountCheck =
  | { ok: true; handle: string; password: string; displayName: string }
  | { ok: false; reason: string };

const minPassword = 10;
const maxPassword = 200;
const maxDisplayName = 60;

// Checks a sign-up request. The display name is optional and defaults to the
// handle. Reasons never repeat what was submitted.
export function checkAccountInput(input: AccountInput): AccountCheck {
  if (typeof input.handle !== 'string') {
    return { ok: false, reason: 'Choose a handle.' };
  }
  const handle = validateHandle(input.handle);
  if (!handle.ok) return { ok: false, reason: handle.reason };
  const { password } = input;
  if (
    typeof password !== 'string' ||
    password.length < minPassword ||
    password.length > maxPassword
  ) {
    return {
      ok: false,
      reason: `A password must be ${minPassword} to ${maxPassword} characters long.`,
    };
  }
  let displayName = handle.handle;
  if (input.displayName !== undefined) {
    const name =
      typeof input.displayName === 'string' ? input.displayName.trim() : '';
    if (name === '' || name.length > maxDisplayName) {
      return {
        ok: false,
        reason: `A display name must be 1 to ${maxDisplayName} characters long.`,
      };
    }
    displayName = name;
  }
  return { ok: true, handle: handle.handle, password, displayName };
}

// Stores one account. Only the password hash is kept, never the password.
export async function createAccount(
  db: Db,
  details: { handle: string; password: string; displayName: string },
): Promise<NewAccount & { id: string }> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const hash = await hashPassword(details.password);
  db.prepare(
    `INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, details.displayName, hash, now, now, details.handle);
  return { id, handle: details.handle, displayName: details.displayName };
}
