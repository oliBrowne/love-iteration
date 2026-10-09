import { useEffect, useState } from 'react';
import { Button } from '../../ui/index.ts';
import { getCheckInRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  formatLocalTime,
  localDate,
  moodLabels,
  routeToHash,
} from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';

type HomePageProps = {
  getRepository?: () => Promise<Repository<CheckIn>>;
};

export function HomePage({
  getRepository = getCheckInRepository,
}: HomePageProps) {
  const [today, setToday] = useState<CheckIn>();
  const [confirming, setConfirming] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  async function deleteToday() {
    if (!today) return;
    try {
      const repo = await getRepository();
      await repo.delete(today.id);
      setToday(undefined);
      setConfirming(false);
      setDeleteFailed(false);
    } catch {
      setDeleteFailed(true);
    }
  }

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
        <>
          <p data-testid="today-summary">
            Today you checked in feeling{' '}
            <strong>{moodLabels[today.mood]}</strong>. Last edited at{' '}
            {formatLocalTime(today.updatedAt)}.
          </p>
          <p>
            <a href={routeToHash('check-in')}>Edit today&rsquo;s check-in</a>
          </p>
          {confirming ? (
            <div role="group" aria-label="Confirm delete">
              <p>Delete today&rsquo;s check-in? This cannot be undone.</p>
              {deleteFailed ? (
                <p role="alert">Could not delete. Please try again.</p>
              ) : null}
              <Button onClick={deleteToday}>Yes, delete</Button>{' '}
              <Button onClick={() => setConfirming(false)}>Keep it</Button>
            </div>
          ) : (
            <Button onClick={() => setConfirming(true)}>
              Delete today&rsquo;s check-in
            </Button>
          )}
        </>
      ) : null}
    </section>
  );
}
