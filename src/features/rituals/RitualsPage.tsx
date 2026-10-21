import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getRitualRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  generateId,
  nowIso,
  parseRitualCadence,
  parseRitualName,
} from '../../domain/index.ts';
import type { Ritual } from '../../domain/index.ts';
import {
  Button,
  EmptyState,
  InlineError,
  Select,
  TextField,
} from '../../ui/index.ts';

const cadenceOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

type RitualsPageProps = {
  getRepository?: () => Promise<Repository<Ritual>>;
};

export function RitualsPage({
  getRepository = getRitualRepository,
}: RitualsPageProps) {
  const [name, setName] = useState('');
  const [cadence, setCadence] = useState('daily');
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [editName, setEditName] = useState('');
  const [editCadence, setEditCadence] = useState('daily');
  const [editProblem, setEditProblem] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) {
          setRituals(records);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved rituals.');
      });
    return () => {
      cancelled = true;
    };
  }, [getRepository]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const clean = parseRitualName(name);
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        name: clean,
        cadence: parseRitualCadence(cadence),
      });
      setRituals(await repo.list());
      setName('');
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

  function startEdit(ritual: Ritual) {
    setEditName(ritual.name);
    setEditCadence(ritual.cadence);
    setEditProblem(undefined);
    setEditingId(ritual.id);
  }

  async function saveEdit(event: FormEvent, ritual: Ritual) {
    event.preventDefault();
    try {
      const clean = parseRitualName(editName);
      const repo = await getRepository();
      await repo.put({
        ...ritual,
        updatedAt: nowIso(),
        name: clean,
        cadence: parseRitualCadence(editCadence),
      });
      setRituals(await repo.list());
      setEditingId(undefined);
    } catch (error) {
      setEditProblem(
        error instanceof DomainError
          ? error.message
          : 'Could not save this. Nothing was lost; try again.',
      );
    }
  }

  async function archive(ritual: Ritual) {
    try {
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({ ...ritual, updatedAt: now, archivedAt: now });
      setRituals(await repo.list());
      if (editingId === ritual.id) setEditingId(undefined);
    } catch {
      setProblem('Could not archive this. Nothing was lost; try again.');
    }
  }

  const active = rituals.filter((ritual) => ritual.archivedAt === undefined);
  const archived = rituals.filter((ritual) => ritual.archivedAt !== undefined);
  const editing = active.find((ritual) => ritual.id === editingId);

  return (
    <section aria-labelledby="rituals-heading">
      <h2 id="rituals-heading">Rituals</h2>
      <p>Small habits worth repeating. Rituals stay on this device.</p>
      <form onSubmit={submit}>
        <TextField
          label="Ritual name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setProblem(undefined);
            setJustSaved(false);
          }}
        />
        <Select
          label="Cadence"
          options={cadenceOptions}
          value={cadence}
          onChange={(event) => {
            setCadence(event.target.value);
            setJustSaved(false);
          }}
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        {justSaved ? <p role="status">Saved.</p> : null}
        <Button type="submit">Save ritual</Button>
      </form>
      {loaded && active.length === 0 ? (
        <EmptyState>
          No rituals yet. Name a small habit and choose daily or weekly, like a
          good-morning message or a Sunday call.
        </EmptyState>
      ) : null}
      {active.length > 0 ? (
        <ul className="gratitude-list">
          {active.map((ritual) => (
            <li key={ritual.id} className="gratitude-card">
              <p>{ritual.name}</p>
              <small>{ritual.cadence === 'daily' ? 'Daily' : 'Weekly'}</small>
              <Button type="button" onClick={() => startEdit(ritual)}>
                Edit {ritual.name}
              </Button>
              <Button type="button" onClick={() => archive(ritual)}>
                Archive {ritual.name}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {editing ? (
        <form
          aria-label="Edit ritual"
          onSubmit={(event) => saveEdit(event, editing)}
        >
          <TextField
            label="Edit name"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          />
          <Select
            label="Edit cadence"
            options={cadenceOptions}
            value={editCadence}
            onChange={(event) => setEditCadence(event.target.value)}
          />
          {editProblem ? <InlineError>{editProblem}</InlineError> : null}
          <Button type="submit">Save changes</Button>
          <Button type="button" onClick={() => setEditingId(undefined)}>
            Cancel
          </Button>
        </form>
      ) : null}
      {archived.length > 0 ? (
        <details>
          <summary>Archived rituals ({archived.length})</summary>
          <ul className="gratitude-list">
            {archived.map((ritual) => (
              <li key={ritual.id} className="gratitude-card">
                <p>{ritual.name}</p>
                <small>
                  {ritual.cadence === 'daily' ? 'Daily' : 'Weekly'}, archived
                </small>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
