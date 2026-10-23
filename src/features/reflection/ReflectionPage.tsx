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

// Each prompt maps to one optional field on the Reflection record.
const prompts = [
  { field: 'whatWorked', label: 'What worked this week?' },
  { field: 'whatWasHard', label: 'What was hard this week?' },
] as const;

type PromptField = (typeof prompts)[number]['field'];

export function ReflectionPage({
  getRepository = getReflectionRepository,
}: ReflectionPageProps) {
  const [answers, setAnswers] = useState<Record<PromptField, string>>({
    whatWorked: '',
    whatWasHard: '',
  });
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const whatWorked = answers.whatWorked.trim();
      const whatWasHard = answers.whatWasHard.trim();
      if (whatWorked === '' && whatWasHard === '') {
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
        ...(whatWorked === '' ? {} : { whatWorked }),
        ...(whatWasHard === '' ? {} : { whatWasHard }),
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
        {prompts.map(({ field, label }) => (
          <TextArea
            key={field}
            label={label}
            value={answers[field]}
            onChange={(event) => {
              setAnswers({ ...answers, [field]: event.target.value });
              setProblem(undefined);
              setJustSaved(false);
            }}
          />
        ))}
        <Button type="submit">Save reflection</Button>
        {problem ? <InlineError>{problem}</InlineError> : null}
        {justSaved ? <p role="status">Saved.</p> : null}
      </form>
    </section>
  );
}
