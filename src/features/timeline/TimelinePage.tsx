import { useEffect, useState } from 'react';
import { formatDateLabel } from '../../domain/index.ts';
import type { TimelineEntry } from '../../domain/index.ts';
import { loadTimeline, localTimelineSources } from './loadTimeline.ts';
import type { TimelineSources } from './loadTimeline.ts';

type TimelinePageProps = {
  sources?: TimelineSources;
};

export function TimelinePage({
  sources = localTimelineSources,
}: TimelinePageProps) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [problem, setProblem] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    loadTimeline(sources)
      .then((feed) => {
        if (!cancelled) setEntries(feed);
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your timeline.');
      });
    return () => {
      cancelled = true;
    };
  }, [sources]);

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading">Timeline</h2>
      <p>Everything you have saved, newest first. It stays on this device.</p>
      {problem ? <p role="alert">{problem}</p> : null}
      <ul className="gratitude-list">
        {entries.map((entry) => (
          <li key={`${entry.kind}-${entry.id}`} className="gratitude-card">
            <p>{entry.summary}</p>
            <small>{formatDateLabel(entry.date)}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
