import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getIdeaRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  generateId,
  nowIso,
  parseDateIdeaTitle,
} from '../../domain/index.ts';
import type { DateIdea } from '../../domain/index.ts';
import {
  Button,
  EmptyState,
  InlineError,
  TextArea,
  TextField,
} from '../../ui/index.ts';

type IdeasPageProps = {
  getRepository?: () => Promise<Repository<DateIdea>>;
};

export function IdeasPage({
  getRepository = getIdeaRepository,
}: IdeasPageProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [problem, setProblem] = useState<string>();
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) {
          setIdeas(records);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved ideas.');
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const clean = parseDateIdeaTitle(title);
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        title: clean,
        note: note.trim(),
        state: 'active',
      });
      setIdeas(await repo.list());
      setTitle('');
      setNote('');
      setProblem(undefined);
    } catch (error) {
      setProblem(
        error instanceof DomainError
          ? error.message
          : 'Could not save this. Nothing was lost; try again.',
      );
    }
  }

  return (
    <section aria-labelledby="ideas-heading">
      <h2 id="ideas-heading">Ideas</h2>
      <p>Things to do together. Ideas stay on this device.</p>
      <form onSubmit={submit}>
        <TextField
          label="Idea title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setProblem(undefined);
          }}
        />
        <TextArea
          label="Note (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        <Button type="submit">Add idea</Button>
      </form>
      {loaded && ideas.length === 0 ? (
        <EmptyState>
          No ideas yet. Add the first thing you would like to do together, like
          a walk, a film night, or a trip someday.
        </EmptyState>
      ) : null}
      {ideas.length > 0 ? (
        <ul className="gratitude-list">
          {ideas.map((idea) => (
            <li key={idea.id} className="gratitude-card">
              <strong>{idea.title}</strong>
              {idea.note ? <p>{idea.note}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
