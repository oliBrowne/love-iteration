import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const keyLength = 64;
// Cost settings are stored inside each hash, so they can be raised later
// without breaking passwords that were hashed with older settings.
const cost = { N: 16384, r: 8, p: 1 };

function derive(
  password: string,
  salt: Buffer,
  n: number,
  r: number,
  p: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, { N: n, r, p }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

// Turns a password into "scrypt$N$r$p$salt$hash". A new random salt is used
// each time, so the same password never produces the same stored text.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, cost.N, cost.r, cost.p);
  return [
    'scrypt',
    cost.N,
    cost.r,
    cost.p,
    salt.toString('base64'),
    key.toString('base64'),
  ].join('$');
}

// True only when the password matches the stored hash. A malformed stored
// value is simply "no match" rather than an error.
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [n, r, p] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  if (![n, r, p].every((value) => Number.isInteger(value) && value > 0)) {
    return false;
  }
  const salt = Buffer.from(parts[4] ?? '', 'base64');
  const expected = Buffer.from(parts[5] ?? '', 'base64');
  if (salt.length === 0 || expected.length !== keyLength) return false;
  try {
    const actual = await derive(password, salt, n, r, p);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
