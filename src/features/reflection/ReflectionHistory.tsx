import { useState } from 'react';
import { formatWeekRange } from '../../domain/index.ts';
import type { Reflection } from '../../domain/index.ts';
import { Button } from '../../ui/index.ts';
import { prompts } from './reflectionPrompts.ts';

type ReflectionHistoryProps = {
  // Prior weeks, newest first.
  reflections: Reflection[];
};

// A browsable list of earlier weeks; choosing one shows all its responses.
export function ReflectionHistory({ reflections }: ReflectionHistoryProps) {
  const [selectedId, setSelectedId] = useState<string>();
  if (reflections.length === 0) return null;
  const selected = reflections.find((r) => r.id === selectedId);

  if (selected) {
    return (
      <section aria-labelledby="reflection-detail-heading">
        <h3 id="reflection-detail-heading">
          {formatWeekRange(selected.weekStart)}
        </h3>
        {prompts.map(({ field, label }) => (
          <div key={field}>
            <h4>{label}</h4>
            <p className="note-text">{selected[field] ?? 'Not answered.'}</p>
          </div>
        ))}
        <Button onClick={() => setSelectedId(undefined)}>
          Back to earlier weeks
        </Button>
      </section>
    );
  }

  return (
    <section aria-labelledby="reflection-history-heading">
      <h3 id="reflection-history-heading">Earlier weeks</h3>
      <ul>
        {reflections.map((reflection) => (
          <li key={reflection.id}>
            <Button onClick={() => setSelectedId(reflection.id)}>
              {formatWeekRange(reflection.weekStart)}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
