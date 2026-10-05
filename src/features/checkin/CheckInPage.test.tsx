// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CheckInPage } from './CheckInPage.tsx';

afterEach(cleanup);

describe('CheckInPage note field', () => {
  it('starts empty and is not required', () => {
    render(<CheckInPage />);
    const note = screen.getByLabelText(
      'Note (optional)',
    ) as HTMLTextAreaElement;
    expect(note.value).toBe('');
    expect(note.required).toBe(false);
  });

  it('accepts plain text', () => {
    render(<CheckInPage />);
    const note = screen.getByLabelText(
      'Note (optional)',
    ) as HTMLTextAreaElement;
    fireEvent.change(note, { target: { value: 'Demo <b>note</b>' } });
    expect(note.value).toBe('Demo <b>note</b>');
  });
});
