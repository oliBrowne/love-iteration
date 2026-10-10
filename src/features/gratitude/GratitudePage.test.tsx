// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
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
