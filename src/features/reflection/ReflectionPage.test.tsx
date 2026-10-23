// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { createReflectionRepository, openDatabase } from '../../data/index.ts';
import { weekStart } from '../../domain/index.ts';
import { ReflectionPage } from './ReflectionPage.tsx';

afterEach(cleanup);

describe('Reflection route', () => {
  it('opens the Reflection page from #/reflection', () => {
    window.location.hash = '#/reflection';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Reflection' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Reflection link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Reflection' });
    expect(link.getAttribute('href')).toBe('#/reflection');
  });
});

describe('Reflection week range', () => {
  it('shows the current week, Monday to Sunday', () => {
    window.location.hash = '#/reflection';
    render(<App />);
    expect(screen.getByText(/This week:/)).toBeTruthy();
    window.location.hash = '';
  });
});

describe('Reflection what-worked prompt', () => {
  async function renderPage() {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    return repo;
  }

  it('saves the response on submit for the current week', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('What worked this week?'), {
      target: { value: '  Demo: our Sunday call  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.whatWorked).toBe('Demo: our Sunday call');
    expect(stored[0]?.weekStart).toBe(weekStart());
  });

  it('does not save a blank response', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Write a few words before saving.',
    );
    expect(await repo.list()).toEqual([]);
  });
});

describe('Reflection what-was-hard prompt', () => {
  it('saves the response on submit', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.change(screen.getByLabelText('What was hard this week?'), {
      target: { value: ' Demo: the time difference ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored[0]?.whatWasHard).toBe('Demo: the time difference');
    expect(stored[0]?.whatWorked).toBeUndefined();
  });
});

describe('Reflection what-to-try prompt', () => {
  it('saves the response on submit', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.change(
      screen.getByLabelText('What would you like to try next week?'),
      { target: { value: ' Demo: a shared playlist ' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored[0]?.whatToTry).toBe('Demo: a shared playlist');
  });
});
