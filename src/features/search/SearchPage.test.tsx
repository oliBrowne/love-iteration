// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
import { SearchPage } from './SearchPage.tsx';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

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

describe('Search route', () => {
  it('opens the Search page from #/search', () => {
    window.location.hash = '#/search';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Search' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Search link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Search' });
    expect(link.getAttribute('href')).toBe('#/search');
  });
});

describe('Search results', () => {
  it('shows entries whose text matches the query, ignoring case', async () => {
    const sources = await makeSources();
    const gratitude = await sources.gratitude();
    const base = {
      schemaVersion: 1,
      createdAt: '2026-03-02T10:00:00.000Z',
      updatedAt: '2026-03-02T10:00:00.000Z',
    };
    await gratitude.put({
      ...base,
      id: 'a',
      date: '2026-03-02',
      text: 'Demo: a Sunny walk',
    });
    await gratitude.put({
      ...base,
      id: 'b',
      date: '2026-03-03',
      text: 'Demo: quiet tea',
    });
    render(<SearchPage sources={sources} />);
    const input = screen.getByLabelText('Search your entries');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    fireEvent.change(input, { target: { value: 'SUNNY' } });
    expect(await screen.findByText('Demo: a Sunny walk')).toBeTruthy();
    expect(screen.queryByText('Demo: quiet tea')).toBeNull();
  });

  it('labels results by their kind', async () => {
    const sources = await makeSources();
    const base = {
      schemaVersion: 1,
      createdAt: '2026-03-02T10:00:00.000Z',
      updatedAt: '2026-03-02T10:00:00.000Z',
    };
    await (
      await sources.gratitude()
    ).put({ ...base, id: 'g', date: '2026-03-02', text: 'Demo: lake day' });
    await (
      await sources.memories()
    ).put({
      ...base,
      id: 'm',
      date: '2026-03-01',
      title: 'Demo lake trip',
      note: '',
    });
    render(<SearchPage sources={sources} />);
    fireEvent.change(screen.getByLabelText('Search your entries'), {
      target: { value: 'lake' },
    });
    expect(
      await screen.findByRole('heading', { name: 'Gratitude' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Memories' })).toBeTruthy();
  });

  it('says so when nothing matches, and not before typing', async () => {
    render(<SearchPage sources={await makeSources()} />);
    expect(screen.queryByText(/Nothing matches/)).toBeNull();
    fireEvent.change(screen.getByLabelText('Search your entries'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText(/Nothing matches/)).toBeTruthy();
  });

  it('clears the query and the results', async () => {
    const sources = await makeSources();
    await (
      await sources.gratitude()
    ).put({
      schemaVersion: 1,
      createdAt: '2026-03-02T10:00:00.000Z',
      updatedAt: '2026-03-02T10:00:00.000Z',
      id: 'g',
      date: '2026-03-02',
      text: 'Demo: lake day',
    });
    render(<SearchPage sources={sources} />);
    const input = screen.getByLabelText<HTMLInputElement>(
      'Search your entries',
    );
    fireEvent.change(input, { target: { value: 'lake' } });
    await screen.findByText('Demo: lake day');
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input.value).toBe('');
    expect(screen.queryByText('Demo: lake day')).toBeNull();
  });

  it('focuses the search box when "/" is pressed outside a field', async () => {
    render(<SearchPage sources={await makeSources()} />);
    const input = screen.getByLabelText('Search your entries');
    expect(document.activeElement).not.toBe(input);
    fireEvent.keyDown(document.body, { key: '/' });
    expect(document.activeElement).toBe(input);
  });

  it('tells you the search stays on this device', async () => {
    render(<SearchPage sources={await makeSources()} />);
    expect(screen.getByText(/stays on this device/)).toBeTruthy();
  });
});
