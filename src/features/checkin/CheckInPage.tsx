import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getCheckInRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  generateId,
  localDate,
  moodLabels,
  noteRemaining,
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
        if (cancelled) return;
        setSaved(records);
        // Editing today: saved values fill the form unless the person typed first.
        const today = records.find((r) => r.date === localDate());
        if (today) {
          setMood((current) => current ?? today.mood);
          setNote((current) => current || today.note);
        }
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved check-ins.');
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  const remaining = noteRemaining(note);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!mood) {
      setProblem('Pick a mood before saving.');
      return;
    }
    if (noteRemaining(note) < 0) return;
    const now = nowIso();
    const date = localDate();
    try {
      const repo = await getRepository();
      // One check-in per day: a repeat save updates today's record.
      const existing = (await repo.list()).find((r) => r.date === date);
      const record: CheckIn = {
        id: existing?.id ?? generateId(),
        schemaVersion: 1,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        date,
        mood,
        note,
      };
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
      <p className="privacy-note">
        Your entries stay on this device. Nothing is uploaded.
      </p>
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
        <p
          id="note-remaining"
          className={remaining < 0 ? 'inline-error' : undefined}
          role={remaining < 0 ? 'alert' : undefined}
        >
          {remaining < 0
            ? `Note is ${-remaining} characters over the limit.`
            : `${remaining} characters remaining.`}
        </p>
        {problem ? <InlineError>{problem}</InlineError> : null}
        <Button type="submit" disabled={remaining < 0}>
          Save check-in
        </Button>
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
