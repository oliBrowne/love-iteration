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
  it('explains the timeline when nothing is saved yet', async () => {
    render(<TimelinePage sources={await makeSources()} />);
    expect(await screen.findByText(/Nothing here yet/)).toBeTruthy();
  });

  it('hides the explanation once there is an entry', async () => {
    const sources = await makeSources();
    await (
      await sources.gratitude()
    ).put({
      id: 'g',
      schemaVersion: 1,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
      text: 'Demo thanks',
      date: '2026-01-01',
    });
    render(<TimelinePage sources={sources} />);
    await screen.findByText('Demo thanks');
    expect(screen.queryByText(/Nothing here yet/)).toBeNull();
  });

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
    expect(
      screen.getByRole('link', { name: 'Demo: newer' }).getAttribute('href'),
    ).toBe('#/memories');
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items[0]).toContain('Demo: newer');
    expect(items[1]).toContain('Demo: older');
  });

  it('limits the feed to the selected kinds', async () => {
    const sources = await makeSources();
    const stamp = '2026-01-01T10:00:00.000Z';
    await (
      await sources.gratitude()
    ).put({
      id: 'g',
      schemaVersion: 1,
      createdAt: stamp,
      updatedAt: stamp,
      text: 'Demo thanks',
      date: '2026-01-01',
    });
    await (
      await sources.memories()
    ).put({
      id: 'm',
      schemaVersion: 1,
      createdAt: stamp,
      updatedAt: stamp,
      title: 'Demo memory',
      note: '',
      date: '2026-01-01',
    });
    render(<TimelinePage sources={sources} />);
    await screen.findByText('Demo thanks');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Memories' }));
    expect(screen.queryByText('Demo thanks')).toBeNull();
    expect(screen.getByText('Demo memory')).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Memories' }));
    expect(screen.getByText('Demo thanks')).toBeTruthy();
  });

  it('hides entries outside the chosen dates', async () => {
    const sources = await makeSources();
    const memories = await sources.memories();
    for (const [id, date] of [
      ['a', '2026-01-01'],
      ['b', '2026-02-01'],
    ] as const) {
      await memories.put({
        id,
        schemaVersion: 1,
        createdAt: `${date}T10:00:00.000Z`,
        updatedAt: `${date}T10:00:00.000Z`,
        title: `Demo ${id}`,
        note: '',
        date,
      });
    }
    render(<TimelinePage sources={sources} />);
    await screen.findByText('Demo a');
    fireEvent.change(screen.getByLabelText('From'), {
      target: { value: '2026-02-01' },
    });
    expect(screen.queryByText('Demo a')).toBeNull();
    expect(screen.getByText('Demo b')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('To'), {
      target: { value: '2026-01-15' },
    });
    expect(screen.queryByText('Demo b')).toBeNull();
  });

  it('brings every entry back when filters are cleared', async () => {
    const sources = await makeSources();
    const stamp = '2026-01-01T10:00:00.000Z';
    await (
      await sources.gratitude()
    ).put({
      id: 'g',
      schemaVersion: 1,
      createdAt: stamp,
      updatedAt: stamp,
      text: 'Demo thanks',
      date: '2026-01-01',
    });
    render(<TimelinePage sources={sources} />);
    await screen.findByText('Demo thanks');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Memories' }));
    fireEvent.change(screen.getByLabelText('From'), {
      target: { value: '2026-05-01' },
    });
    expect(screen.queryByText('Demo thanks')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('Demo thanks')).toBeTruthy();
    expect(
      (screen.getByRole('checkbox', { name: 'Memories' }) as HTMLInputElement)
        .checked,
    ).toBe(false);
    expect((screen.getByLabelText('From') as HTMLInputElement).value).toBe('');
  });

  it('loads 30 entries at a time', async () => {
    const sources = await makeSources();
    const gratitude = await sources.gratitude();
    for (let i = 0; i < 31; i += 1) {
      const stamp = `2026-01-01T10:00:${String(i).padStart(2, '0')}.000Z`;
      await gratitude.put({
        id: `g${String(i).padStart(2, '0')}`,
        schemaVersion: 1,
        createdAt: stamp,
        updatedAt: stamp,
        text: `Demo thanks ${i}`,
        date: '2026-01-01',
      });
    }
    render(<TimelinePage sources={sources} />);
    await screen.findByText('Demo thanks 30');
    expect(screen.getAllByRole('listitem')).toHaveLength(30);
    expect(screen.queryByText('Demo thanks 0')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(31);
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
  });
});
