import { useEffect, useRef, useState } from 'react';
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
  { field: 'whatToTry', label: 'What would you like to try next week?' },
  { field: 'appreciation', label: 'What do you appreciate about the week?' },
] as const;

type PromptField = (typeof prompts)[number]['field'];

export function ReflectionPage({
  getRepository = getReflectionRepository,
}: ReflectionPageProps) {
  const [answers, setAnswers] = useState<Record<PromptField, string>>({
    whatWorked: '',
    whatWasHard: '',
    whatToTry: '',
    appreciation: '',
  });
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);
  // The saved record for this week, so saving again updates it.
  const [existing, setExisting] = useState<Reflection>();

  // Only the first getRepository is used to refill, so a new function on a
  // later render cannot overwrite what is being typed.
  const loadRepository = useRef(getRepository);

  // Refill the form with this week's saved responses, if any.
  useEffect(() => {
    let current = true;
    loadRepository
      .current()
      .then((repo) => repo.list())
      .then((saved) => {
        const found = saved.find((r) => r.weekStart === weekStart());
        if (!current || !found) return;
        setExisting(found);
        setAnswers({
          whatWorked: found.whatWorked ?? '',
          whatWasHard: found.whatWasHard ?? '',
          whatToTry: found.whatToTry ?? '',
          appreciation: found.appreciation ?? '',
        });
      })
      .catch(() => {
        // Nothing to refill; the form stays empty and can still save.
      });
    return () => {
      current = false;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const whatWorked = answers.whatWorked.trim();
      const whatWasHard = answers.whatWasHard.trim();
      const whatToTry = answers.whatToTry.trim();
      const appreciation = answers.appreciation.trim();
      if (
        whatWorked === '' &&
        whatWasHard === '' &&
        whatToTry === '' &&
        appreciation === ''
      ) {
        throw new DomainError(
          'blank-reflection',
          'Write a few words before saving.',
        );
      }
      const now = nowIso();
      const repo = await getRepository();
      const record: Reflection = {
        id: existing?.id ?? generateId(),
        schemaVersion: 1,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        weekStart: weekStart(),
        ...(whatWorked === '' ? {} : { whatWorked }),
        ...(whatWasHard === '' ? {} : { whatWasHard }),
        ...(whatToTry === '' ? {} : { whatToTry }),
        ...(appreciation === '' ? {} : { appreciation }),
      };
      await repo.put(record);
      setExisting(record);
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
