import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { deleteAccount, deleteConfirmation } from './accountDeletion.ts';
import {
  checkAccountInput,
  changePassword,
  checkLogin,
  passwordRule,
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
import {
  acceptInvite,
  createInvite,
  inviteHoursRule,
  parseInviteHours,
  revokeInvite,
} from './invites.ts';
import { readJsonBody, rejectBadJson } from './jsonBody.ts';
import type { RateLimiter } from './rateLimit.ts';
import { formatLogLine } from './requestLog.ts';
import { securityHeaders } from './securityHeaders.ts';
import type { SessionStore } from './sessions.ts';
import {
  checkSpaceName,
  createSpace,
  leaveSpace,
  listSpaceRecords,
  listSpaces,
  removeMember,
  spaceNameRule,
} from './spaces.ts';
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
  if (path === '/me' && req.method === 'GET' && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    sendJson(res, 200, { accountId });
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
  if (path === '/password' && req.method === 'POST' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    updatePassword(req, res, db, sessions, accountId, secureCookies).catch(
      () => {
        if (!res.headersSent) sendError(res, 'server_error');
      },
    );
    return;
  }
  if (path === '/account' && req.method === 'DELETE' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    removeAccount(req, res, db, sessions, accountId, secureCookies).catch(
      () => {
        if (!res.headersSent) sendError(res, 'server_error');
      },
    );
    return;
  }
  if (path === '/spaces' && req.method === 'GET' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    sendJson(res, 200, { spaces: listSpaces(db, accountId) });
    return;
  }
  if (path === '/spaces' && req.method === 'POST' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    addSpace(req, res, db, accountId).catch(() => {
      if (!res.headersSent) sendError(res, 'server_error');
    });
    return;
  }
  if (path === '/invites/accept' && req.method === 'POST' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    joinSpace(req, res, db, accountId).catch(() => {
      if (!res.headersSent) sendError(res, 'server_error');
    });
    return;
  }
  const inviteMatch = /^\/spaces\/([^/]+)\/invites$/.exec(path ?? '');
  if (inviteMatch && req.method === 'POST' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    const hours = parseInviteHours(
      new URL(req.url ?? '/', 'http://x').searchParams.get('hours'),
    );
    if (hours === undefined) {
      sendError(res, 'invalid_request', inviteHoursRule);
      return;
    }
    // Spaces that are not yours look the same as spaces that do not exist.
    const invite = createInvite(db, accountId, inviteMatch[1] as string, hours);
    if (invite === 'not_owner') sendError(res, 'not_found');
    else sendJson(res, 201, invite);
    return;
  }
  const leaveMatch = /^\/spaces\/([^/]+)\/membership$/.exec(path ?? '');
  if (leaveMatch && req.method === 'DELETE' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    if (leaveSpace(db, accountId, leaveMatch[1] as string) === 'not_found') {
      sendError(res, 'not_found');
    } else sendJson(res, 200, { ok: true });
    return;
  }
  const recordsMatch = /^\/spaces\/([^/]+)\/records$/.exec(path ?? '');
  if (recordsMatch && req.method === 'GET' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    const records = listSpaceRecords(db, accountId, recordsMatch[1] as string);
    if (!records) sendError(res, 'not_found');
    else sendJson(res, 200, { records });
    return;
  }
  const removeMatch = /^\/spaces\/([^/]+)\/members\/([^/]+)$/.exec(path ?? '');
  if (removeMatch && req.method === 'DELETE' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    const result = removeMember(
      db,
      accountId,
      removeMatch[1] as string,
      removeMatch[2] as string,
    );
    if (result === 'not_found') sendError(res, 'not_found');
    else if (result === 'self') {
      sendError(res, 'invalid_request', 'Leave the space instead.');
    } else sendJson(res, 200, { ok: true });
    return;
  }
  const revokeMatch = /^\/spaces\/([^/]+)\/invites\/([^/]+)$/.exec(path ?? '');
  if (revokeMatch && req.method === 'DELETE' && db && sessions) {
    const accountId = sessionAccount(req, sessions);
    if (accountId === undefined) {
      sendError(res, 'unauthorized', 'Please log in.');
      return;
    }
    const result = revokeInvite(
      db,
      accountId,
      revokeMatch[1] as string,
      revokeMatch[2] as string,
    );
    if (result === 'not_found') sendError(res, 'not_found');
    else if (result === 'used') {
      sendError(res, 'conflict', 'That invitation was already used.');
    } else sendJson(res, 200, { ok: true });
    return;
  }
  // Everything else that changes data needs a live session, so a new write
  // route is protected by default and only answers 404 once logged in.
  const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method ?? '');
  if (isWrite && sessions && sessionAccount(req, sessions) === undefined) {
    sendError(res, 'unauthorized', 'Please log in.');
    return;
  }
  sendError(res, 'not_found');
}

