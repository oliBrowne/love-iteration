// Content Security Policy for the built static page. Only same-origin scripts
// and assets load, and nothing may phone home, so unlisted remote scripts and
// trackers are blocked. Inline styles stay allowed for React style attributes.
export const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export function addCspMeta(html: string): string {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />`;
  return html.replace('<head>', `<head>\n    ${tag}`);
}
