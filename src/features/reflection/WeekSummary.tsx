import { isInWeek, moodLabels } from '../../domain/index.ts';
import type {
  CheckIn,
  Gratitude,
  RitualCompletion,
} from '../../domain/index.ts';

type WeekSummaryProps = {
  weekStart: string;
  checkIns: CheckIn[];
  gratitude: Gratitude[];
  completions: RitualCompletion[];
};

// A quiet recap of the week, shown above the prompts. Each part is optional
// and simply left out when there is nothing to say.
export function WeekSummary({
  weekStart,
  checkIns,
  gratitude,
  completions,
}: WeekSummaryProps) {
  // Oldest first reads like the week unfolding.
  const moods = checkIns
    .filter((c) => isInWeek(c.date, weekStart))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => moodLabels[c.mood]);
  const appreciations = gratitude.filter((g) =>
    isInWeek(g.date, weekStart),
  ).length;
  const ritualsDone = completions.filter((c) =>
    isInWeek(c.date, weekStart),
  ).length;
  return (
    <>
      {moods.length > 0 ? (
        <p>
          Check-in moods this week: <strong>{moods.join(', ')}</strong>
        </p>
      ) : null}
      {appreciations > 0 ? (
        <p>
          Appreciations written this week: <strong>{appreciations}</strong>
        </p>
      ) : null}
      {ritualsDone > 0 ? (
        <p>
          Rituals completed this week: <strong>{ritualsDone}</strong>
        </p>
      ) : null}
    </>
  );
}
