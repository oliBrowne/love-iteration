import { useEffect, useState } from 'react';
import { EmptyState, TextField } from '../../ui/index.ts';
import {
  formatDateLabel,
  groupSearchResults,
  routeToHash,
  timelineKindLabels,
  searchEntries,
  timelineKindRoutes,
} from '../../domain/index.ts';
import type { TimelineEntry } from '../../domain/index.ts';
import {
  loadTimeline,
  localTimelineSources,
} from '../timeline/loadTimeline.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

type SearchPageProps = {
  sources?: TimelineSources;
};

export function SearchPage({
  sources = localTimelineSources,
}: SearchPageProps) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [query, setQuery] = useState('');
  const [problem, setProblem] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    loadTimeline(sources)
      .then((feed) => {
        if (!cancelled) setEntries(feed);
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your entries to search.');
      });
    return () => {
      cancelled = true;
    };
  }, [sources]);

  const results = searchEntries(entries, query);

  return (
    <section aria-labelledby="search-heading">
      <h2 id="search-heading">Search</h2>
      <TextField
        label="Search your entries"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {problem ? <p role="alert">{problem}</p> : null}
      {query.trim() !== '' && results.length === 0 ? (
        <EmptyState>
          Nothing matches &ldquo;{query.trim()}&rdquo;. Try a different word.
        </EmptyState>
      ) : null}
      {groupSearchResults(results).map((group) => (
        <section key={group.kind} aria-label={timelineKindLabels[group.kind]}>
          <h3>{timelineKindLabels[group.kind]}</h3>
          <ul className="gratitude-list">
            {group.entries.map((entry) => (
              <li key={entry.id} className="gratitude-card">
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
      ))}
    </section>
  );
}
