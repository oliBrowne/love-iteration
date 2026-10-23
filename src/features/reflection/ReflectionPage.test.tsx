// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';

afterEach(cleanup);

describe('Reflection route', () => {
  it('opens the Reflection page from #/reflection', () => {
    window.location.hash = '#/reflection';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Reflection' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Reflection link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Reflection' });
    expect(link.getAttribute('href')).toBe('#/reflection');
  });
});
