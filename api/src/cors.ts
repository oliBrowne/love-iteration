// Browsers may call the API from a page only when the response names that
// page's origin. Only origins the owner listed get that grant; everyone else
// gets no CORS headers, so the browser blocks the call.
export function corsHeaders(
  origin: string | undefined,
  allowedOrigins: readonly string[],
): Record<string, string> {
  if (origin === undefined || !allowedOrigins.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    vary: 'Origin',
  };
}

// Turns "https://a.example, https://b.example" into a clean list.
export function parseOrigins(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin !== '');
}
