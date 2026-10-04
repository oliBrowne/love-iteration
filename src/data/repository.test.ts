import { describe, expect, it } from 'vitest';
import type { RecordMetadata } from '../domain/index.ts';
import type { Repository } from './repository.ts';

// A minimal in-memory implementation proves the interface is usable.
function memoryRepository<T extends RecordMetadata>(): Repository<T> {
  const records = new Map<string, T>();
  return {
    get: async (id) => records.get(id),
    list: async () => [...records.values()],
    put: async (record) => {
      records.set(record.id, record);
    },
    delete: async (id) => {
      records.delete(id);
    },
  };
}

describe('Repository', () => {
  it('supports get, list, put and delete', async () => {
    const repo = memoryRepository<RecordMetadata>();
    const record = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: 'a',
      updatedAt: 'a',
    };
    await repo.put(record);
    expect(await repo.get('demo-1')).toEqual(record);
    expect(await repo.list()).toEqual([record]);
    await repo.delete('demo-1');
    expect(await repo.get('demo-1')).toBeUndefined();
  });
});
