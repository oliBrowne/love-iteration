import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { corsHeaders } from './cors.ts';
import { sendError } from './errors.ts';
import { formatLogLine } from './requestLog.ts';
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
): void {
  // A fresh ID per request, set first so every reply (even errors) carries it.
  const requestId = randomUUID();
  res.setHeader('x-request-id', requestId);
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
  sendError(res, 'not_found');
}

export function createApiServer(
  log?: LogFn,
  allowedOrigins: readonly string[] = [],
): Server {
  return createServer((req, res) =>
    handleRequest(req, res, log, allowedOrigins),
  );
}

// Starts listening on the configured host and port (localhost by default).
export function startServer(
  config: { host: string; port: number; allowedOrigins?: readonly string[] },
  log?: LogFn,
): Promise<Server> {
  const server = createApiServer(log, config.allowedOrigins);
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(config.port, config.host, () => resolve(server));
  });
}
