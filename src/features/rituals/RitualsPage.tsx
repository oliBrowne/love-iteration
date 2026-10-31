import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  getRitualCompletionRepository,
  getRitualRepository,
} from '../../data/index.ts';
import { StorageFullError } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  formatDateLabel,
  generateId,
  lastCompletionDate,
  localDate,
  nowIso,
  parseRitualCadence,
  parseRitualName,
  ritualStreak,
  weekStart,
} from '../../domain/index.ts';
import type { Ritual, RitualCompletion } from '../../domain/index.ts';
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

// Daily rituals record the day; weekly rituals record the week's Monday.
function periodDate(ritual: Ritual): string {
  return ritual.cadence === 'daily' ? localDate() : weekStart();
}

type RitualsPageProps = {
  getRepository?: () => Promise<Repository<Ritual>>;
  getCompletionRepository?: () => Promise<Repository<RitualCompletion>>;
};

export function RitualsPage({
  getRepository = getRitualRepository,
  getCompletionRepository = getRitualCompletionRepository,
}: RitualsPageProps) {
  const [name, setName] = useState('');
  const [cadence, setCadence] = useState('daily');
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [completions, setCompletions] = useState<RitualCompletion[]>([]);
  const marking = useRef(false);
  const [historyId, setHistoryId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
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

  useEffect(() => {
    let cancelled = false;
    getCompletionRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) setCompletions(records);
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not load your saved rituals.');
      });
    return () => {
      cancelled = true;
    };
  }, [getCompletionRepository]);

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
        error instanceof DomainError || error instanceof StorageFullError
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
        error instanceof DomainError || error instanceof StorageFullError
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

  async function remove(ritual: Ritual) {
    try {
      const repo = await getRepository();
      const completionRepo = await getCompletionRepository();
      const own = (await completionRepo.list()).filter(
        (item) => item.ritualId === ritual.id,
      );
      await Promise.all(own.map((item) => completionRepo.delete(item.id)));
      await repo.delete(ritual.id);
      setRituals(await repo.list());
      setCompletions(await completionRepo.list());
      if (historyId === ritual.id) setHistoryId(undefined);
      if (editingId === ritual.id) setEditingId(undefined);
      setDeletingId(undefined);
    } catch {
      setProblem('Could not delete this. Nothing was lost; try again.');
    }
  }

  async function setPaused(ritual: Ritual, paused: boolean) {
    try {
      const now = nowIso();
      const repo = await getRepository();
      const next: Ritual = { ...ritual, updatedAt: now, pausedAt: now };
      if (!paused) delete next.pausedAt;
      await repo.put(next);
      setRituals(await repo.list());
    } catch {
      setProblem('Could not change this. Nothing was lost; try again.');
    }
  }

  async function markToday(ritual: Ritual) {
    if (marking.current) return;
    marking.current = true;
    try {
      const now = nowIso();
      const today = periodDate(ritual);
      const repo = await getCompletionRepository();
      const existing = await repo.list();
      if (
        existing.some(
          (item) => item.ritualId === ritual.id && item.date === today,
        )
      ) {
        setCompletions(existing);
        return;
      }
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        ritualId: ritual.id,
        date: today,
      });
      setCompletions(await repo.list());
    } catch {
      setProblem('Could not save this. Nothing was lost; try again.');
    } finally {
      marking.current = false;
    }
  }

  async function undoToday(ritual: Ritual) {
    try {
      const today = periodDate(ritual);
      const repo = await getCompletionRepository();
      const todays = (await repo.list()).filter(
        (item) => item.ritualId === ritual.id && item.date === today,
      );
      await Promise.all(todays.map((item) => repo.delete(item.id)));
      setCompletions(await repo.list());
    } catch {
      setProblem('Could not undo this. Nothing was lost; try again.');
    }
  }

  const active = rituals.filter((ritual) => ritual.archivedAt === undefined);
  const archived = rituals.filter((ritual) => ritual.archivedAt !== undefined);
  const historyRitual = active.find((ritual) => ritual.id === historyId);
  const deletingRitual = active.find((ritual) => ritual.id === deletingId);
  const editing = active.find((ritual) => ritual.id === editingId);

  return (
    <section aria-labelledby="rituals-heading">
      <h2 id="rituals-heading">Rituals</h2>
      <p>
        Small habits worth repeating. Rituals stay on this device and are
        private to you. Nothing here is shared with a partner.
      </p>
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
              {lastCompletionDate(completions, ritual.id) ? (
                <small>
                  Last done:{' '}
                  {formatDateLabel(lastCompletionDate(completions, ritual.id)!)}
                </small>
              ) : null}
              {ritual.pausedAt !== undefined ? (
                <>
                  <small>Paused</small>
                  <Button
                    type="button"
                    onClick={() => setPaused(ritual, false)}
                  >
                    Resume {ritual.name}
                  </Button>
                </>
              ) : completions.some(
                  (item) =>
                    item.ritualId === ritual.id &&
                    item.date === periodDate(ritual),
                ) ? (
                <>
                  <small>
                    {ritual.cadence === 'daily'
                      ? 'Done today'
                      : 'Done this week'}
                  </small>
                  <Button type="button" onClick={() => undoToday(ritual)}>
                    Undo {ritual.name}{' '}
                    {ritual.cadence === 'daily' ? 'today' : 'this week'}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => markToday(ritual)}>
                  Mark {ritual.name} done{' '}
                  {ritual.cadence === 'daily' ? 'today' : 'this week'}
                </Button>
              )}
              {ritual.pausedAt === undefined ? (
                <Button type="button" onClick={() => setPaused(ritual, true)}>
                  Pause {ritual.name}
                </Button>
              ) : null}
              <Button type="button" onClick={() => setHistoryId(ritual.id)}>
                History of {ritual.name}
              </Button>
              <Button type="button" onClick={() => startEdit(ritual)}>
                Edit {ritual.name}
              </Button>
              <Button type="button" onClick={() => archive(ritual)}>
                Archive {ritual.name}
              </Button>
              <Button type="button" onClick={() => setDeletingId(ritual.id)}>
                Delete {ritual.name}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {deletingRitual ? (
        <div role="group" aria-label="Confirm delete ritual">
          <p>
            Delete {deletingRitual.name} and its history? This cannot be undone.
          </p>
          <Button type="button" onClick={() => remove(deletingRitual)}>
            Yes, delete
          </Button>
          <Button type="button" onClick={() => setDeletingId(undefined)}>
            Cancel
          </Button>
        </div>
      ) : null}
      {historyRitual ? (
        <section aria-label="Ritual history">
          <h3>History: {historyRitual.name}</h3>
          <p>
            Streak: {ritualStreak(completions, historyRitual)}{' '}
            {historyRitual.cadence === 'daily' ? 'days' : 'weeks'}
          </p>
          {completions.some((item) => item.ritualId === historyRitual.id) ? (
            <ul>
              {completions
                .filter((item) => item.ritualId === historyRitual.id)
                .map((item) => (
                  <li key={item.id}>
                    {historyRitual.cadence === 'weekly' ? 'Week of ' : ''}
                    {formatDateLabel(item.date)}
                  </li>
                ))}
            </ul>
          ) : (
            <p>Not done yet.</p>
          )}
          <Button type="button" onClick={() => setHistoryId(undefined)}>
            Close history
          </Button>
        </section>
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
