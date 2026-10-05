import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getCheckInRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  generateId,
  localDate,
  moodLabels,
  nowIso,
} from '../../domain/index.ts';
import type { CheckIn, Mood } from '../../domain/index.ts';
import { Button, InlineError, TextArea } from '../../ui/index.ts';
import { MoodPicker } from './MoodPicker.tsx';

type CheckInPageProps = {
  getRepository?: () => Promise<Repository<CheckIn>>;
};

export function CheckInPage({
  getRepository = getCheckInRepository,
}: CheckInPageProps) {
  const [mood, setMood] = useState<Mood>();
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<CheckIn[]>([]);
  const [problem, setProblem] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) setSaved(records);
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved check-ins.');
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!mood) {
      setProblem('Pick a mood before saving.');
      return;
    }
    const now = nowIso();
    const record: CheckIn = {
      id: generateId(),
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
      date: localDate(),
      mood,
      note,
    };
    try {
      const repo = await getRepository();
      await repo.put(record);
      setSaved(await repo.list());
      setProblem(undefined);
      setNote('');
    } catch {
      setProblem('Could not save your check-in. Nothing was lost; try again.');
    }
  }

  return (
    <section aria-labelledby="checkin-heading">
      <h2 id="checkin-heading">Check-in</h2>
      <p>How are you today? A check-in takes under a minute.</p>
      <form onSubmit={submit}>
        <MoodPicker
          value={mood}
          onChange={(next) => {
            setMood(next);
            setProblem(undefined);
          }}
        />
        <TextArea
          label="Note (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        <Button type="submit">Save check-in</Button>
      </form>
      <h3>Saved check-ins</h3>
      {saved.length === 0 ? (
        <p>Nothing saved yet.</p>
      ) : (
        <ul className="checkin-list">
          {saved.map((record) => (
            <li key={record.id}>
              <strong>{record.date}</strong> — {moodLabels[record.mood]}
              {record.note ? <p>{record.note}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
