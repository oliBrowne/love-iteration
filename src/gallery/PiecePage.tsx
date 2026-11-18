import { useEffect, useRef } from 'react';
import { findPiece, pieces as registeredPieces, type Piece } from './registry';
import { galleryHash } from './pieceRoute';
import { useReducedMotion } from '../useReducedMotion';

/** One piece, full screen, with its title and caption and a way back (link or Escape). */
export function PiecePage({
  id,
  pieces = registeredPieces,
}: {
  id: string;
  pieces?: readonly Piece[];
}) {
  const reducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const piece = findPiece(id, pieces);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') window.location.hash = galleryHash;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const Piece = piece?.component;
  return (
    <div className="piece-page">
      {Piece ? (
        <div className="piece-stage">
          <Piece reducedMotion={reducedMotion} />
        </div>
      ) : null}
      <header className="piece-bar">
        <h1 ref={headingRef} tabIndex={-1} className="piece-title">
          {piece ? piece.title : 'Piece not found'}
        </h1>
        <p className="piece-caption">
          {piece
            ? piece.caption
            : 'That piece is not in the gallery. Head back to see what is.'}
        </p>
      </header>
      <a className="piece-back" href={galleryHash}>
        <span aria-hidden="true">← </span>Back to the gallery
      </a>
    </div>
  );
}
