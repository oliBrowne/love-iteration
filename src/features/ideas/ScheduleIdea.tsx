import { useState } from 'react';
import type { FormEvent } from 'react';
import { getPlanRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  generateId,
  nowIso,
  parsePlannedStart,
} from '../../domain/index.ts';
import type { PlannedDate } from '../../domain/index.ts';
import { Button, InlineError, TextField } from '../../ui/index.ts';

type ScheduleIdeaProps = {
  ideaId: string;
  getPlanRepo?: () => Promise<Repository<PlannedDate>>;
  onScheduled?: () => void;
};

// A small form that gives one idea a day and time.
export function ScheduleIdea({
  ideaId,
  getPlanRepo = getPlanRepository,
  onScheduled,
}: ScheduleIdeaProps) {
  const [open, setOpen] = useState(false);
  const [when, setWhen] = useState('');
  const [problem, setProblem] = useState<string>();
  const [scheduled, setScheduled] = useState<string>();

  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      const startsAt = parsePlannedStart(when);
      const now = nowIso();
      const repo = await getPlanRepo();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        ideaId,
        startsAt,
        status: 'planned',
      });
      setScheduled(
        new Date(startsAt).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      );
      setOpen(false);
      setWhen('');
      setProblem(undefined);
      onScheduled?.();
    } catch (error) {
      setProblem(
        error instanceof DomainError
          ? error.message
          : 'Could not save this. Nothing was lost; try again.',
      );
    }
  }

  return (
    <>
      {scheduled ? <p>Scheduled for {scheduled}</p> : null}
      {open ? (
        <form aria-label="Schedule idea" onSubmit={save}>
          <TextField
            label="Date and time"
            type="datetime-local"
            value={when}
            onChange={(event) => {
              setWhen(event.target.value);
              setProblem(undefined);
            }}
          />
          {problem ? <InlineError>{problem}</InlineError> : null}
          <Button type="submit">Save date</Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <Button type="button" onClick={() => setOpen(true)}>
          Schedule
        </Button>
      )}
    </>
  );
}
