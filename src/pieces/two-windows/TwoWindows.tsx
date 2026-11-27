import { AsciiCanvas } from '../../ascii/AsciiCanvas';
import type { PieceProps } from '../../gallery/registry';
import { STILL_TIME } from './windows';
import { twoWindowsField } from './twoWindowsField';

export const TWO_WINDOWS_DESCRIPTION =
  'Night falls over a dark landscape. Far apart, on a hill at the left and a hill at the right, two small houses light their windows one after the other, and smoke curls from the right chimney. The stars come out over both. Then one slow shooting star arcs from above the left window to above the right, and each window glows a little brighter as it passes. Sparkles bloom where it ends, the stars settle, the windows go quiet, and dusk returns.';

/** Two lit windows under one sky. Under reduced motion it holds the shooting star mid-sky. */
export function TwoWindows({ reducedMotion }: PieceProps) {
  return (
    <AsciiCanvas
      field={twoWindowsField}
      description={TWO_WINDOWS_DESCRIPTION}
      reducedMotion={reducedMotion}
      stillTime={STILL_TIME}
      background="#0a0c1f"
    />
  );
}
