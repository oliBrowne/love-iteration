// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
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

describe('Export preview', () => {
  it('lists a count for each record kind', async () => {
    const sources = await makeSources();
    await (
      await sources.gratitude()
    ).put({
      id: 'g1',
      schemaVersion: 1,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
      text: 'Demo thanks',
      date: '2026-01-01',
    });
    render(<SettingsPage sources={sources} />);
    expect(await screen.findByText('Gratitude: 1')).toBeTruthy();
    expect(screen.getByText('Check-ins: 0')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });

  it('presents the counts as a privacy summary of this device', async () => {
    render(<SettingsPage sources={await makeSources()} />);
    expect(
      await screen.findByRole('list', {
        name: 'Records stored on this device',
      }),
    ).toBeTruthy();
    expect(screen.getByText(/Nothing is uploaded/)).toBeTruthy();
  });
});

describe('Import file chooser', () => {
  it('is a labelled native file input a keyboard can reach', async () => {
    render(<SettingsPage sources={await makeSources()} />);
    const input = screen.getByLabelText('Import file (.json)');
    expect(input.getAttribute('type')).toBe('file');
    expect(input.getAttribute('accept')).toContain('.json');
    expect(input.getAttribute('tabindex')).toBeNull();
  });
});

describe('Import preview', () => {
  it('shows incoming counts and rejects a bad file', async () => {
    render(<SettingsPage sources={await makeSources()} />);
    const input = screen.getByLabelText('Import file (.json)');
    const good = new File(
      [
        JSON.stringify({
          app: 'love-iteration',
          schemaVersion: 1,
          exportedAt: '2026-01-01T00:00:00.000Z',
          data: Object.fromEntries(
            [
              'checkIns',
              'gratitude',
              'memories',
              'plans',
              'ideas',
              'rituals',
              'ritualCompletions',
              'reflections',
            ].map((k) => [k, []]),
          ),
        }),
      ],
      'in.json',
    );
    fireEvent.change(input, { target: { files: [good] } });
    expect(await screen.findByText('The file contains:')).toBeTruthy();
    fireEvent.change(input, { target: { files: [new File(['x'], 'b.json')] } });
    await waitFor(() =>
      expect(screen.getByText('The file is not valid JSON.')).toBeTruthy(),
    );
  });
});

describe('Import confirmation', () => {
  it('writes nothing until the person confirms', async () => {
    const sources = await makeSources();
    render(<SettingsPage sources={sources} />);
    const keys = [
      'checkIns',
      'gratitude',
      'memories',
      'plans',
      'ideas',
      'rituals',
      'ritualCompletions',
      'reflections',
    ];
    const memory = {
      id: 'm1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Demo memory',
      date: '2026-01-01',
    };
    const file = new File(
      [
        JSON.stringify({
          app: 'love-iteration',
          schemaVersion: 1,
          exportedAt: '2026-01-01T00:00:00.000Z',
          data: Object.fromEntries(
            keys.map((k) => [k, k === 'memories' ? [memory] : []]),
          ),
        }),
      ],
      'in.json',
    );
    fireEvent.change(screen.getByLabelText('Import file (.json)'), {
      target: { files: [file] },
    });
    fireEvent.click(await screen.findByText('Import these records'));
    expect(await (await sources.memories()).list()).toHaveLength(0);
    expect(await screen.findByText(/1 new, 0 updated, 0 skipped/)).toBeTruthy();
    fireEvent.click(screen.getByText('Cancel'));
    expect(await (await sources.memories()).list()).toHaveLength(0);
    fireEvent.click(screen.getByText('Import these records'));
    fireEvent.click(await screen.findByText('Yes, import'));
    expect(
      await screen.findByText(
        'Your file was imported: 1 new, 0 updated, 0 skipped.',
      ),
    ).toBeTruthy();
    expect(await (await sources.memories()).list()).toHaveLength(1);
  });
});

describe('Delete all data', () => {
  it('explains local removal and deletes only after confirming', async () => {
    const sources = await makeSources();
    const repository = await sources.gratitude();
    await repository.put({
      id: 'g1',
      schemaVersion: 1,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
      text: 'Demo thanks',
      date: '2026-01-01',
    });
    render(<SettingsPage sources={sources} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete all data' }));
    expect(
      screen.getByText(/Delete every record stored on this device/),
    ).toBeTruthy();
    expect(await repository.list()).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await repository.list()).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Delete all data' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Yes, delete everything' }),
    );
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toMatch(/removed/),
    );
    expect(await repository.list()).toHaveLength(0);
  });
});

describe('Delete one kind', () => {
  it('removes the chosen kind after confirming and keeps the rest', async () => {
    const sources = await makeSources();
    const demo = {
      id: 'g1',
      schemaVersion: 1,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
      text: 'Demo thanks',
      date: '2026-01-01',
    };
    const gratitude = await sources.gratitude();
    await gratitude.put(demo);
    const memories = await sources.memories();
    await (memories.put as (record: unknown) => Promise<void>)({
      ...demo,
      id: 'm1',
    });
    render(<SettingsPage sources={sources} />);
    await screen.findByText('Gratitude: 1');
    fireEvent.change(screen.getByLabelText('Record kind'), {
      target: { value: 'gratitude' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Delete this kind' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Yes, delete this kind' }),
    );
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toMatch(/Gratitude/),
    );
    expect(await gratitude.list()).toHaveLength(0);
    expect(await memories.list()).toHaveLength(1);
    expect(screen.getByText('Memories: 1')).toBeTruthy();
  });
});

describe('Version', () => {
  it('shows the build version', async () => {
    render(<SettingsPage sources={await makeSources()} />);
    expect(screen.getByText(/^Version \d+\.\d+\.\d+/)).toBeTruthy();
  });
});
