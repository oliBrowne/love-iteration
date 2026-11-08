import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import {
  checkAccountInput,
  createAccount,
  HandleTakenError,
} from './accounts.ts';
import { corsHeaders } from './cors.ts';
import type { Db } from './db.ts';
import { sendError } from './errors.ts';
import { readJsonBody, rejectBadJson } from './jsonBody.ts';
import type { RateLimiter } from './rateLimit.ts';
import { formatLogLine } from './requestLog.ts';
import { securityHeaders } from './securityHeaders.ts';
import { apiName, apiVersion } from './version.ts';

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

// Answers one request. Only GET /health exists so far.
export type LogFn = (line: string) => void;

export function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  log?: LogFn,
  allowedOrigins: readonly string[] = [],
  allowRequest?: RateLimiter,
  db?: Db,
): void {
  // A fresh ID per request, set first so every reply (even errors) carries it.
  const requestId = randomUUID();
  res.setHeader('x-request-id', requestId);
  for (const [name, value] of Object.entries(securityHeaders)) {
    res.setHeader(name, value);
  }
  if (log) {
    const started = Date.now();
    res.on('finish', () =>
      log(
        formatLogLine({
          requestId,
          method: req.method ?? '',
          url: req.url ?? '/',
          status: res.statusCode,
          ms: Date.now() - started,
        }),
      ),
    );
  }
  const cors = corsHeaders(req.headers.origin, allowedOrigins);
  for (const [name, value] of Object.entries(cors)) res.setHeader(name, value);
  if (allowRequest && !allowRequest(req.socket.remoteAddress ?? 'unknown')) {
    res.setHeader('retry-after', '60');
    sendError(res, 'rate_limited');
    return;
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  const path = (req.url ?? '/').split('?')[0];
  if (path === '/health' && req.method === 'GET') {
    sendJson(res, 200, { status: 'ok', name: apiName, version: apiVersion });
    return;
  }
  if (path === '/accounts' && req.method === 'POST' && db) {
    registerAccount(req, res, db).catch(() => {
      if (!res.headersSent) sendError(res, 'server_error');
    });
    return;
  }
  sendError(res, 'not_found');
}

// POST /accounts: validates the request and stores one account (201).
async function registerAccount(
  req: IncomingMessage,
  res: ServerResponse,
  db: Db,
): Promise<void> {
  const body = await readJsonBody(req);
  if (rejectBadJson(res, body)) return;
  const input = body.ok ? body.value : null;
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    sendError(res, 'invalid_request');
    return;
  }
  const check = checkAccountInput(input as Record<string, unknown>);
  if (!check.ok) {
    sendError(res, 'invalid_request', check.reason);
    return;
  }
  try {
    sendJson(res, 201, await createAccount(db, check));
  } catch (error) {
    if (!(error instanceof HandleTakenError)) throw error;
    sendError(res, 'conflict', 'That handle is already taken. Choose another.');
  }
}

export function createApiServer(
  log?: LogFn,
  allowedOrigins: readonly string[] = [],
  allowRequest?: RateLimiter,
  db?: Db,
): Server {
  return createServer((req, res) =>
    handleRequest(req, res, log, allowedOrigins, allowRequest, db),
  );
}

// Starts listening on the configured host and port (localhost by default).
export function startServer(
  config: { host: string; port: number; allowedOrigins?: readonly string[] },
  log?: LogFn,
  db?: Db,
): Promise<Server> {
  const server = createApiServer(log, config.allowedOrigins, undefined, db);
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(config.port, config.host, () => resolve(server));
  });
}