// Returns the account of the request's live session cookie, if any.
function sessionAccount(
  req: IncomingMessage,
  sessions: SessionStore,
): string | undefined {
  const token = readSessionToken(req.headers.cookie);
  return token ? sessions.find(token) : undefined;
}

// POST /invites/accept: the token travels in the body, never the path, because
// paths are logged. The caller joins the one space the invite names (200).
async function joinSpace(
  req: IncomingMessage,
  res: ServerResponse,
  db: Db,
  accountId: string,
): Promise<void> {
  const body = await readJsonBody(req);
  if (rejectBadJson(res, body)) return;
  const input = body.ok ? body.value : null;
  const token =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>).token
      : undefined;
  if (typeof token !== 'string' || token === '') {
    sendError(res, 'invalid_request', 'An invite token is needed.');
    return;
  }
  const result = acceptInvite(db, accountId, token);
  if (result === 'unknown') {
    sendError(res, 'not_found', 'That invitation was not found.');
  } else if (result === 'expired') {
    sendError(res, 'invalid_request', 'That invitation has expired.');
  } else if (result === 'used') {
    sendError(res, 'conflict', 'That invitation was already used.');
  } else if (result === 'revoked') {
    sendError(res, 'invalid_request', 'That invitation was cancelled.');
  } else {
    sendJson(res, 200, { spaceId: result.spaceId });
  }
}

// POST /spaces: creates a shared space; the caller becomes its owner (201).
async function addSpace(
  req: IncomingMessage,
  res: ServerResponse,
  db: Db,
  accountId: string,
): Promise<void> {
  const body = await readJsonBody(req);
  if (rejectBadJson(res, body)) return;
  const input = body.ok ? body.value : null;
  const name = checkSpaceName(
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>).name
      : undefined,
  );
  if (name === undefined) {
    sendError(res, 'invalid_request', spaceNameRule);
    return;
  }
  sendJson(res, 201, createSpace(db, accountId, name));
}

// POST /password: the old password is required; the new one replaces it (200)
// and all earlier sessions end.
async function updatePassword(
  req: IncomingMessage,
  res: ServerResponse,
  db: Db,
  sessions: SessionStore,
  accountId: string,
  secureCookies: boolean,
): Promise<void> {
  const body = await readJsonBody(req);
  if (rejectBadJson(res, body)) return;
  const input = body.ok ? body.value : null;
  const { oldPassword, newPassword } =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : { oldPassword: undefined, newPassword: undefined };
  const result = await changePassword(db, accountId, oldPassword, newPassword);
  if (result === 'wrong_password') {
    sendError(res, 'invalid_request', 'The current password is not right.');
  } else if (result === 'invalid_new') {
    sendError(res, 'invalid_request', passwordRule);
  } else {
    // Every old session ends, including any a thief may hold. This device
    // gets a fresh one so the person stays logged in.
    sessions.revokeAll(accountId);
    res.setHeader(
      'set-cookie',
      sessionCookie(sessions.create(accountId), secureCookies),
    );
    sendJson(res, 200, { ok: true });
  }
}

// DELETE /account: needs the password and the confirmation phrase (200).
async function removeAccount(
  req: IncomingMessage,
  res: ServerResponse,
  db: Db,
  sessions: SessionStore,
  accountId: string,
  secureCookies: boolean,
): Promise<void> {
  const body = await readJsonBody(req);
  if (rejectBadJson(res, body)) return;
  const input = body.ok ? body.value : null;
  const { password, confirm } =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : { password: undefined, confirm: undefined };
  const result = await deleteAccount(db, accountId, password, confirm);
  if (result === 'wrong_password') {
    sendError(res, 'invalid_request', 'The password is not right.');
  } else if (result === 'not_confirmed') {
    sendError(
      res,
      'invalid_request',
      `Type "${deleteConfirmation}" to confirm.`,
    );
  } else {
    sessions.revokeAll(accountId);
    res.setHeader('set-cookie', clearedSessionCookie(secureCookies));
    sendJson(res, 200, { ok: true });
  }
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
