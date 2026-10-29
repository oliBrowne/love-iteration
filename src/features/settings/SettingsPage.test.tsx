// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
import type { TimelineSources } from '../timeline/loadTimeline.ts';
import { SettingsPage } from './SettingsPage.tsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function makeSources(): Promise<TimelineSources> {
  const db = await openDatabase(new IDBFactory());
  return {
    checkIns: async () => createCheckInRepository(db),
    gratitude: async () => createGratitudeRepository(db),
    memories: async () => createMemoryRepository(db),
    plans: async () => createPlanRepository(db),
    ideas: async () => createIdeaRepository(db),
    rituals: async () => createRitualRepository(db),
    ritualCompletions: async () => createRitualCompletionRepository(db),
    reflections: async () => createReflectionRepository(db),
  };
}

describe('Export download', () => {
  it('saves a named local .json file', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:demo');
    URL.revokeObjectURL = vi.fn();
    let savedAs = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      savedAs = this.download;
    });
    render(<SettingsPage sources={await makeSources()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Download export' }));
    expect((await screen.findByRole('status')).textContent).toMatch(/saved/);
    expect(savedAs).toMatch(/^love-iteration-export-\d{4}-\d{2}-\d{2}\.json$/);
  });
});
