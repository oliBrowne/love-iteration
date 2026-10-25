import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  getCheckInRepository,
  getReflectionRepository,
} from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  formatWeekRange,
  generateId,
  nowIso,
  weekStart,
} from '../../domain/index.ts';
import type { CheckIn, Reflection } from '../../domain/index.ts';
import { Button, InlineError, TextArea } from '../../ui/index.ts';
import { WeekSummary } from './WeekSummary.tsx';
import { ReflectionHistory } from './ReflectionHistory.tsx';
import { prompts } from './reflectionPrompts.ts';
import type { PromptField } from './reflectionPrompts.ts';

type ReflectionPageProps = {
  getRepository?: () => Promise<Repository<Reflection>>;
  getCheckInRepo?: () => Promise<Repository<CheckIn>>;
};

export function ReflectionPage({
  getRepository = getReflectionRepository,
  getCheckInRepo = getCheckInRepository,
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
  // Reflections from earlier weeks, newest first.
  // This week's check-ins, for the optional summary.
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [earlier, setEarlier] = useState<Reflection[]>([]);

  // Only the first getRepository is used to refill, so a new function on a
  // later render cannot overwrite what is being typed.
  const loadRepository = useRef(getRepository);

  useEffect(() => {
    let current = true;
    getCheckInRepo()
      .then((repo) => repo.list())
      .then((saved) => {
        if (current) setCheckIns(saved);
      })
      .catch(() => {
        // The summary is optional; reflecting works without it.
      });
    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refill the form with this week's saved responses, if any.
  useEffect(() => {
    let current = true;
    loadRepository
      .current()
      .then((repo) => repo.list())
      .then((saved) => {
        if (!current) return;
        setEarlier(saved.filter((r) => r.weekStart !== weekStart()));
        const found = saved.find((r) => r.weekStart === weekStart());
        if (!found) return;
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

  async function remove(reflection: Reflection) {
    try {
      const repo = await getRepository();
      await repo.delete(reflection.id);
      setEarlier((list) => list.filter((r) => r.id !== reflection.id));
    } catch {
      setProblem('Could not delete this. Nothing was removed; try again.');
    }
  }

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
      <WeekSummary weekStart={weekStart()} checkIns={checkIns} />
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
      <ReflectionHistory reflections={earlier} onDelete={remove} />
    </section>
  );
}
