// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { localDate } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';
import { HistoryList, historyPageSize } from './HistoryList.tsx';

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
    expect(screen.getByText(/Jan 3, 2026/)).toBeTruthy();
  });

  it('explains what to do when there is no history yet', () => {
    render(<HistoryList records={[]} />);
    expect(screen.getByText(/Open Check-in, pick how you feel/)).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('labels today differently from older dates', () => {
    render(<HistoryList records={[checkIn(localDate(), 'glowing')]} />);
    expect(screen.getByText(/^Today:/)).toBeTruthy();
  });

  it('pairs every mood icon with visible text', () => {
    const { container } = render(
      <HistoryList records={[checkIn('2026-01-03', 'glowing')]} />,
    );
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon?.textContent).toBe('✨');
    expect(screen.getByText('Glowing')).toBeTruthy();
  });

  it('loads another page when there are more than 30 items', () => {
    const many = Array.from({ length: historyPageSize + 5 }, (_, i) =>
      checkIn(localDate(new Date(2025, 0, i + 1)), 'okay'),
    );
    render(<HistoryList records={many} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(historyPageSize);
    fireEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(historyPageSize + 5);
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
  });
});
