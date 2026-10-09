import { useEffect, useState } from 'react';
import { CheckInDetail } from '../history/CheckInDetail.tsx';
import { HistoryList } from '../history/HistoryList.tsx';
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
  const [records, setRecords] = useState<CheckIn[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [confirming, setConfirming] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  // The list is newest first, so the first match is the latest update.
  const day = localDate();
  const today = records.find((r) => r.date === day);

  async function deleteToday() {
    if (!today) return;
    try {
      const repo = await getRepository();
      await repo.delete(today.id);
      setRecords((all) => all.filter((r) => r.id !== today.id));
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
        if (cancelled) return;
        setRecords(records);
        setLoaded(true);
      })
      .catch(() => {
        // The summary is optional; Home still works without it.
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  const earlier = records.filter((r) => r.date !== day);
  const selectedIndex = earlier.findIndex((r) => r.id === selectedId);
  const selected = earlier[selectedIndex];
  if (selected) {
    // The list is newest first, so the next index is the older entry.
    const older = earlier[selectedIndex + 1];
    const newer = earlier[selectedIndex - 1];
    return (
      <CheckInDetail
        record={selected}
        onBack={() => setSelectedId(undefined)}
        onOlder={older ? () => setSelectedId(older.id) : undefined}
        onNewer={newer ? () => setSelectedId(newer.id) : undefined}
      />
    );
  }

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
      {loaded ? (
        <HistoryList
          records={earlier}
          onSelect={(record) => setSelectedId(record.id)}
        />
      ) : null}
    </section>
  );
}
