// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import { createCheckInRepository, openDatabase } from '../../data/index.ts';
import { localDate } from '../../domain/index.ts';
import { CheckInPage } from './CheckInPage.tsx';

afterEach(cleanup);

async function renderPage() {
  const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
  const getRepository = async () => repo;
  render(<CheckInPage getRepository={getRepository} />);
  return repo;
}

describe('CheckInPage note field', () => {
  it('starts empty and is not required', async () => {
    await renderPage();
    const note = screen.getByLabelText(
      'Note (optional)',
    ) as HTMLTextAreaElement;
    expect(note.value).toBe('');
    expect(note.required).toBe(false);
  });

  it('accepts plain text', async () => {
    await renderPage();
    const note = screen.getByLabelText(
      'Note (optional)',
    ) as HTMLTextAreaElement;
    fireEvent.change(note, { target: { value: 'Demo <b>note</b>' } });
    expect(note.value).toBe('Demo <b>note</b>');
  });
});

describe('CheckInPage submit', () => {
  it('shows the saved check-in in the view and stores it', async () => {
    const repo = await renderPage();
    expect(await screen.findByText('Nothing saved yet.')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: 'Good' }));
    fireEvent.change(screen.getByLabelText('Note (optional)'), {
      target: { value: 'Demo <b>note</b>' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save check-in' }));
    const item = await screen.findByRole('listitem');
    expect(item.textContent).toContain('Good');
    expect(item.textContent).toContain('Demo <b>note</b>');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.mood).toBe('good');
    expect(
      (screen.getByLabelText('Note (optional)') as HTMLTextAreaElement).value,
    ).toBe('');
  });
});

describe('CheckInPage empty mood', () => {
  it('shows an inline error and saves nothing', async () => {
    const repo = await renderPage();
    await screen.findByText('Nothing saved yet.');
    fireEvent.click(screen.getByRole('button', { name: 'Save check-in' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Pick a mood before saving.',
    );
    expect(await repo.list()).toEqual([]);
    expect(screen.getByText('Nothing saved yet.')).toBeTruthy();
  });

  it('clears the error once a mood is chosen', async () => {
    await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save check-in' }));
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('radio', { name: 'Okay' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('CheckInPage note limit', () => {
  it('shows the remaining characters and blocks saving when over', async () => {
    const repo = await renderPage();
    expect(screen.getByText('500 characters remaining.')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: 'Good' }));
    fireEvent.change(screen.getByLabelText('Note (optional)'), {
      target: { value: 'x'.repeat(503) },
    });
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Note is 3 characters over the limit.',
    );
    const save = screen.getByRole('button', {
      name: 'Save check-in',
    }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    fireEvent.click(save);
    expect(await repo.list()).toEqual([]);
  });
});

describe('CheckInPage one per day', () => {
  it('updates today’s record on a repeat save', async () => {
    const repo = await renderPage();
    await screen.findByText('Nothing saved yet.');
    fireEvent.click(screen.getByRole('radio', { name: 'Good' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save check-in' }));
    await screen.findByRole('listitem');
    const [first] = await repo.list();
    fireEvent.click(screen.getByRole('radio', { name: 'Low' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save check-in' }));
    await screen.findByText(/Low/);
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.id).toBe(first?.id);
    expect(stored[0]?.createdAt).toBe(first?.createdAt);
    expect(stored[0]?.mood).toBe('low');
  });
});

describe('CheckInPage edit today', () => {
  it('fills the form with today’s saved values', async () => {
    const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
    await repo.put({
      id: 'today',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      date: localDate(),
      mood: 'good',
      note: 'Demo note',
    });
    render(<CheckInPage getRepository={async () => repo} />);
    await screen.findByRole('listitem');
    expect(
      (screen.getByRole('radio', { name: 'Good' }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (screen.getByLabelText('Note (optional)') as HTMLTextAreaElement).value,
    ).toBe('Demo note');
  });
});

describe('CheckInPage privacy copy', () => {
  it('states that entries stay on this device', async () => {
    await renderPage();
    expect(screen.getByText(/entries stay on this device/i)).toBeTruthy();
  });
});
