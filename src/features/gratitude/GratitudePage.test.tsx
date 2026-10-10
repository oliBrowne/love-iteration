// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';

afterEach(cleanup);

describe('Gratitude route', () => {
  it('opens the Gratitude page from #/gratitude', () => {
    window.location.hash = '#/gratitude';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Gratitude' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Gratitude' })).toBeTruthy();
    window.location.hash = '';
  });
});
