import { useEffect, useRef, useState } from 'react';
import { findPiece, pieces as registeredPieces, type Piece } from './registry';
import { galleryHash } from './pieceRoute';
import { useReducedMotion } from '../useReducedMotion';

/** How long the fade-out lasts before we go back, in milliseconds (matches the CSS). */
export const LEAVE_MS = 280;

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
  const [leaving, setLeaving] = useState(false);

  // Fade out softly, then go back. With reduced motion, go back at once.
  const leave = () => {
    if (reducedMotion) window.location.hash = galleryHash;
    else setLeaving(true);
  };
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      window.location.hash = galleryHash;
    }, LEAVE_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') leave();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const Piece = piece?.component;
  return (
    <div className={leaving ? 'piece-page piece-page-leaving' : 'piece-page'}>
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
      <a
        className="piece-back"
        href={galleryHash}
        onClick={(event) => {
          event.preventDefault();
          leave();
        }}
      >
        <span aria-hidden="true">← </span>Back to the gallery
      </a>
    </div>
  );
}
