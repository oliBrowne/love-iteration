// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState.tsx';

afterEach(cleanup);

describe('EmptyState', () => {
  it('renders empty text as readable content, not hidden decoration', () => {
    render(<EmptyState>Nothing here yet.</EmptyState>);
    const text = screen.getByText('Nothing here yet.');
    expect(text.tagName).toBe('P');
    expect(text.closest('[aria-hidden="true"]')).toBeNull();
  });
});
