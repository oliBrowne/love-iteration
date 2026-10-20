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
import { Button, InlineError, Select, TextField } from '../../ui/index.ts';

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

  useEffect(() => {
    let cancelled = false;
    getRepository()
      .then((repo) => repo.list())
      .then((records) => {
        if (!cancelled) setRituals(records);
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
      {rituals.length > 0 ? (
        <ul className="gratitude-list">
          {rituals.map((ritual) => (
            <li key={ritual.id} className="gratitude-card">
              <p>{ritual.name}</p>
              <small>{ritual.cadence === 'daily' ? 'Daily' : 'Weekly'}</small>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
