import { describe, expect, it } from 'vitest';
import { checkPieces, findPiece, pieces, type Piece } from './registry';

const still = () => null;
const make = (over: Partial<Piece> = {}): Piece => ({
  id: 'paper-boat',
  title: 'Paper boat',
  medium: 'ascii',
  caption: 'A boat on a slow river.',
  component: still,
  ...over,
});

describe('piece registry', () => {
  it('ships a valid list', () => {
    expect(checkPieces(pieces)).toEqual([]);
  });

  it('accepts a complete piece and finds it by id', () => {
    const list = [make(), make({ id: 'lanterns', medium: 'three' })];
    expect(checkPieces(list)).toEqual([]);
    expect(findPiece('lanterns', list)?.medium).toBe('three');
    expect(findPiece('missing', list)).toBeUndefined();
  });

  it('reports bad ids, duplicates, and missing words', () => {
    const problems = checkPieces([
      make(),
      make(),
      make({ id: 'Bad Id', title: ' ', caption: '' }),
    ]);
    expect(problems).toEqual([
      '"paper-boat" is used twice',
      '"Bad Id" is not a lowercase slug',
      '"Bad Id" needs a title',
      '"Bad Id" needs a caption',
    ]);
  });
});
