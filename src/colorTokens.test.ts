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

describe('gallery palette', () => {
  const token = (name: string) => {
    const hex = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css)?.[1];
    if (!hex) throw new Error(`missing token --${name}`);
    return hex;
  };
  const luminance = (hex: string) => {
    const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi = 0, lo = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it('defines paper, ink, rose and dusk tokens', () => {
    for (const name of [
      'color-paper',
      'color-ink',
      'color-ink-soft',
      'color-rose',
      'color-rose-wash',
      'color-dusk-deep',
      'color-dusk-mid',
      'color-dusk-glow',
      'color-dusk-star',
    ]) {
      expect(token(name)).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('keeps text readable on paper and on dusk', () => {
    expect(contrast(token('color-ink'), token('color-paper'))).toBeGreaterThan(
      7,
    );
    expect(
      contrast(token('color-ink-soft'), token('color-paper')),
    ).toBeGreaterThan(4.5);
    expect(
      contrast(token('color-dusk-star'), token('color-dusk-deep')),
    ).toBeGreaterThan(7);
  });
});
