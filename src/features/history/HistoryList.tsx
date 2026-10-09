import { formatDateLabel, moodLabels } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';
import { EmptyState } from '../../ui/index.ts';

type HistoryListProps = {
  records: CheckIn[];
};

// Earlier check-ins, newest first, or instructions when there are none yet.
export function HistoryList({ records }: HistoryListProps) {
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
        {records.map((record) => (
          <li key={record.id}>
            {formatDateLabel(record.date)}: {moodLabels[record.mood]}
          </li>
        ))}
      </ul>
    </section>
  );
}
