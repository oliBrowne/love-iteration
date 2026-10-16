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
  const [editingId, setEditingId] = useState<string>();
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editProblem, setEditProblem] = useState<string>();
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

  async function toggle(idea: DateIdea) {
    try {
      const repo = await getRepository();
      await repo.put({
        ...idea,
        updatedAt: nowIso(),
        state: idea.state === 'active' ? 'completed' : 'active',
      });
      setIdeas(await repo.list());
    } catch {
      setProblem('Could not update this. Nothing was lost; try again.');
    }
  }

  function startEdit(idea: DateIdea) {
    setEditTitle(idea.title);
    setEditNote(idea.note);
    setEditProblem(undefined);
    setEditingId(idea.id);
  }

  async function saveEdit(event: FormEvent, idea: DateIdea) {
    event.preventDefault();
    try {
      const clean = parseDateIdeaTitle(editTitle);
      const repo = await getRepository();
      await repo.put({
        ...idea,
        updatedAt: nowIso(),
        title: clean,
        note: editNote.trim(),
      });
      setIdeas(await repo.list());
      setEditingId(undefined);
    } catch (error) {
      setEditProblem(
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
      {(['active', 'completed'] as const).map((state) => {
        const group = ideas.filter((idea) => idea.state === state);
        if (group.length === 0) return null;
        return (
          <section key={state} aria-labelledby={`${state}-ideas-heading`}>
            <h3 id={`${state}-ideas-heading`}>
              {state === 'active' ? 'To do' : 'Done'}
            </h3>
            <ul className="gratitude-list">
              {group.map((idea) => (
                <li key={idea.id} className="gratitude-card">
                  {idea.id === editingId ? (
                    <form
                      aria-label="Edit idea"
                      onSubmit={(event) => saveEdit(event, idea)}
                    >
                      <TextField
                        label="Edit title"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                      />
                      <TextArea
                        label="Edit note"
                        value={editNote}
                        onChange={(event) => setEditNote(event.target.value)}
                      />
                      {editProblem ? (
                        <InlineError>{editProblem}</InlineError>
                      ) : null}
                      <Button type="submit">Save changes</Button>
                      <Button
                        type="button"
                        onClick={() => setEditingId(undefined)}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <>
                      <strong>{idea.title}</strong>
                      {idea.note ? <p>{idea.note}</p> : null}
                      <Button type="button" onClick={() => toggle(idea)}>
                        {state === 'active'
                          ? 'Mark done'
                          : 'Move back to to do'}
                      </Button>
                      <Button type="button" onClick={() => startEdit(idea)}>
                        Edit idea
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
