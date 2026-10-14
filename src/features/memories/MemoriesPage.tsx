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
import { Button, InlineError, TextArea, TextField } from '../../ui/index.ts';

type MemoriesPageProps = {
  getRepository?: () => Promise<Repository<Memory>>;
};

export function MemoriesPage({
  getRepository = getMemoryRepository,
}: MemoriesPageProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => localDate());
  const [note, setNote] = useState('');
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editProblem, setEditProblem] = useState<string>();

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
        note: note.trim(),
      });
      setMemories(await repo.list());
      setTitle('');
      setNote('');
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

  function startEdit(memory: Memory) {
    setEditTitle(memory.title);
    setEditDate(memory.date);
    setEditNote(memory.note);
    setEditProblem(undefined);
    setEditing(true);
  }

  async function saveEdit(event: FormEvent, memory: Memory) {
    event.preventDefault();
    try {
      const clean = parseMemoryTitle(editTitle);
      if (editDate === '') {
        throw new DomainError('blank-memory-date', 'Pick a date.');
      }
      const repo = await getRepository();
      await repo.put({
        ...memory,
        updatedAt: nowIso(),
        title: clean,
        date: editDate,
        note: editNote.trim(),
      });
      setMemories(await repo.list());
      setEditing(false);
    } catch (error) {
      setEditProblem(
        error instanceof DomainError
          ? error.message
          : 'Could not save this. Nothing was lost; try again.',
      );
    }
  }

  const selected = memories.find((memory) => memory.id === selectedId);

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
        <TextArea
          label="Note (optional)"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
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
              <Button
                type="button"
                aria-pressed={memory.id === selectedId}
                onClick={() => {
                  setSelectedId(memory.id);
                  setEditing(false);
                }}
              >
                {memory.title}
              </Button>
              {memory.note ? <p>{memory.note}</p> : null}
              <small>{formatDateLabel(memory.date)}</small>
            </li>
          ))}
        </ul>
      ) : null}
      {selected && editing ? (
        <form
          aria-label="Edit memory"
          onSubmit={(event) => saveEdit(event, selected)}
        >
          <TextField
            label="Edit title"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />
          <TextField
            label="Edit date"
            type="date"
            value={editDate}
            onChange={(event) => setEditDate(event.target.value)}
          />
          <TextArea
            label="Edit note"
            value={editNote}
            onChange={(event) => setEditNote(event.target.value)}
          />
          {editProblem ? <InlineError>{editProblem}</InlineError> : null}
          <Button type="submit">Save changes</Button>
          <Button type="button" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : selected ? (
        <section aria-labelledby="memory-detail-heading">
          <h3 id="memory-detail-heading">{selected.title}</h3>
          <p>{formatDateLabel(selected.date)}</p>
          <p>{selected.note || 'No note for this memory.'}</p>
          <Button type="button" onClick={() => startEdit(selected)}>
            Edit memory
          </Button>
        </section>
      ) : null}
    </section>
  );
}
