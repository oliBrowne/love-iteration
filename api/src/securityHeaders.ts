// Headers set on every API response. They are listed in api/README.md.
export const securityHeaders: Readonly<Record<string, string>> = {
  'x-content-type-options': 'nosniff',
  'cache-control': 'no-store',
  'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
};
