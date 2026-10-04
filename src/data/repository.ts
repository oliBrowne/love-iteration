import type { RecordMetadata } from '../domain/index.ts';

// The only way UI code reads or writes stored records.
export interface Repository<T extends RecordMetadata> {
  get(id: string): Promise<T | undefined>;
  list(): Promise<T[]>;
  put(record: T): Promise<void>;
  delete(id: string): Promise<void>;
}
