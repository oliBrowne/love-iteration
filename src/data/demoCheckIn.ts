import type { CheckIn } from '../domain/index.ts';

// Clearly labelled demo data for tests.
export const demoCheckIn: CheckIn = {
  id: 'demo-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  date: '2026-01-01',
  mood: 'good',
  note: 'Demo note',
};
