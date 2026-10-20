// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { createRitualRepository, openDatabase } from '../../data/index.ts';
import { RitualsPage } from './RitualsPage.tsx';

afterEach(cleanup);

describe('Rituals route', () => {
  it('opens the Rituals page from #/rituals', () => {
    window.location.hash = '#/rituals';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Rituals' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Rituals link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Rituals' });
    expect(link.getAttribute('href')).toBe('#/rituals');
  });
});

describe('Ritual form', () => {
  async function renderPage() {
    const repo = createRitualRepository(await openDatabase(new IDBFactory()));
    render(<RitualsPage getRepository={async () => repo} />);
    return repo;
  }

  it('creates a ritual from a name and cadence', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: '  Demo: Sunday call  ' },
    });
    fireEvent.change(screen.getByLabelText('Cadence'), {
      target: { value: 'weekly' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      name: 'Demo: Sunday call',
      cadence: 'weekly',
    });
    expect(screen.getByText('Demo: Sunday call')).toBeTruthy();
  });

  it('refuses a blank name', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Give this ritual a name.',
    );
    expect(await repo.list()).toEqual([]);
  });

  it('shows first-use copy until a ritual is saved', async () => {
    await renderPage();
    expect(await screen.findByText(/No rituals yet/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByRole('status');
    expect(screen.queryByText(/No rituals yet/)).toBeNull();
  });
});
