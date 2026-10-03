// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { InlineError } from './InlineError.tsx';

afterEach(cleanup);

describe('InlineError', () => {
  it('exposes its message with alert semantics', () => {
    render(<InlineError>Could not save.</InlineError>);
    expect(screen.getByRole('alert').textContent).toBe('Could not save.');
  });
});
