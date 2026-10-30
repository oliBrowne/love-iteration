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
    fireEvent.click(screen.getByText('Cancel'));
    expect(await (await sources.memories()).list()).toHaveLength(0);
    fireEvent.click(screen.getByText('Import these records'));
    fireEvent.click(screen.getByText('Yes, import'));
    expect(await screen.findByText('Your file was imported.')).toBeTruthy();
    expect(await (await sources.memories()).list()).toHaveLength(1);
  });
});
