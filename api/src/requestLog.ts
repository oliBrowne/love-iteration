export type RequestLogEntry = {
  requestId: string;
  method: string;
  url: string;
  status: number;
  ms: number;
};

// One log line per request. Only the method, the path (never the query string,
// which could hold words), the status and timing are recorded. Request bodies
// are never passed in here at all.
export function formatLogLine(entry: RequestLogEntry): string {
  const path = (entry.url.split('?')[0] ?? '').split('#')[0];
  return `${entry.requestId} ${entry.method} ${path} ${entry.status} ${entry.ms}ms`;
}
