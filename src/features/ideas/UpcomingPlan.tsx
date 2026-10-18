import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  DomainError,
  nowIso,
  parsePlannedStart,
  plannedStartInputValue,
} from '../../domain/index.ts';
import type { PlannedDate } from '../../domain/index.ts';
import { Button, InlineError, TextField } from '../../ui/index.ts';

type UpcomingPlanProps = {
  plan: PlannedDate;
  title: string;
  onChange: (plan: PlannedDate) => Promise<void>;
};

const format = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

// One upcoming plan, with a small form to change its day and time.
export function UpcomingPlan({ plan, title, onChange }: UpcomingPlanProps) {
  const [editing, setEditing] = useState(false);
  const [when, setWhen] = useState('');
  const [problem, setProblem] = useState<string>();

  function startEdit() {
    setWhen(plannedStartInputValue(plan.startsAt));
    setProblem(undefined);
    setEditing(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      const startsAt = parsePlannedStart(when);
      await onChange({ ...plan, startsAt, updatedAt: nowIso() });
      setEditing(false);
    } catch (error) {
      setProblem(
        error instanceof DomainError
          ? error.message
          : 'Could not save this. Nothing was lost; try again.',
      );
    }
  }

  return (
    <li className="gratitude-card">
      <strong>{title}</strong>
      {editing ? (
        <form aria-label="Change plan time" onSubmit={save}>
          <TextField
            label="New date and time"
            type="datetime-local"
            value={when}
            onChange={(event) => {
              setWhen(event.target.value);
              setProblem(undefined);
            }}
          />
          {problem ? <InlineError>{problem}</InlineError> : null}
          <Button type="submit">Save time</Button>
          <Button type="button" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <>
          <p>{format(plan.startsAt)}</p>
          <Button type="button" onClick={startEdit}>
            Change time
          </Button>
        </>
      )}
    </li>
  );
}
