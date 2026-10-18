import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getIdeaRepository, getPlanRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import { ScheduleIdea } from './ScheduleIdea.tsx';
import { UpcomingPlan } from './UpcomingPlan.tsx';
import {
  DomainError,
  countIdeas,
  dateIdeaCategories,
  dateIdeaCategoryLabels,
  filterIdeasByCategory,
  generateId,
  nowIso,
  parseDateIdeaTitle,
  searchIdeas,
  upcomingPlans,
} from '../../domain/index.ts';
import type {
  DateIdea,
  DateIdeaCategory,
  PlannedDate,
} from '../../domain/index.ts';
import {
  Button,
  EmptyState,
  InlineError,
  Select,
  TextArea,
  TextField,
} from '../../ui/index.ts';

const filterOptions = [
  { value: '', label: 'All categories' },
  ...dateIdeaCategories.map((value) => ({
    value,
    label: dateIdeaCategoryLabels[value],
  })),
];

const categoryOptions = dateIdeaCategories.map((value) => ({
  value,
  label: dateIdeaCategoryLabels[value],
}));

type IdeasPageProps = {
  getRepository?: () => Promise<Repository<DateIdea>>;
  getPlanRepo?: () => Promise<Repository<PlannedDate>>;
};

export function IdeasPage({
  getRepository = getIdeaRepository,
  getPlanRepo = getPlanRepository,
}: IdeasPageProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<DateIdeaCategory>('other');
  const [editingId, setEditingId] = useState<string>();
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editProblem, setEditProblem] = useState<string>();
  const [confirmingId, setConfirmingId] = useState<string>();
  const [problem, setProblem] = useState<string>();
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DateIdeaCategory | ''>(
    '',
  );
  const [plans, setPlans] = useState<PlannedDate[]>([]);
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

  async function loadPlans() {
    try {
      const repo = await getPlanRepo();
      setPlans(await repo.list());
    } catch {
      // The plan list is optional; ideas still work without it.
    }
  }

  useEffect(() => {
    let cancelled = false;
    getPlanRepo()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) setPlans(records);
      })
      .catch(() => {
        // The plan list is optional; ideas still work without it.
      });
    return () => {
      cancelled = true;
    };
  }, [getPlanRepo]);

  async function savePlan(plan: PlannedDate) {
    const repo = await getPlanRepo();
    await repo.put(plan);
    setPlans(await repo.list());
  }

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
        category,
      });
      setIdeas(await repo.list());
      setTitle('');
      setNote('');
      setCategory('other');
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

  async function remove(idea: DateIdea) {
    try {
      const repo = await getRepository();
      await repo.delete(idea.id);
      setIdeas(await repo.list());
      setConfirmingId(undefined);
    } catch {
      setProblem('Could not delete this. Nothing was lost; try again.');
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

  const counts = countIdeas(ideas);
  const upcoming = upcomingPlans(plans);

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
        <Select
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={(event) =>
            setCategory(event.target.value as DateIdeaCategory)
          }
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        <Button type="submit">Add idea</Button>
      </form>
      <TextField
        label="Search ideas"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {search ? (
        <Button type="button" onClick={() => setSearch('')}>
          Clear search
        </Button>
      ) : null}
      <Select
        label="Show category"
        value={categoryFilter}
        options={filterOptions}
        onChange={(event) =>
          setCategoryFilter(event.target.value as DateIdeaCategory | '')
        }
      />
      {upcoming.length > 0 ? (
        <section aria-labelledby="upcoming-plans-heading">
          <h3 id="upcoming-plans-heading">Upcoming plans</h3>
          <ul className="gratitude-list">
            {upcoming.map((plan) => (
              <UpcomingPlan
                key={plan.id}
                plan={plan}
                title={
                  ideas.find((idea) => idea.id === plan.ideaId)?.title ??
                  'An idea you removed'
                }
                onChange={savePlan}
              />
            ))}
          </ul>
        </section>
      ) : null}
      {loaded && ideas.length > 0 ? (
        <p aria-label="Idea counts">
          {counts.active} to do · {counts.completed} done
        </p>
      ) : null}
      {loaded && ideas.length === 0 ? (
        <EmptyState>
          No ideas yet. Add the first thing you would like to do together, like
          a walk, a film night, or a trip someday.
        </EmptyState>
      ) : null}
      {(['active', 'completed'] as const).map((state) => {
        const group = searchIdeas(
          filterIdeasByCategory(ideas, categoryFilter),
          search,
        ).filter((idea) => idea.state === state);
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
                      {idea.category ? (
                        <p>{dateIdeaCategoryLabels[idea.category]}</p>
                      ) : null}
                      {idea.note ? <p>{idea.note}</p> : null}
                      <Button type="button" onClick={() => toggle(idea)}>
                        {state === 'active'
                          ? 'Mark done'
                          : 'Move back to to do'}
                      </Button>
                      <Button type="button" onClick={() => startEdit(idea)}>
                        Edit idea
                      </Button>
                      {state === 'active' ? (
                        <ScheduleIdea
                          ideaId={idea.id}
                          getPlanRepo={getPlanRepo}
                          onScheduled={loadPlans}
                        />
                      ) : null}
                      {idea.id === confirmingId ? (
                        <>
                          <p>Delete this idea? This cannot be undone.</p>
                          <Button type="button" onClick={() => remove(idea)}>
                            Yes, delete
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setConfirmingId(undefined)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => setConfirmingId(idea.id)}
                        >
                          Delete idea
                        </Button>
                      )}
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
