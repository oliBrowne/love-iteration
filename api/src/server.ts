import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { sendError } from './errors.ts';
import { apiName, apiVersion } from './version.ts';

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

// Answers one request. Only GET /health exists so far.
export function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const path = (req.url ?? '/').split('?')[0];
  if (path === '/health' && req.method === 'GET') {
    sendJson(res, 200, { status: 'ok', name: apiName, version: apiVersion });
    return;
  }
  sendError(res, 'not_found');
}

export function createApiServer(): Server {
  return createServer(handleRequest);
}
