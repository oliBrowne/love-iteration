import { describe, expect, it } from 'vitest';
import { createExportEnvelope, exportDataKeys } from '../../domain/index.ts';
import { previewImport } from './previewImport.ts';

const stamps = {
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-02T10:00:00.000Z',
};
const empty = Object.fromEntries(exportDataKeys.map((k) => [k, []]));
const text = (data: object) =>
  JSON.stringify(createExportEnvelope({ ...empty, ...data }));

describe('previewImport', () => {
  it('counts incoming records', () => {
    const result = previewImport(
      text({ checkIns: [{ id: 'a', ...stamps, date: '2026-01-01' }] }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.counts.find((c) => c.key === 'checkIns')?.count).toBe(1);
      expect(result.counts.find((c) => c.key === 'memories')?.count).toBe(0);
    }
  });

  it('rejects text that is not JSON', () => {
    expect(previewImport('nope')).toEqual({
      ok: false,
      errors: ['The file is not valid JSON.'],
    });
  });

  it('reports ID and date problems', () => {
    const result = previewImport(
      text({ checkIns: [{ ...stamps, date: '2026-13-01' }] }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveLength(2);
  });
});
