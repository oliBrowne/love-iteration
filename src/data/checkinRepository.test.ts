import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { createCheckInRepository } from './checkinRepository.ts';
import { openDatabase } from './database.ts';
import { demoCheckIn } from './demoCheckIn.ts';

describe('check-in repository save', () => {
  it('returns the record after it is saved', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    await repo.put(demoCheckIn);
    expect(await repo.get('demo-1')).toEqual(demoCheckIn);
  });

  it('replaces a record saved with the same id', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    await repo.put(demoCheckIn);
    await repo.put({ ...demoCheckIn, mood: 'low' });
    expect((await repo.get('demo-1'))?.mood).toBe('low');
  });

  it('returns undefined for an unknown id', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    expect(await repo.get('missing')).toBeUndefined();
  });
});
