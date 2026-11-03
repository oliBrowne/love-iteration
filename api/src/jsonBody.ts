import type { IncomingMessage, ServerResponse } from 'node:http';
import { apiErrors, sendError } from './errors.ts';

export type JsonBodyResult =
  { ok: true; value: unknown } | { ok: false; status: 400; message: string };

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

// Reads the whole request body and parses it.
export async function readJsonBody(
  req: IncomingMessage,
): Promise<JsonBodyResult> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return parseJsonBody(Buffer.concat(chunks).toString('utf8'));
}

// Replies 400 for a failed result. Returns true when it did, so a route can stop.
export function rejectBadJson(
  res: ServerResponse,
  result: JsonBodyResult,
): boolean {
  if (result.ok) return false;
  sendError(res, 'bad_json');
  return true;
}
