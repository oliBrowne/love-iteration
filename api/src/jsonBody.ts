import type { IncomingMessage, ServerResponse } from 'node:http';
import { apiErrors, sendError } from './errors.ts';

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; message: string };

// Largest JSON body the API reads (1 MiB). Journal entries are small.
export const maxBodyBytes = 1024 * 1024;

// Turns request text into a JSON value, or a 400 result when it is not valid
// JSON. The text itself is never echoed back, since it may hold journal words.
export function parseJsonBody(text: string): JsonBodyResult {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return {
      ok: false,
      status: 400,
      message: apiErrors.bad_json.message,
    };
  }
}

// Reads the whole request body and parses it. A body over the limit is a 413,
// and reading stops early so a huge upload is never held in memory.
export async function readJsonBody(
  req: IncomingMessage,
  limit: number = maxBodyBytes,
): Promise<JsonBodyResult> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) {
      return {
        ok: false,
        status: 413,
        message: apiErrors.too_large.message,
      };
    }
    chunks.push(chunk as Buffer);
  }
  return parseJsonBody(Buffer.concat(chunks).toString('utf8'));
}

// Replies 400 or 413 for a failed result. Returns true when it did, so a route can stop.
export function rejectBadJson(
  res: ServerResponse,
  result: JsonBodyResult,
): boolean {
  if (result.ok) return false;
  sendError(res, result.status === 413 ? 'too_large' : 'bad_json');
  return true;
}
