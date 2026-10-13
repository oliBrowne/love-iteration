// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { createMemoryRepository, openDatabase } from '../../data/index.ts';
import { MemoriesPage } from './MemoriesPage.tsx';

afterEach(cleanup);

describe('Memories route', () => {
  it('opens the Memories page from #/memories', () => {
    window.location.hash = '#/memories';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Memories' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Memories link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Memories' });
    expect(link.getAttribute('href')).toBe('#/memories');
  });
});

describe('Memory composer', () => {
  async function renderPage() {
    const repo = createMemoryRepository(await openDatabase(new IDBFactory()));
    render(<MemoriesPage getRepository={async () => repo} />);
    return repo;
  }

  it('saves a memory with a title and date', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Memory title'), {
      target: { value: '  Demo: the lake walk  ' },
    });
    fireEvent.change(screen.getByLabelText('Memory date'), {
      target: { value: '2026-05-02' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.title).toBe('Demo: the lake walk');
    expect(stored[0]?.date).toBe('2026-05-02');
  });

  it('refuses a blank title', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Give this memory a title.',
    );
    expect(await repo.list()).toEqual([]);
  });

  it('refuses a missing date', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Memory title'), {
      target: { value: 'Demo' },
    });
    fireEvent.change(screen.getByLabelText('Memory date'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Pick a date.');
    expect(await repo.list()).toEqual([]);
  });

  it('keeps an optional note after reload', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Memory title'), {
      target: { value: 'Demo: the lake walk' },
    });
    fireEvent.change(screen.getByLabelText('Note (optional)'), {
      target: { value: '  Demo note about the sunset.  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    await screen.findByRole('status');
    expect((await repo.list())[0]?.note).toBe('Demo note about the sunset.');
    cleanup();
    render(<MemoriesPage getRepository={async () => repo} />);
    expect(await screen.findByText('Demo note about the sunset.')).toBeTruthy();
  });

  it('saves an empty note when none is given', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Memory title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save memory' }));
    await screen.findByRole('status');
    expect((await repo.list())[0]?.note).toBe('');
  });
});
