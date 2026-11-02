/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

// Every control a person can reach with Tab needs a visible focus ring.
describe('focus styles', () => {
  it.each([
    'a',
    'button',
    "input[type='checkbox']",
    "input[type='radio']",
    "input[type='file']",
    '.field input',
    '.field select',
    '.field textarea',
  ])('shows a focus ring on %s', (selector) => {
    expect(css).toContain(`${selector}:focus-visible`);
  });
});
