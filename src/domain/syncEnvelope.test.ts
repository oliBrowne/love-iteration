import { describe, expect, it } from 'vitest';
import {
  assertUploadable,
  makeEnvelope,
  type SyncEnvelope,
} from './syncEnvelope.ts';

describe('sync envelope', () => {
  it('carries scope, id, revision and payload, starting at revision 1', () => {
    const envelope: SyncEnvelope = makeEnvelope({
      scope: 'shared',
      spaceId: 'space-demo',
      id: 'rec-demo',
      kind: 'gratitude',
      payload: { text: 'Demo thanks' },
    });
    expect(envelope).toEqual({
      scope: 'shared',
      spaceId: 'space-demo',
      id: 'rec-demo',
      revision: 1,
      kind: 'gratitude',
      payload: { text: 'Demo thanks' },
    });
  });

  it('keeps an explicit revision', () => {
    const envelope = makeEnvelope({
      scope: 'personal',
      id: 'rec-demo',
      revision: 4,
      kind: 'checkin',
      payload: {},
    });
    expect(envelope.revision).toBe(4);
    expect(envelope.scope).toBe('personal');
  });
});

describe('assertUploadable', () => {
  const base = { id: 'rec-demo', kind: 'gratitude', payload: {} };

  it('accepts a shared record that names its space', () => {
    expect(() =>
      assertUploadable(
        makeEnvelope({ ...base, scope: 'shared', spaceId: 'space-demo' }),
      ),
    ).not.toThrow();
  });

  it('refuses a personal record, even one labelled with a space', () => {
    for (const spaceId of [undefined, 'space-demo']) {
      expect(() =>
        assertUploadable(makeEnvelope({ ...base, scope: 'personal', spaceId })),
      ).toThrowError(/stay on this device/);
    }
  });

  it('refuses a shared record with no space', () => {
    expect(() =>
      assertUploadable(makeEnvelope({ ...base, scope: 'shared' })),
    ).toThrowError(/needs a shared space/);
  });
});
