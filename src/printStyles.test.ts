/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

describe('print styles', () => {
  it('hides navigation, buttons and print-hide content when printing', () => {
    const block = css.slice(css.indexOf('@media print'));
    expect(block).toContain('header');
    expect(block).toContain('button');
    expect(block).toContain('.print-hide');
    expect(block).toContain('display: none');
  });
});
