import type { ServerResponse } from 'node:http';

export type ApiErrorCode =
  | 'not_found'
  | 'bad_json'
  | 'too_large'
  | 'rate_limited'
  | 'invalid_request'
  | 'conflict'
  | 'unauthorized'
  | 'server_error';

export type ApiErrorBody = { code: ApiErrorCode; message: string };

// Every known error shares this shape: a short code for programs and a plain
// message for people. Messages never repeat what was submitted.
export const apiErrors: Record<
  ApiErrorCode,
  { status: number; message: string }
> = {
  not_found: { status: 404, message: 'Not found.' },
  bad_json: { status: 400, message: 'The request body is not valid JSON.' },
  too_large: { status: 413, message: 'The request body is too large.' },
  rate_limited: {
    status: 429,
    message: 'Too many requests. Please wait a moment.',
  },
  invalid_request: { status: 400, message: 'The request is not valid.' },
  conflict: { status: 409, message: 'That is already taken.' },
  unauthorized: {
    status: 401,
    message: 'The handle or password is not right.',
  },
  server_error: { status: 500, message: 'Something went wrong on the server.' },
};

export function errorBody(code: ApiErrorCode, message?: string): ApiErrorBody {
  return { code, message: message ?? apiErrors[code].message };
}

// A route may pass its own plain message, such as which field to fix. It must
// never repeat submitted text.
export function sendError(
  res: ServerResponse,
  code: ApiErrorCode,
  message?: string,
): void {
  res.writeHead(apiErrors[code].status, {
    'content-type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(errorBody(code, message)));
}
