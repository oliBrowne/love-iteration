// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CheckIn } from '../../domain/index.ts';
import { CheckInDetail } from './CheckInDetail.tsx';

afterEach(cleanup);

const record: CheckIn = {
  id: 'id-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  date: '2026-01-03',
  mood: 'good',
  note: 'A long demo note.\nIt has a second line that should not be cut off.',
};

describe('CheckInDetail', () => {
  it('shows the mood and the complete note', () => {
    render(<CheckInDetail record={record} onBack={() => {}} />);
    expect(screen.getByText('Good')).toBeTruthy();
    expect(screen.getByTestId('detail-note').textContent).toBe(record.note);
  });

  it('says so when there is no note', () => {
    render(
      <CheckInDetail record={{ ...record, note: '' }} onBack={() => {}} />,
    );
    expect(screen.getByText('No note for this day.')).toBeTruthy();
  });

  it('returns with the back button', () => {
    const onBack = vi.fn();
    render(<CheckInDetail record={record} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: 'Back to Home' }));
    expect(onBack).toHaveBeenCalled();
  });
});
