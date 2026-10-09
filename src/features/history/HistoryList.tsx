import { useState } from 'react';
import { formatDateLabel, moodIcons, moodLabels } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';
import { Button, EmptyState } from '../../ui/index.ts';

export const historyPageSize = 30;

type HistoryListProps = {
  records: CheckIn[];
  onSelect?: (record: CheckIn) => void;
};

// Earlier check-ins, newest first, or instructions when there are none yet.
export function HistoryList({ records, onSelect }: HistoryListProps) {
  const [pages, setPages] = useState(1);
  const shown = records.slice(0, pages * historyPageSize);
  return (
    <section aria-labelledby="history-heading">
      <h3 id="history-heading">Earlier check-ins</h3>
      {records.length === 0 ? (
        <EmptyState>
          Nothing here yet. Open Check-in, pick how you feel, and save. Earlier
          days will show up here.
        </EmptyState>
      ) : null}
      <ul>
        {shown.map((record) => (
          <li key={record.id}>
            {formatDateLabel(record.date)}:{' '}
            <span aria-hidden="true">{moodIcons[record.mood]}</span>{' '}
            <span>{moodLabels[record.mood]}</span>
            {onSelect ? (
              <>
                {' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => onSelect(record)}
                >
                  View
                  <span className="visually-hidden">
                    {' '}
                    {formatDateLabel(record.date)} check-in
                  </span>
                </button>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      {shown.length < records.length ? (
        <Button onClick={() => setPages((n) => n + 1)}>Show more</Button>
      ) : null}
    </section>
  );
}
