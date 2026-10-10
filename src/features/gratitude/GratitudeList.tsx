import { formatDateLabel } from '../../domain/index.ts';
import type { Gratitude } from '../../domain/index.ts';

// One card per appreciation, in the order given (newest first).
export function GratitudeList({ entries }: { entries: Gratitude[] }) {
  if (entries.length === 0) return null;
  return (
    <ul className="gratitude-list">
      {entries.map((entry) => (
        <li key={entry.id} className="gratitude-card">
          <p>{entry.text}</p>
          <small>{formatDateLabel(entry.date)}</small>
        </li>
      ))}
    </ul>
  );
}
