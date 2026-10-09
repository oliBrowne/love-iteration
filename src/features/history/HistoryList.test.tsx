// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { CheckIn } from '../../domain/index.ts';
import { HistoryList } from './HistoryList.tsx';

afterEach(cleanup);

function checkIn(date: string, mood: CheckIn['mood']): CheckIn {
  return {
    id: `id-${date}`,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    date,
    mood,
    note: '',
  };
}

describe('HistoryList', () => {
  it('lists earlier dates under a heading', () => {
    render(
      <HistoryList
        records={[
          checkIn('2026-01-03', 'glowing'),
          checkIn('2026-01-02', 'rough'),
        ]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Earlier check-ins' }),
    ).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText(/2026-01-03/)).toBeTruthy();
  });

  it('explains what to do when there is no history yet', () => {
    render(<HistoryList records={[]} />);
    expect(screen.getByText(/Open Check-in, pick how you feel/)).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
