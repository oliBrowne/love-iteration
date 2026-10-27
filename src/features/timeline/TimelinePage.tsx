import { useEffect, useState } from 'react';
import { EmptyState } from '../../ui/index.ts';
import {
  formatDateLabel,
  routeToHash,
  timelineKindRoutes,
} from '../../domain/index.ts';
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
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    loadTimeline(sources)
      .then((feed) => {
        if (!cancelled) {
          setEntries(feed);
          setLoaded(true);
        }
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
      {loaded && entries.length === 0 ? (
        <EmptyState>
          Nothing here yet. As you save check-ins, gratitude, memories, plans,
          rituals, and reflections, they will appear here in order.
        </EmptyState>
      ) : null}
      <ul className="gratitude-list">
        {entries.map((entry) => (
          <li key={`${entry.kind}-${entry.id}`} className="gratitude-card">
            <p>
              <a href={routeToHash(timelineKindRoutes[entry.kind])}>
                {entry.summary}
              </a>
            </p>
            <small>{formatDateLabel(entry.date)}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
