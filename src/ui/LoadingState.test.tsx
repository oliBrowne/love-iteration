// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LoadingState } from './LoadingState.tsx';

afterEach(cleanup);

describe('LoadingState', () => {
  it('has status semantics and marks itself busy', () => {
    render(<LoadingState label="Opening your journal…" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Opening your journal…');
    expect(status.getAttribute('aria-busy')).toBe('true');
  });
});
