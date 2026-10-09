import { moodLabels } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';

type HistoryListProps = {
  records: CheckIn[];
};

// Earlier check-ins, newest first. Shows nothing until there is something to list.
export function HistoryList({ records }: HistoryListProps) {
  if (records.length === 0) return null;
  return (
    <section aria-labelledby="history-heading">
      <h3 id="history-heading">Earlier check-ins</h3>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            {record.date}: {moodLabels[record.mood]}
          </li>
        ))}
      </ul>
    </section>
  );
}
