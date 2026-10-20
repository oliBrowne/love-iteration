// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';

afterEach(cleanup);

describe('Rituals route', () => {
  it('opens the Rituals page from #/rituals', () => {
    window.location.hash = '#/rituals';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Rituals' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Rituals link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Rituals' });
    expect(link.getAttribute('href')).toBe('#/rituals');
  });
});
