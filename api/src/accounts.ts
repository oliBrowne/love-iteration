import { randomUUID } from 'node:crypto';
import type { Db } from './db.ts';
import { validateHandle } from './handle.ts';
import { hashPassword, verifyPassword } from './password.ts';

// Thrown when another account already uses the handle.
export class HandleTakenError extends Error {
  constructor() {
    super('That handle is already taken.');
  }
}

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

// Stores one account, or throws HandleTakenError. Only the password hash is kept, never the password.
export async function createAccount(
  db: Db,
  details: { handle: string; password: string; displayName: string },
): Promise<NewAccount & { id: string }> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const hash = await hashPassword(details.password);
  try {
    db.prepare(
      `INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(id, details.displayName, hash, now, now, details.handle);
  } catch (error) {
    // The unique index decides, so two requests at once cannot both win.
    if (
      error instanceof Error &&
      /UNIQUE constraint failed: accounts\.handle/.test(error.message)
    ) {
      throw new HandleTakenError();
    }
    throw error;
  }
  return { id, handle: details.handle, displayName: details.displayName };
}

// A hash nobody's password matches. Unknown handles are checked against it so
// they take as long as a wrong password and timing reveals nothing.
let decoyHash: Promise<string> | undefined;
function getDecoyHash(): Promise<string> {
  decoyHash ??= hashPassword('decoy-password-for-unknown-handles');
  return decoyHash;
}

// Returns the account ID when the handle and password match, otherwise
// undefined. A missing account and a wrong password look the same to callers.
export async function checkLogin(
  db: Db,
  handle: string,
  password: string,
): Promise<string | undefined> {
  const row = db
    .prepare('SELECT id, password_hash FROM accounts WHERE handle = ?')
    .get(handle.trim().toLowerCase());
  if (!row) {
    await verifyPassword(password, await getDecoyHash());
    return undefined;
  }
  const ok = await verifyPassword(password, String(row.password_hash));
  return ok ? String(row.id) : undefined;
}
