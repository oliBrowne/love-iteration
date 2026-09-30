import { describe, expect, it } from 'vitest';
import { greeting } from './greeting';

describe('greeting', () => {
  it('greets by name', () => {
    expect(greeting('  Sam ')).toBe('Hello, Sam');
  });

  it('falls back when there is no name', () => {
    expect(greeting()).toBe('Hello');
    expect(greeting('   ')).toBe('Hello');
  });
});
