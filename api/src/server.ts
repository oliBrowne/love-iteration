import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import {
  checkAccountInput,
  checkLogin,
  createAccount,
  HandleTakenError,
} from './accounts.ts';
import {
  clearedSessionCookie,
  readSessionToken,
  sessionCookie,
} from './cookie.ts';
import { corsHeaders } from './cors.ts';
import type { Db } from './db.ts';
import { sendError } from './errors.ts';
import { createLoginThrottle } from './loginThrottle.ts';
import type { LoginThrottle } from './loginThrottle.ts';
import { readJsonBody, rejectBadJson } from './jsonBody.ts';
import type { RateLimiter } from './rateLimit.ts';
import { formatLogLine } from './requestLog.ts';
import { securityHeaders } from './securityHeaders.ts';
import type { SessionStore } from './sessions.ts';
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
  sessions?: SessionStore,
  throttle?: LoginThrottle,
  secureCookies = false,
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
  if (path === '/login' && req.method === 'POST' && db && sessions) {
    login(req, res, db, sessions, throttle, secureCookies).catch(() => {
      if (!res.headersSent) sendError(res, 'server_error');
    });
    return;
  }
  if (path === '/logout' && req.method === 'POST' && sessions) {
    // Revoking is safe to repeat: with no live session it still answers 200.
    const token = readSessionToken(req.headers.cookie);
    if (token) sessions.revoke(token);
    res.setHeader('set-cookie', clearedSessionCookie(secureCookies));
    sendJson(res, 200, { ok: true });
    return;
  }
  sendError(res, 'not_found');
}

// POST /login: valid credentials start a session (200); anything else is 401.
async function login(
  req: IncomingMessage,
  res: ServerResponse,
  db: Db,
  sessions: SessionStore,
  throttle?: LoginThrottle,
  secureCookies = false,
): Promise<void> {
  const body = await readJsonBody(req);
  if (rejectBadJson(res, body)) return;
  const input = body.ok ? body.value : null;
  const { handle, password } =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : { handle: undefined, password: undefined };
  // Both the client address and the handle are throttled, whether or not the
  // handle exists, so a block says nothing about accounts.
  const keys = [
    `ip:${req.socket.remoteAddress ?? 'unknown'}`,
    `handle:${typeof handle === 'string' ? handle.trim().toLowerCase() : ''}`,
  ];
  if (throttle?.isBlocked(keys)) {
    res.setHeader('retry-after', '900');
    sendError(res, 'rate_limited', 'Too many failed logins. Try again later.');
    return;
  }
  const accountId =
    typeof handle === 'string' && typeof password === 'string'
      ? await checkLogin(db, handle, password)
      : undefined;
  if (accountId === undefined) {
    throttle?.recordFailure(keys);
    sendError(res, 'unauthorized');
    return;
  }
  throttle?.clear(keys[1] as string);
  // The token travels only in an HttpOnly cookie, never in the body.
  res.setHeader(
    'set-cookie',
    sessionCookie(sessions.create(accountId), secureCookies),
  );
  sendJson(res, 200, { ok: true });
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
  sessions?: SessionStore,
  throttle: LoginThrottle = createLoginThrottle(),
  secureCookies = false,
): Server {
  return createServer((req, res) =>
    handleRequest(
      req,
      res,
      log,
      allowedOrigins,
      allowRequest,
      db,
      sessions,
      throttle,
      secureCookies,
    ),
  );
}

// Starts listening on the configured host and port (localhost by default).
export function startServer(
  config: {
    host: string;
    port: number;
    allowedOrigins?: readonly string[];
    secureCookies?: boolean;
  },
  log?: LogFn,
  db?: Db,
  sessions?: SessionStore,
): Promise<Server> {
  const server = createApiServer(
    log,
    config.allowedOrigins,
    undefined,
    db,
    sessions,
    undefined,
    config.secureCookies,
  );
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(config.port, config.host, () => resolve(server));
  });
}
