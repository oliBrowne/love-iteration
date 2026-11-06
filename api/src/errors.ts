import type { ServerResponse } from 'node:http';

export type ApiErrorCode = 'not_found' | 'bad_json' | 'too_large';

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
};

export function errorBody(code: ApiErrorCode): ApiErrorBody {
  return { code, message: apiErrors[code].message };
}

export function sendError(res: ServerResponse, code: ApiErrorCode): void {
  res.writeHead(apiErrors[code].status, {
    'content-type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(errorBody(code)));
}
