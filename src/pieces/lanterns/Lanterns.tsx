import { stillTimeAt } from '../../ascii/helpers';
import type { PieceProps } from '../../gallery/registry';
import { ThreeStage } from '../../three/ThreeStage';
import { PHASES } from './lanterns';
import { setupLanterns } from './lanternsScene';

export const LANTERNS_DESCRIPTION =
  'Over soft hills at dusk, paper lanterns are lit one by one and drift up into the sky. As the sky deepens to night and stars come out, a crowd of them lifts off together past a pale moon, then they fade out of sight at the top. A tap or swipe on the sky nudges the nearby lanterns, which glow brighter and bob back to their path.';

const STILL_TIME = stillTimeAt(PHASES, 'release') + 2;

/** The drifting lanterns piece. Under reduced motion it holds the crowd mid-release. */
export function Lanterns({ reducedMotion }: PieceProps) {
  return (
    <ThreeStage
      setup={setupLanterns}
      description={LANTERNS_DESCRIPTION}
      reducedMotion={reducedMotion}
      stillTime={STILL_TIME}
    />
  );
}
