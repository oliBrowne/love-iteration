import { describe, expect, it } from 'vitest';
import { makeEnvelope, type SyncEnvelope } from './syncEnvelope.ts';

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
