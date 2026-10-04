import { describe, expect, expectTypeOf, it } from 'vitest';
import type { RecordMetadata } from './record.ts';

describe('RecordMetadata', () => {
  it('has id, schemaVersion, createdAt and updatedAt', () => {
    expectTypeOf<RecordMetadata>().toEqualTypeOf<{
      id: string;
      schemaVersion: number;
      createdAt: string;
      updatedAt: string;
    }>();
    const meta: RecordMetadata = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    expect(Object.keys(meta)).toHaveLength(4);
  });
});
