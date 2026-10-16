// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';

afterEach(cleanup);

describe('Ideas route', () => {
  it('opens the Ideas page from #/ideas', () => {
    window.location.hash = '#/ideas';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Ideas' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has an Ideas link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Ideas' });
    expect(link.getAttribute('href')).toBe('#/ideas');
  });
});
