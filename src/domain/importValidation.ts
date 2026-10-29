import { EXPORT_APP_NAME, EXPORT_SCHEMA_VERSION } from './export.ts';

// The record lists an export file holds, by name.
export const exportDataKeys = [
  'checkIns',
  'gratitude',
  'memories',
  'plans',
  'ideas',
  'rituals',
  'ritualCompletions',
  'reflections',
] as const;

export type ImportCheck =
  | { ok: true; data: Record<(typeof exportDataKeys)[number], unknown[]> }
  | { ok: false; errors: string[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Checks the outer shape of a parsed import file: a plain object with the app
// name, a supported schema version, an export time, and a list for each record
// kind. It does not look inside the records yet. Problems are plain sentences.
export function validateImportRoot(root: unknown): ImportCheck {
  if (!isObject(root)) {
    return { ok: false, errors: ['The file is not a Love Iteration export.'] };
  }
  const errors: string[] = [];
  if (root.app !== EXPORT_APP_NAME) {
    errors.push('The file was not made by Love Iteration.');
  }
  if (
    !Number.isInteger(root.schemaVersion) ||
    (root.schemaVersion as number) < 1
  ) {
    errors.push('The file has no valid schema version.');
  } else if ((root.schemaVersion as number) > EXPORT_SCHEMA_VERSION) {
    errors.push('The file is from a newer version of Love Iteration.');
  }
  if (
    typeof root.exportedAt !== 'string' ||
    Number.isNaN(Date.parse(root.exportedAt))
  ) {
    errors.push('The file has no valid export time.');
  }
  const data = root.data;
  if (!isObject(data)) {
    errors.push('The file has no data section.');
  } else {
    for (const key of exportDataKeys) {
      if (!Array.isArray(data[key]))
        errors.push(`The "${key}" list is missing.`);
    }
  }
  if (errors.length > 0 || !isObject(data)) return { ok: false, errors };
  return { ok: true, data: data as Extract<ImportCheck, { ok: true }>['data'] };
}
