import { describe, expect, it } from 'vitest';
import { createExportEnvelope } from './export.ts';
import {
  exportDataKeys,
  validateImportIds,
  validateImportRoot,
} from './importValidation.ts';

const emptyData = Object.fromEntries(exportDataKeys.map((k) => [k, []]));
const valid = () => JSON.parse(JSON.stringify(createExportEnvelope(emptyData)));

describe('validateImportRoot', () => {
  it('accepts an export made by the app', () => {
    const result = validateImportRoot(valid());
    expect(result.ok).toBe(true);
  });

  it.each([null, undefined, 'text', 42, [], [valid()]])(
    'rejects a root that is not an object: %j',
    (root) => {
      const result = validateImportRoot(root);
      expect(result).toEqual({
        ok: false,
        errors: ['The file is not a Love Iteration export.'],
      });
    },
  );

  it('rejects another app, a bad version, or a bad time', () => {
    expect(validateImportRoot({ ...valid(), app: 'other' }).ok).toBe(false);
    expect(validateImportRoot({ ...valid(), schemaVersion: 0 }).ok).toBe(false);
    expect(validateImportRoot({ ...valid(), schemaVersion: '1' }).ok).toBe(
      false,
    );
    expect(validateImportRoot({ ...valid(), exportedAt: 'soon' }).ok).toBe(
      false,
    );
  });

  it('rejects a file from a newer version', () => {
    const result = validateImportRoot({ ...valid(), schemaVersion: 99 });
    expect(result).toEqual({
      ok: false,
      errors: ['The file is from a newer version of Love Iteration.'],
    });
  });

  it('reports each missing record list', () => {
    const file = valid();
    delete file.data.memories;
    file.data.plans = {};
    const result = validateImportRoot(file);
    expect(result).toEqual({
      ok: false,
      errors: [
        'The "memories" list is missing.',
        'The "plans" list is missing.',
      ],
    });
  });

  it('rejects a missing data section', () => {
    const file = valid();
    delete file.data;
    expect(validateImportRoot(file)).toEqual({
      ok: false,
      errors: ['The file has no data section.'],
    });
  });
});

describe('validateImportIds', () => {
  const lists = (over: Record<string, unknown[]> = {}) =>
    ({ ...emptyData, ...over }) as Parameters<typeof validateImportIds>[0];

  it('accepts unique IDs', () => {
    expect(
      validateImportIds(lists({ memories: [{ id: 'a' }, { id: 'b' }] })),
    ).toEqual([]);
  });

  it('reports missing and duplicate IDs', () => {
    const errors = validateImportIds(
      lists({
        gratitude: [{ id: 'a' }, { id: 'a' }, { id: '' }, { text: 'x' }, 5],
      }),
    );
    expect(errors).toEqual([
      'The "gratitude" list has 3 record(s) without an ID.',
      'The "gratitude" list repeats the ID "a".',
    ]);
  });
});
