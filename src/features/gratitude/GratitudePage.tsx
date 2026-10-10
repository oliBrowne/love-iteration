import { useState } from 'react';
import type { FormEvent } from 'react';
import { getGratitudeRepository } from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import {
  DomainError,
  generateId,
  localDate,
  nowIso,
  parseGratitudeText,
} from '../../domain/index.ts';
import type { Gratitude } from '../../domain/index.ts';
import { Button, InlineError, TextArea } from '../../ui/index.ts';

type GratitudePageProps = {
  getRepository?: () => Promise<Repository<Gratitude>>;
};

export function GratitudePage({
  getRepository = getGratitudeRepository,
}: GratitudePageProps) {
  const [text, setText] = useState('');
  const [problem, setProblem] = useState<string>();
  const [justSaved, setJustSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setJustSaved(false);
    try {
      const clean = parseGratitudeText(text);
      const now = nowIso();
      const repo = await getRepository();
      await repo.put({
        id: generateId(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
        date: localDate(),
        text: clean,
      });
      setText('');
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
    <section aria-labelledby="gratitude-heading">
      <h2 id="gratitude-heading">Gratitude</h2>
      <p>One small thing you appreciate. Entries stay on this device.</p>
      <form onSubmit={submit}>
        <TextArea
          label="What are you grateful for?"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setProblem(undefined);
            setJustSaved(false);
          }}
        />
        {problem ? <InlineError>{problem}</InlineError> : null}
        {justSaved ? <p role="status">Saved.</p> : null}
        <Button type="submit">Save appreciation</Button>
      </form>
    </section>
  );
}
