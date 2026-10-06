import { useEffect, useState } from 'react';
import { getCheckInRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import { localDate, moodLabels } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';

type HomePageProps = {
  getRepository?: () => Promise<Repository<CheckIn>>;
};

export function HomePage({
  getRepository = getCheckInRepository,
}: HomePageProps) {
  const [today, setToday] = useState<CheckIn>();

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        const day = localDate();
        // The list is newest first, so the first match is the latest update.
        if (!cancelled) setToday(records.find((r) => r.date === day));
      })
      .catch(() => {
        // The summary is optional; Home still works without it.
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  return (
    <section aria-labelledby="home-heading">
      <h2 id="home-heading">Home</h2>
      <p>A little closer, one small step at a time.</p>
      {today ? (
        <p data-testid="today-summary">
          Today you checked in feeling <strong>{moodLabels[today.mood]}</strong>
          .
        </p>
      ) : null}
    </section>
  );
}
