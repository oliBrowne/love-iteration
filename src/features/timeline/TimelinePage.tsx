import { useEffect, useState } from 'react';
import { Button, EmptyState, TextField } from '../../ui/index.ts';
import {
  filterTimelineByDateRange,
  filterTimelineByKinds,
  formatDateLabel,
  routeToHash,
  timelineKindLabels,
  timelineKindRoutes,
  timelineKinds,
} from '../../domain/index.ts';
import type { TimelineEntry, TimelineKind } from '../../domain/index.ts';
import { loadTimeline, localTimelineSources } from './loadTimeline.ts';
import type { TimelineSources } from './loadTimeline.ts';

// How many entries load at a time.
export const TIMELINE_PAGE_SIZE = 30;

type TimelinePageProps = {
  sources?: TimelineSources;
};

export function TimelinePage({
  sources = localTimelineSources,
}: TimelinePageProps) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [kinds, setKinds] = useState<TimelineKind[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [visible, setVisible] = useState(TIMELINE_PAGE_SIZE);
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

  function toggleKind(kind: TimelineKind) {
    setVisible(TIMELINE_PAGE_SIZE);
    setKinds((current) =>
      current.includes(kind)
        ? current.filter((k) => k !== kind)
        : [...current, kind],
    );
  }

  const shown = filterTimelineByDateRange(
    filterTimelineByKinds(entries, kinds),
    from,
    to,
  );

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading">Timeline</h2>
      <p>Everything you have saved, newest first. It stays on this device.</p>
      <fieldset>
        <legend>Show</legend>
        {timelineKinds.map((kind) => (
          <label key={kind}>
            <input
              type="checkbox"
              checked={kinds.includes(kind)}
              onChange={() => toggleKind(kind)}
            />{' '}
            {timelineKindLabels[kind]}{' '}
          </label>
        ))}
      </fieldset>
      <TextField
        label="From"
        type="date"
        value={from}
        onChange={(event) => {
          setFrom(event.target.value);
          setVisible(TIMELINE_PAGE_SIZE);
        }}
      />
      <TextField
        label="To"
        type="date"
        value={to}
        onChange={(event) => {
          setTo(event.target.value);
          setVisible(TIMELINE_PAGE_SIZE);
        }}
      />
      <Button
        type="button"
        onClick={() => {
          setKinds([]);
          setFrom('');
          setTo('');
          setVisible(TIMELINE_PAGE_SIZE);
        }}
      >
        Clear filters
      </Button>
      {problem ? <p role="alert">{problem}</p> : null}
      {loaded && entries.length === 0 ? (
        <EmptyState>
          Nothing here yet. As you save check-ins, gratitude, memories, plans,
          rituals, and reflections, they will appear here in order.
        </EmptyState>
      ) : null}
      <ul className="gratitude-list">
        {shown.slice(0, visible).map((entry) => (
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
      {shown.length > visible ? (
        <Button
          type="button"
          onClick={() => setVisible(visible + TIMELINE_PAGE_SIZE)}
        >
          Show more
        </Button>
      ) : null}
    </section>
  );
}
