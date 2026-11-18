// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GalleryHome, pieceHash } from './GalleryHome';
import type { Piece } from './registry';

afterEach(cleanup);

const demo: Piece[] = [
  {
    id: 'demo-one',
    title: 'Demo one',
    medium: 'ascii',
    caption: 'A first demo.',
    component: ({ reducedMotion }) => (
      <span data-testid="preview">{reducedMotion ? 'still' : 'live'}</span>
    ),
  },
  {
    id: 'demo-two',
    title: 'Demo two',
    medium: 'three',
    caption: 'A second demo.',
    component: () => <span>two</span>,
  },
];

describe('GalleryHome', () => {
  it('shows a card per piece, linking to it, with a live preview', () => {
    render(<GalleryHome pieces={demo} />);
    const link = screen.getByRole('link', { name: /Demo one/ });
    expect(link.getAttribute('href')).toBe(pieceHash('demo-one'));
    expect(screen.getByText('A first demo.')).toBeTruthy();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getAllByTestId('preview')).toHaveLength(1);
  });

  it('shows a gentle message while the collection is empty', () => {
    render(<GalleryHome pieces={[]} />);
    expect(screen.getByText(/first pieces are on their way/)).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
