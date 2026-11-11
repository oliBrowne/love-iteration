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
