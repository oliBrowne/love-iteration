import { pieces as registeredPieces, type Piece } from './registry';
import { useNearViewport } from './useNearViewport';
import { useReducedMotion } from '../useReducedMotion';

export function pieceHash(id: string): string {
  return `#/piece/${id}`;
}

function PieceCard({ piece }: { piece: Piece }) {
  const reducedMotion = useReducedMotion();
  const { ref, near } = useNearViewport<HTMLDivElement>();
  const Preview = piece.component;
  return (
    <li className="gallery-card">
      <a href={pieceHash(piece.id)} className="gallery-card-link">
        {/* The preview is decoration: the title and caption carry the meaning. */}
        <div ref={ref} className="gallery-preview" aria-hidden="true">
          {near ? <Preview reducedMotion={reducedMotion} /> : null}
        </div>
        <span className="gallery-card-title">{piece.title}</span>
        <span className="gallery-card-caption">{piece.caption}</span>
        <span className="gallery-card-medium">
          {piece.medium === 'ascii' ? 'ASCII' : '3D'}
        </span>
      </a>
    </li>
  );
}

/** The collection: one card per piece, each with a small live preview. */
export function GalleryHome({
  pieces = registeredPieces,
}: {
  pieces?: readonly Piece[];
}) {
  return (
    <section className="gallery" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Gallery</h2>
      {pieces.length === 0 ? (
        <p className="gallery-empty">
          The first pieces are on their way. Come back soon.
        </p>
      ) : (
        <ul className="gallery-grid">
          {pieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} />
          ))}
        </ul>
      )}
    </section>
  );
}
