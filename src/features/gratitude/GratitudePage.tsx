import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getGratitudeRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  generateId,
  localDate,
  nowIso,
  parseGratitudeText,
} from '../../domain/index.ts';
import type { Gratitude } from '../../domain/index.ts';
import { GratitudeList } from './GratitudeList.tsx';
import { Button, EmptyState, InlineError, TextArea } from '../../ui/index.ts';

type GratitudePageProps = {
  getRepository?: () => Promise<Repository<Gratitude>>;
};

export function GratitudePage({
  getRepository = getGratitudeRepository,
}: GratitudePageProps) {
  const [text, setText] = useState('');
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);
  const [entries, setEntries] = useState<Gratitude[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (cancelled) return;
        setEntries(records);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved appreciations.');
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const clean = parseGratitudeText(text);
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        date: localDate(),
        text: clean,
      });
      setEntries(await repo.list());
      setLoaded(true);
      setText('');
      setProblem(undefined);
      setJustSaved(true);
    } catch (error) {
      setProblem(
        error instanceof DomainError
          ? error.message
          : 'Could not save this. Nothing was lost; try again.',
      );
    }
  }

  async function edit(entry: Gratitude, newText: string) {
    const clean = parseGratitudeText(newText);
    const repo = await getRepository();
    await repo.put({ ...entry, text: clean, updatedAt: nowIso() });
    setEntries(await repo.list());
  }

  async function remove(entry: Gratitude) {
    const repo = await getRepository();
    await repo.delete(entry.id);
    setEntries(await repo.list());
  }

  return (
    <section aria-labelledby="gratitude-heading">
      <h2 id="gratitude-heading">Gratitude</h2>
      <p>One small thing you appreciate. Entries stay on this device.</p>
      <form onSubmit={submit}>
        <TextArea
          label="What are you grateful for?"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setProblem(undefined);
            setJustSaved(false);
          }}
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        {justSaved ? <p role="status">Saved.</p> : null}
        <Button type="submit">Save appreciation</Button>
      </form>
      <GratitudeList entries={entries} onEdit={edit} onDelete={remove} />
      {loaded && entries.length === 0 ? (
        <EmptyState>
          Nothing here yet. Start with one small thing, like a message that made
          you smile or something kind someone did today.
        </EmptyState>
      ) : null}
    </section>
  );
}
