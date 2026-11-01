// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PrivacyPage } from './PrivacyPage.tsx';

afterEach(cleanup);

describe('PrivacyPage', () => {
  it('describes local storage and links back to Settings', () => {
    render(<PrivacyPage />);
    expect(
      screen.getByRole('heading', { name: 'Privacy policy' }),
    ).toBeTruthy();
    expect(screen.getByText(/IndexedDB, on this device/)).toBeTruthy();
    expect(screen.getByText(/no accounts/)).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Back to Settings' })
        .getAttribute('href'),
    ).toBe('#/settings');
  });
});
