import { describe, expect, it } from 'vitest';
import { addCspMeta, contentSecurityPolicy } from './csp.ts';

describe('content security policy', () => {
  it('only allows same-origin scripts', () => {
    expect(contentSecurityPolicy).toContain("script-src 'self'");
    expect(contentSecurityPolicy).not.toMatch(/https?:|unsafe-eval/);
    expect(contentSecurityPolicy).not.toMatch(/script-src[^;]*unsafe-inline/);
  });

  it('adds the policy as a meta tag inside head', () => {
    const html = addCspMeta('<html><head><title>x</title></head></html>');
    expect(html).toContain('http-equiv="Content-Security-Policy"');
    expect(html.indexOf('<meta http-equiv')).toBeGreaterThan(
      html.indexOf('<head>'),
    );
  });
});
