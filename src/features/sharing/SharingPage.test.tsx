// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SharingPage } from './SharingPage.tsx';
import { sharingChoiceKey } from './sharingChoice.ts';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('SharingPage', () => {
  it('starts off and stores nothing', () => {
    render(<SharingPage />);
    expect(screen.getByRole('status').textContent).toMatch(/Sharing is off/);
    expect(localStorage.getItem(sharingChoiceKey)).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'Back to Settings' })
        .getAttribute('href'),
    ).toBe('#/settings');
  });

  it('asks first, and "Not now" leaves sharing off', () => {
    render(<SharingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Turn on sharing' }));
    expect(screen.getByText(/Nothing is sent yet/)).toBeTruthy();
    expect(localStorage.getItem(sharingChoiceKey)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(screen.getByRole('status').textContent).toMatch(/Sharing is off/);
    expect(localStorage.getItem(sharingChoiceKey)).toBeNull();
  });

  it('turns on only after confirming, and can be turned off', () => {
    render(<SharingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Turn on sharing' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Yes, turn on sharing' }),
    );
    expect(screen.getByRole('status').textContent).toMatch(/Sharing is on/);
    expect(localStorage.getItem(sharingChoiceKey)).toBe('on');
    fireEvent.click(screen.getByRole('button', { name: 'Turn sharing off' }));
    expect(screen.getByRole('status').textContent).toMatch(/Sharing is off/);
    expect(localStorage.getItem(sharingChoiceKey)).toBe('off');
  });

  it('remembers an earlier choice', () => {
    localStorage.setItem(sharingChoiceKey, 'on');
    render(<SharingPage />);
    expect(screen.getByRole('status').textContent).toMatch(/Sharing is on/);
  });

  it('names current members when a space is connected', () => {
    render(
      <SharingPage members={[{ id: 'a1', name: 'Demo One', role: 'owner' }]} />,
    );
    expect(screen.getByText('Demo One (owner)')).toBeTruthy();
  });
});
