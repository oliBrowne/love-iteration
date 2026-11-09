import { describe, expect, it } from 'vitest';
import {
  readSharingChoice,
  saveSharingChoice,
  sharingChoiceKey,
} from './sharingChoice.ts';

function fakeStorage(initial?: string) {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(sharingChoiceKey, initial);
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    data,
  };
}

describe('sharing choice', () => {
  it('is off until someone turns it on', () => {
    expect(readSharingChoice(fakeStorage())).toBe('off');
    expect(readSharingChoice(fakeStorage('anything else'))).toBe('off');
    expect(readSharingChoice(fakeStorage('on'))).toBe('on');
  });

  it('saves the choice', () => {
    const storage = fakeStorage();
    expect(saveSharingChoice('on', storage)).toBe(true);
    expect(readSharingChoice(storage)).toBe('on');
    saveSharingChoice('off', storage);
    expect(readSharingChoice(storage)).toBe('off');
  });

  it('stays off and reports failure when storage is blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readSharingChoice(blocked)).toBe('off');
    expect(saveSharingChoice('on', blocked)).toBe(false);
  });
});
