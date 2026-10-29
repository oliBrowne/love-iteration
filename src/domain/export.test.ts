import { describe, expect, it } from 'vitest';
import {
  EXPORT_APP_NAME,
  EXPORT_SCHEMA_VERSION,
  createExportEnvelope,
} from './export.ts';

describe('createExportEnvelope', () => {
  it('carries a version and an ISO timestamp', () => {
    const envelope = createExportEnvelope(
      { demo: [] },
      new Date('2026-03-04T05:06:07.000Z'),
    );
    expect(envelope).toEqual({
      app: EXPORT_APP_NAME,
      schemaVersion: EXPORT_SCHEMA_VERSION,
      exportedAt: '2026-03-04T05:06:07.000Z',
      data: { demo: [] },
    });
  });

  it('uses a positive whole-number version', () => {
    expect(Number.isInteger(EXPORT_SCHEMA_VERSION)).toBe(true);
    expect(EXPORT_SCHEMA_VERSION).toBeGreaterThan(0);
  });

  it('stamps the current time when none is given', () => {
    const before = Date.now();
    const { exportedAt } = createExportEnvelope({});
    expect(Date.parse(exportedAt)).toBeGreaterThanOrEqual(before);
  });
});
