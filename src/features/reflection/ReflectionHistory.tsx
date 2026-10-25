import { formatWeekRange } from '../../domain/index.ts';
import type { Reflection } from '../../domain/index.ts';

type ReflectionHistoryProps = {
  // Prior weeks, newest first.
  reflections: Reflection[];
};

// A browsable list of earlier weeks, one entry per saved reflection.
export function ReflectionHistory({ reflections }: ReflectionHistoryProps) {
  if (reflections.length === 0) return null;
  return (
    <section aria-labelledby="reflection-history-heading">
      <h3 id="reflection-history-heading">Earlier weeks</h3>
      <ul>
        {reflections.map((reflection) => (
          <li key={reflection.id}>{formatWeekRange(reflection.weekStart)}</li>
        ))}
      </ul>
    </section>
  );
}
