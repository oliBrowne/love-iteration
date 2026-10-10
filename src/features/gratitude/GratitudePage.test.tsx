// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import { formatDateLabel } from '../../domain/index.ts';
import App from '../../App.tsx';
import { createGratitudeRepository, openDatabase } from '../../data/index.ts';
import { GratitudePage } from './GratitudePage.tsx';

afterEach(cleanup);

async function renderPage() {
  const repo = createGratitudeRepository(await openDatabase(new IDBFactory()));
  render(<GratitudePage getRepository={async () => repo} />);
  return repo;
}

describe('Gratitude route', () => {
  it('opens the Gratitude page from #/gratitude', () => {
    window.location.hash = '#/gratitude';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Gratitude' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Gratitude' })).toBeTruthy();
    window.location.hash = '';
  });
});

describe('Gratitude composer', () => {
  it('saves one appreciation and clears the field', async () => {
    const repo = await renderPage();
    const field = screen.getByLabelText(
      'What are you grateful for?',
    ) as HTMLTextAreaElement;
    fireEvent.change(field, { target: { value: '  Demo: the voice note  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save appreciation' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.text).toBe('Demo: the voice note');
    expect(field.value).toBe('');
  });

  it('refuses blank text with an inline message', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save appreciation' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Write a few words to save.',
    );
    expect(await repo.list()).toEqual([]);
  });
});

describe('Gratitude empty state', () => {
  it('suggests a first entry, then goes away once one is saved', async () => {
    await renderPage();
    expect((await screen.findByText(/Nothing here yet/)).textContent).toContain(
      'Start with one small thing',
    );
    fireEvent.change(screen.getByLabelText('What are you grateful for?'), {
      target: { value: 'Demo thanks' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save appreciation' }));
    await screen.findByRole('status');
    expect(screen.queryByText(/Nothing here yet/)).toBeNull();
  });
});

describe('Gratitude cards', () => {
  it('shows each saved entry’s text and date, newest first', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    const base = {
      schemaVersion: 1,
      updatedAt: '2026-03-02T09:00:00.000Z',
    };
    await repo.put({
      ...base,
      id: 'a',
      createdAt: '2026-03-01T09:00:00.000Z',
      date: '2026-03-01',
      text: 'Demo: older thanks',
    });
    await repo.put({
      ...base,
      id: 'b',
      createdAt: '2026-03-02T09:00:00.000Z',
      date: '2026-03-02',
      text: 'Demo: newer thanks',
    });
    render(<GratitudePage getRepository={async () => repo} />);
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toContain('Demo: newer thanks');
    expect(items[0]?.textContent).toContain(formatDateLabel('2026-03-02'));
    expect(items[1]?.textContent).toContain('Demo: older thanks');
  });
});
