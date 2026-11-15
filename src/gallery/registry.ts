import type { ComponentType } from 'react';

export type PieceMedium = 'ascii' | 'three';

/** Props every piece component receives. Pieces hold a still when `reducedMotion` is true. */
export interface PieceProps {
  reducedMotion: boolean;
}

export interface Piece {
  /** Stable lowercase slug, used in the address (`#/piece/<id>`). */
  id: string;
  title: string;
  medium: PieceMedium;
  /** One short line shown under the title and read out for screen readers. */
  caption: string;
  component: ComponentType<PieceProps>;
}

/** The one list of pieces. Add a new piece here when it meets the craft bar in README.md. */
export const pieces: readonly Piece[] = [];

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Returns a message for every problem in a list of pieces; empty means the list is valid. */
export function checkPieces(list: readonly Piece[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const piece of list) {
    if (!ID_PATTERN.test(piece.id))
      problems.push(`"${piece.id}" is not a lowercase slug`);
    if (seen.has(piece.id)) problems.push(`"${piece.id}" is used twice`);
    seen.add(piece.id);
    if (!piece.title.trim()) problems.push(`"${piece.id}" needs a title`);
    if (!piece.caption.trim()) problems.push(`"${piece.id}" needs a caption`);
    if (piece.medium !== 'ascii' && piece.medium !== 'three') {
      problems.push(`"${piece.id}" has an unknown medium`);
    }
  }
  return problems;
}

export function findPiece(
  id: string,
  list: readonly Piece[] = pieces,
): Piece | undefined {
  return list.find((piece) => piece.id === id);
}
