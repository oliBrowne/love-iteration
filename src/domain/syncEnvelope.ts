import { DomainError } from './errors.ts';

// The wrapper every record travels in when sharing is on. Only "shared"
// records may ever be sent; "personal" records never leave the device.
export type SyncScope = 'personal' | 'shared';

export type SyncEnvelope = {
  scope: SyncScope;
  // Id of the shared space this record belongs to (shared scope only).
  spaceId?: string;
  id: string;
  // Starts at 1 and goes up by one on every accepted change.
  revision: number;
  // Which kind of record the payload is, e.g. "gratitude".
  kind: string;
  // The record itself, already validated by its own domain rules.
  payload: Record<string, unknown>;
  deleted?: boolean;
};

export function makeEnvelope(
  input: Omit<SyncEnvelope, 'revision'> & { revision?: number },
): SyncEnvelope {
  return { ...input, revision: input.revision ?? 1 };
}

// Throws unless the envelope may be uploaded. A personal record is never
// uploaded, even if someone labels it with a space; a shared one must name
// the space it belongs to.
export function assertUploadable(envelope: SyncEnvelope): void {
  if (envelope.scope !== 'shared') {
    throw new DomainError(
      'personal_not_uploadable',
      'Personal records stay on this device.',
    );
  }
  if (!envelope.spaceId) {
    throw new DomainError(
      'missing_space',
      'A shared record needs a shared space.',
    );
  }
}
