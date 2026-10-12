// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';

afterEach(cleanup);

describe('Memories route', () => {
  it('opens the Memories page from #/memories', () => {
    window.location.hash = '#/memories';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Memories' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Memories link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Memories' });
    expect(link.getAttribute('href')).toBe('#/memories');
  });
});
