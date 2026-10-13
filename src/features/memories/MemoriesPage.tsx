import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getMemoryRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  formatDateLabel,
  generateId,
  localDate,
  nowIso,
  parseMemoryTitle,
} from '../../domain/index.ts';
import type { Memory } from '../../domain/index.ts';
import { Button, InlineError, TextField } from '../../ui/index.ts';

type MemoriesPageProps = {
  getRepository?: () => Promise<Repository<Memory>>;
};

export function MemoriesPage({
  getRepository = getMemoryRepository,
}: MemoriesPageProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => localDate());
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) setMemories(records);
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved memories.');
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const clean = parseMemoryTitle(title);
      if (date === '') {
        throw new DomainError('blank-memory-date', 'Pick a date.');
      }
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        title: clean,
        date,
        note: '',
      });
      setMemories(await repo.list());
      setTitle('');
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

  return (
    <section aria-labelledby="memories-heading">
      <h2 id="memories-heading">Memories</h2>
      <p>Moments worth keeping. Memories stay on this device.</p>
      <form onSubmit={submit}>
        <TextField
          label="Memory title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setProblem(undefined);
            setJustSaved(false);
          }}
        />
        <TextField
          label="Memory date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setProblem(undefined);
            setJustSaved(false);
          }}
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        {justSaved ? <p role="status">Saved.</p> : null}
        <Button type="submit">Save memory</Button>
      </form>
      {memories.length > 0 ? (
        <ul className="gratitude-list">
          {memories.map((memory) => (
            <li key={memory.id} className="gratitude-card">
              <p>{memory.title}</p>
              <small>{formatDateLabel(memory.date)}</small>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
