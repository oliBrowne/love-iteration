import { AsciiCanvas } from '../../ascii/AsciiCanvas';
import { stillTimeAt } from '../../ascii/helpers';
import type { PieceProps } from '../../gallery/registry';
import { PHASES } from './boat';
import { paperBoatField } from './paperBoatField';

export const PAPER_BOAT_DESCRIPTION =
  'A small folded paper boat drifts across a slow river from left to right while the day passes: pale morning, golden hour, a rose and violet dusk, then a night of stars with a little lantern glowing on the boat. A fish leaps once, rings spread on the water, and the boat leaves the frame so the scene can begin again.';

/** The paper boat piece. Under reduced motion it holds the end of golden hour. */
export function PaperBoat({ reducedMotion }: PieceProps) {
  return (
    <AsciiCanvas
      field={paperBoatField}
      description={PAPER_BOAT_DESCRIPTION}
      reducedMotion={reducedMotion}
      stillTime={stillTimeAt(PHASES, 'golden hour')}
      background="#1d1a24"
    />
  );
}
