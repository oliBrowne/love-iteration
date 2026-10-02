/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

describe('color tokens', () => {
  it('keeps literal colors inside the :root token block', () => {
    const outsideRoot = css.replace(/:root\s*\{[^}]*\}/, '');
    expect(outsideRoot).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
    expect(css).toContain('--color-accent');
  });
});
