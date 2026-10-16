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
});
