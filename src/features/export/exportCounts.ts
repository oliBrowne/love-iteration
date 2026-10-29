import type { ExportData } from './exportData.ts';

const labels: Record<keyof ExportData, string> = {
  checkIns: 'Check-ins',
  gratitude: 'Gratitude',
  memories: 'Memories',
  plans: 'Plans',
  ideas: 'Date ideas',
  rituals: 'Rituals',
  ritualCompletions: 'Ritual completions',
  reflections: 'Reflections',
};

// One line per record kind: its label and how many records the export holds.
export function exportCounts(
  data: ExportData,
): { key: keyof ExportData; label: string; count: number }[] {
  return (Object.keys(labels) as (keyof ExportData)[]).map((key) => ({
    key,
    label: labels[key],
    count: data[key].length,
  }));
}
