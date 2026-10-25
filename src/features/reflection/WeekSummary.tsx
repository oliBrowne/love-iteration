import { isInWeek, moodLabels } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';

type WeekSummaryProps = {
  weekStart: string;
  checkIns: CheckIn[];
};

// A quiet recap of the week, shown above the prompts. Each part is optional
// and simply left out when there is nothing to say.
export function WeekSummary({ weekStart, checkIns }: WeekSummaryProps) {
  // Oldest first reads like the week unfolding.
  const moods = checkIns
    .filter((c) => isInWeek(c.date, weekStart))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => moodLabels[c.mood]);
  if (moods.length === 0) return null;
  return (
    <p>
      Check-in moods this week: <strong>{moods.join(', ')}</strong>
    </p>
  );
}
