/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

describe('typography tokens', () => {
  it('sizes body and headings from the shared scale', () => {
    for (const selector of ['body', 'h1', 'h2']) {
      const rule = new RegExp(
        `(^|\\n)${selector}\\s*\\{[^}]*font-size:\\s*var\\(--font-size-`,
      );
      expect(css).toMatch(rule);
    }
    const outsideRoot = css.replace(/:root\s*\{[^}]*\}/, '');
    expect(outsideRoot).not.toMatch(/font-size:\s*[\d.]+(px|rem|em)/);
  });
});
