// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LEAVE_MS, PiecePage } from './PiecePage';
import { parsePieceId } from './pieceRoute';
import type { Piece } from './registry';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.location.hash = '';
});

const demo: Piece[] = [
  {
    id: 'demo-one',
    title: 'Demo one',
    medium: 'ascii',
    caption: 'A first demo.',
    component: () => <span data-testid="piece">drawing</span>,
  },
];

describe('parsePieceId', () => {
  it('reads piece addresses only', () => {
    expect(parsePieceId('#/piece/demo-one')).toBe('demo-one');
    expect(parsePieceId('#/piece/demo-one/')).toBe('demo-one');
    expect(parsePieceId('#/settings')).toBeUndefined();
    expect(parsePieceId('#/piece/')).toBeUndefined();
    expect(parsePieceId('#/piece/%E0%A4%A')).toBeUndefined();
    expect(parsePieceId('')).toBeUndefined();
  });
});

describe('PiecePage', () => {
  it('shows the piece with its title and caption, and focuses the title', () => {
    render(<PiecePage id="demo-one" pieces={demo} />);
    expect(screen.getByTestId('piece')).toBeTruthy();
    const heading = screen.getByRole('heading', { name: 'Demo one' });
    expect(screen.getByText('A first demo.')).toBeTruthy();
    expect(document.activeElement).toBe(heading);
  });

  it('has a back link to the gallery', () => {
    render(<PiecePage id="demo-one" pieces={demo} />);
    const back = screen.getByRole('link', { name: /Back to the gallery/ });
    expect(back.getAttribute('href')).toBe('#/');
  });

  it('fades out softly, then goes back, on Escape or the back link', () => {
    vi.useFakeTimers();
    window.location.hash = '#/piece/demo-one';
    const { container } = render(<PiecePage id="demo-one" pieces={demo} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(container.querySelector('.piece-page-leaving')).not.toBeNull();
    expect(window.location.hash).toBe('#/piece/demo-one');
    act(() => {
      vi.advanceTimersByTime(LEAVE_MS);
    });
    expect(window.location.hash).toBe('#/');

    window.location.hash = '#/piece/demo-one';
    fireEvent.click(screen.getByRole('link', { name: /Back to the gallery/ }));
    expect(container.querySelector('.piece-page-leaving')).not.toBeNull();
  });

  it('goes back at once under reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }));
    window.location.hash = '#/piece/demo-one';
    const { container } = render(<PiecePage id="demo-one" pieces={demo} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(window.location.hash).toBe('#/');
    expect(container.querySelector('.piece-page-leaving')).toBeNull();
  });

  it('explains kindly when the piece does not exist', () => {
    render(<PiecePage id="nope" pieces={demo} />);
    expect(
      screen.getByRole('heading', { name: 'Piece not found' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /Back to the gallery/ }),
    ).toBeTruthy();
  });
});
