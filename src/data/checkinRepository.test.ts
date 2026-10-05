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

describe('check-in repository list', () => {
  it('returns newest date first', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    await repo.put({ ...demoCheckIn, id: 'a', date: '2026-01-02' });
    await repo.put({ ...demoCheckIn, id: 'b', date: '2026-03-01' });
    await repo.put({ ...demoCheckIn, id: 'c', date: '2026-02-10' });
    expect((await repo.list()).map((record) => record.id)).toEqual([
      'b',
      'c',
      'a',
    ]);
  });

  it('returns an empty list when nothing is saved', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    expect(await repo.list()).toEqual([]);
  });
});

describe('check-in repository delete', () => {
  it('leaves the deleted record absent and keeps the others', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    await repo.put({ ...demoCheckIn, id: 'a' });
    await repo.put({ ...demoCheckIn, id: 'b' });
    await repo.delete('a');
    expect(await repo.get('a')).toBeUndefined();
    expect((await repo.list()).map((record) => record.id)).toEqual(['b']);
  });

  it('does nothing when the id is unknown', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    await expect(repo.delete('missing')).resolves.toBeUndefined();
  });
});
