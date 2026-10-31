// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.tsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('App without browser storage', () => {
  it('shows a clear error instead of the app', () => {
    vi.stubGlobal('indexedDB', undefined);
    render(<App />);
    expect(screen.getByRole('alert').textContent).toMatch(
      /cannot save data on this device/,
    );
  });
});
