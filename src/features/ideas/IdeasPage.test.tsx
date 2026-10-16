// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { createIdeaRepository, openDatabase } from '../../data/index.ts';
import { IdeasPage } from './IdeasPage.tsx';

afterEach(cleanup);

describe('Ideas route', () => {
  it('opens the Ideas page from #/ideas', () => {
    window.location.hash = '#/ideas';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Ideas' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has an Ideas link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Ideas' });
    expect(link.getAttribute('href')).toBe('#/ideas');
  });
});

describe('New idea form', () => {
  async function renderPage() {
    const repo = createIdeaRepository(await openDatabase(new IDBFactory()));
    render(<IdeasPage getRepository={async () => repo} />);
    return repo;
  }

  it('creates a card from a valid title', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: '  Demo: picnic  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    expect(await screen.findByText('Demo: picnic')).toBeTruthy();
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ title: 'Demo: picnic', state: 'active' });
    expect(
      (screen.getByLabelText('Idea title') as HTMLInputElement).value,
    ).toBe('');
  });

  it('refuses a blank title', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Give this idea a title.',
    );
    expect(await repo.list()).toEqual([]);
  });

  it('shows the optional note on the card', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo: picnic' },
    });
    fireEvent.change(screen.getByLabelText('Note (optional)'), {
      target: { value: '  Demo note: bring a blanket.  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    expect(await screen.findByText('Demo note: bring a blanket.')).toBeTruthy();
    expect((await repo.list())[0]?.note).toBe('Demo note: bring a blanket.');
  });

  it('saves an empty note when none is given', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    expect((await repo.list())[0]?.note).toBe('');
  });

  it('shows first-use copy until an idea is saved', async () => {
    await renderPage();
    expect(await screen.findByText(/No ideas yet/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    expect(screen.queryByText(/No ideas yet/)).toBeNull();
  });

  it('moves an idea between active and completed', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    const active = screen.getByRole('region', { name: 'To do' });
    expect(active.textContent).toContain('Demo');
    fireEvent.click(screen.getByRole('button', { name: 'Mark done' }));
    const done = await screen.findByRole('region', { name: 'Done' });
    expect(done.textContent).toContain('Demo');
    expect(screen.queryByRole('region', { name: 'To do' })).toBeNull();
    expect((await repo.list())[0]?.state).toBe('completed');
    fireEvent.click(screen.getByRole('button', { name: 'Move back to to do' }));
    expect(await screen.findByRole('region', { name: 'To do' })).toBeTruthy();
    expect((await repo.list())[0]?.state).toBe('active');
  });
});
