import { useState } from 'react';
import type { FormEvent } from 'react';
import { getReflectionRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  formatWeekRange,
  generateId,
  nowIso,
  weekStart,
} from '../../domain/index.ts';
import type { Reflection } from '../../domain/index.ts';
import { Button, InlineError, TextArea } from '../../ui/index.ts';

type ReflectionPageProps = {
  getRepository?: () => Promise<Repository<Reflection>>;
};

export function ReflectionPage({
  getRepository = getReflectionRepository,
}: ReflectionPageProps) {
  const [whatWorked, setWhatWorked] = useState('');
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const answer = whatWorked.trim();
      if (answer === '') {
        throw new DomainError(
          'blank-reflection',
          'Write a few words before saving.',
        );
      }
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        weekStart: weekStart(),
        whatWorked: answer,
      });
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
    <section aria-labelledby="reflection-heading">
      <h2 id="reflection-heading">Reflection</h2>
      <p>
        A quiet look back at your week. Reflections stay on this device and are
        private to you.
      </p>
      <p>
        This week: <strong>{formatWeekRange(weekStart())}</strong>
      </p>
      <form onSubmit={submit}>
        <TextArea
          label="What worked this week?"
          value={whatWorked}
          onChange={(event) => {
            setWhatWorked(event.target.value);
            setProblem(undefined);
            setJustSaved(false);
          }}
        />
        <Button type="submit">Save reflection</Button>
        {problem ? <InlineError>{problem}</InlineError> : null}
        {justSaved ? <p role="status">Saved.</p> : null}
      </form>
    </section>
  );
}
