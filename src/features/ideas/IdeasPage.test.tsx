// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import {
  createIdeaRepository,
  createPlanRepository,
  openDatabase,
} from '../../data/index.ts';
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
  let plans: ReturnType<typeof createPlanRepository>;

  async function renderPage() {
    const db = await openDatabase(new IDBFactory());
    const repo = createIdeaRepository(db);
    plans = createPlanRepository(db);
    render(
      <IdeasPage
        getRepository={async () => repo}
        getPlanRepo={async () => plans}
      />,
    );
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

  it('saves a category with the idea', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    expect((await repo.list())[0]?.category).toBe('other');
  });

  it('lets a category be chosen with the keyboard-reachable select', async () => {
    const repo = await renderPage();
    const select = screen.getByLabelText('Category') as HTMLSelectElement;
    expect(select.tagName).toBe('SELECT');
    fireEvent.change(select, { target: { value: 'trip' } });
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    expect(screen.getAllByText('Trip').length).toBeGreaterThan(1);
    expect((await repo.list())[0]?.category).toBe('trip');
    expect(select.value).toBe('other');
  });

  it('limits cards to the selected category', async () => {
    await renderPage();
    for (const [name, value] of [
      ['Demo trip', 'trip'],
      ['Demo outing', 'outing'],
    ] as const) {
      fireEvent.change(screen.getByLabelText('Category'), {
        target: { value },
      });
      fireEvent.change(screen.getByLabelText('Idea title'), {
        target: { value: name },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
      await screen.findByText(name);
    }
    fireEvent.change(screen.getByLabelText('Show category'), {
      target: { value: 'trip' },
    });
    expect(screen.getByText('Demo trip')).toBeTruthy();
    expect(screen.queryByText('Demo outing')).toBeNull();
    fireEvent.change(screen.getByLabelText('Show category'), {
      target: { value: '' },
    });
    expect(screen.getByText('Demo outing')).toBeTruthy();
  });

  it('shows only ideas whose title or note match the search', async () => {
    await renderPage();
    for (const [name, text] of [
      ['Demo picnic', 'blanket'],
      ['Demo film', 'popcorn'],
    ] as const) {
      fireEvent.change(screen.getByLabelText('Idea title'), {
        target: { value: name },
      });
      fireEvent.change(screen.getByLabelText('Note (optional)'), {
        target: { value: text },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
      await screen.findByText(name);
    }
    fireEvent.change(screen.getByLabelText('Search ideas'), {
      target: { value: 'POPCORN' },
    });
    expect(screen.getByText('Demo film')).toBeTruthy();
    expect(screen.queryByText('Demo picnic')).toBeNull();
    fireEvent.change(screen.getByLabelText('Search ideas'), {
      target: { value: 'picn' },
    });
    expect(screen.getByText('Demo picnic')).toBeTruthy();
    expect(screen.queryByText('Demo film')).toBeNull();
  });

  it('returns the full list when search is cleared', async () => {
    await renderPage();
    for (const name of ['Demo picnic', 'Demo film']) {
      fireEvent.change(screen.getByLabelText('Idea title'), {
        target: { value: name },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
      await screen.findByText(name);
    }
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    fireEvent.change(screen.getByLabelText('Search ideas'), {
      target: { value: 'film' },
    });
    expect(screen.queryByText('Demo picnic')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByText('Demo picnic')).toBeTruthy();
    expect(screen.getByText('Demo film')).toBeTruthy();
    expect(
      (screen.getByLabelText('Search ideas') as HTMLInputElement).value,
    ).toBe('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('shows counts that match the repository', async () => {
    const repo = await renderPage();
    for (const name of ['Demo one', 'Demo two']) {
      fireEvent.change(screen.getByLabelText('Idea title'), {
        target: { value: name },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
      await screen.findByText(name);
    }
    expect(screen.getByLabelText('Idea counts').textContent).toBe(
      '2 to do · 0 done',
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Mark done' })[0]!);
    await screen.findByRole('region', { name: 'Done' });
    const stored = await repo.list();
    const done = stored.filter((i) => i.state === 'completed').length;
    expect(screen.getByLabelText('Idea counts').textContent).toBe(
      `${stored.length - done} to do · ${done} done`,
    );
    expect(done).toBe(1);
  });

  it('gives an idea a date and time', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    fireEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    fireEvent.change(screen.getByLabelText('Date and time'), {
      target: { value: '2026-02-14T19:00' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save date' }));
    await screen.findByText(/Scheduled for/);
    const saved = await plans.list();
    const [idea] = await repo.list();
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ ideaId: idea?.id, status: 'planned' });
    expect(saved[0]?.startsAt).toBe(new Date(2026, 1, 14, 19, 0).toISOString());
  });

  it('lists future plans soonest first', async () => {
    await renderPage();
    for (const [name, when] of [
      ['Demo later', '2099-05-01T10:00'],
      ['Demo sooner', '2098-05-01T10:00'],
    ] as const) {
      fireEvent.change(screen.getByLabelText('Idea title'), {
        target: { value: name },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
      await screen.findByText(name);
      const card = screen.getByText(name).closest('li')!;
      fireEvent.click(within(card).getByRole('button', { name: 'Schedule' }));
      fireEvent.change(within(card).getByLabelText('Date and time'), {
        target: { value: when },
      });
      fireEvent.click(within(card).getByRole('button', { name: 'Save date' }));
      await within(card).findByText(/Scheduled for/);
    }
    const section = await screen.findByRole('region', {
      name: 'Upcoming plans',
    });
    await waitFor(() =>
      expect(within(section).getAllByRole('listitem')).toHaveLength(2),
    );
    const titles = within(section)
      .getAllByRole('listitem')
      .map((li) => li.querySelector('strong')?.textContent);
    expect(titles).toEqual(['Demo sooner', 'Demo later']);
  });

  it('refuses an impossible date and time', async () => {
    await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    fireEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save date' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Choose a real day and time.',
    );
    expect(await plans.list()).toEqual([]);
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

  async function addDemo() {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    fireEvent.click(screen.getByRole('button', { name: 'Edit idea' }));
    return repo;
  }

  it('persists edits to title and note', async () => {
    const repo = await addDemo();
    fireEvent.change(screen.getByLabelText('Edit title'), {
      target: { value: '  Demo: renamed  ' },
    });
    fireEvent.change(screen.getByLabelText('Edit note'), {
      target: { value: 'Demo edited note.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await screen.findByText('Demo edited note.');
    expect((await repo.list())[0]).toMatchObject({
      title: 'Demo: renamed',
      note: 'Demo edited note.',
    });
    cleanup();
    render(<IdeasPage getRepository={async () => repo} />);
    expect(await screen.findByText('Demo: renamed')).toBeTruthy();
  });

  it('refuses a blank edited title and keeps the original', async () => {
    const repo = await addDemo();
    fireEvent.change(screen.getByLabelText('Edit title'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await screen.findByRole('alert');
    expect((await repo.list())[0]?.title).toBe('Demo');
  });

  async function addAndAskDelete() {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Idea title'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }));
    await screen.findByText('Demo');
    fireEvent.click(screen.getByRole('button', { name: 'Delete idea' }));
    return repo;
  }

  it('keeps the card when delete is cancelled', async () => {
    const repo = await addAndAskDelete();
    expect(screen.getByText(/This cannot be undone/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('Demo')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Delete idea' })).toBeTruthy();
    expect(await repo.list()).toHaveLength(1);
  });

  it('removes the card after confirmation', async () => {
    const repo = await addAndAskDelete();
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }));
    await waitFor(() => expect(screen.queryByText('Demo')).toBeNull());
    expect(await repo.list()).toEqual([]);
  });
});
