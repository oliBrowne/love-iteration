import { isLocalDate } from './checkin.ts';
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

// Checks that every record in every list has a non-empty string ID and that no
// ID repeats within its list. Problems are plain sentences naming the list.
export function validateImportIds(
  data: Record<(typeof exportDataKeys)[number], unknown[]>,
): string[] {
  const errors: string[] = [];
  for (const key of exportDataKeys) {
    const seen = new Set<string>();
    let missing = 0;
    const duplicates = new Set<string>();
    for (const record of data[key]) {
      const id = isObject(record) ? record.id : undefined;
      if (typeof id !== 'string' || id === '') {
        missing += 1;
      } else if (seen.has(id)) {
        duplicates.add(id);
      } else {
        seen.add(id);
      }
    }
    if (missing > 0) {
      errors.push(`The "${key}" list has ${missing} record(s) without an ID.`);
    }
    for (const id of duplicates) {
      errors.push(`The "${key}" list repeats the ID "${id}".`);
    }
  }
  return errors;
}

// Which fields hold dates, per list. Time stamps are ISO date-times; the rest
// are calendar days written YYYY-MM-DD.
const dayFields: Partial<Record<(typeof exportDataKeys)[number], string[]>> = {
  checkIns: ['date'],
  gratitude: ['date'],
  memories: ['date'],
  ritualCompletions: ['date'],
  reflections: ['weekStart'],
};
const timeFields: Partial<Record<(typeof exportDataKeys)[number], string[]>> = {
  plans: ['startsAt'],
};

// Checks the date fields of every record before anything is written. Problems
// are plain sentences naming the list, the record position, and the field.
export function validateImportDates(
  data: Record<(typeof exportDataKeys)[number], unknown[]>,
): string[] {
  const errors: string[] = [];
  for (const key of exportDataKeys) {
    data[key].forEach((record, index) => {
      if (!isObject(record)) return;
      const check = (field: string, valid: boolean) => {
        if (!valid) {
          errors.push(
            `The "${key}" record ${index + 1} has an invalid "${field}" date.`,
          );
        }
      };
      for (const field of [
        'createdAt',
        ...(timeFields[key] ?? []),
        'updatedAt',
      ]) {
        const value = record[field];
        check(
          field,
          typeof value === 'string' && !Number.isNaN(Date.parse(value)),
        );
      }
      for (const field of dayFields[key] ?? []) {
        check(field, isLocalDate(record[field]));
      }
    });
  }
  return errors;
}
