// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import {
  createCheckInRepository,
  createGratitudeRepository,
  createIdeaRepository,
  createMemoryRepository,
  createPlanRepository,
  createReflectionRepository,
  createRitualCompletionRepository,
  createRitualRepository,
  openDatabase,
} from '../../data/index.ts';
import { TimelinePage } from './TimelinePage.tsx';
import type { TimelineSources } from './loadTimeline.ts';

afterEach(cleanup);

async function makeSources() {
  const db = await openDatabase(new IDBFactory());
  const sources: TimelineSources = {
    checkIns: async () => createCheckInRepository(db),
    gratitude: async () => createGratitudeRepository(db),
    memories: async () => createMemoryRepository(db),
    plans: async () => createPlanRepository(db),
    ideas: async () => createIdeaRepository(db),
    rituals: async () => createRitualRepository(db),
    ritualCompletions: async () => createRitualCompletionRepository(db),
    reflections: async () => createReflectionRepository(db),
  };
  return sources;
}

describe('Timeline route', () => {
  it('opens the Timeline page from #/timeline', () => {
    window.location.hash = '#/timeline';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Timeline' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Timeline link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Timeline' });
    expect(link.getAttribute('href')).toBe('#/timeline');
  });
});

describe('Timeline feed', () => {
  it('lists saved records newest first', async () => {
    const sources = await makeSources();
    const memories = await sources.memories();
    const base = { schemaVersion: 1, note: '' } as const;
    await memories.put({
      ...base,
      id: 'a',
      title: 'Demo: older',
      date: '2026-01-01',
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
    });
    await memories.put({
      ...base,
      id: 'b',
      title: 'Demo: newer',
      date: '2026-02-01',
      createdAt: '2026-02-01T10:00:00.000Z',
      updatedAt: '2026-02-01T10:00:00.000Z',
    });
    render(<TimelinePage sources={sources} />);
    await screen.findByText('Demo: newer');
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items[0]).toContain('Demo: newer');
    expect(items[1]).toContain('Demo: older');
  });
});
