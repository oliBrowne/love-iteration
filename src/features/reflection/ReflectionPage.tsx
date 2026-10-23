import { formatWeekRange, weekStart } from '../../domain/index.ts';

export function ReflectionPage() {
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
    </section>
  );
}
