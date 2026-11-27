import { easeInOut, mix, type Phase } from '../../ascii/helpers';

export type Rgb = readonly [number, number, number];

/** Dusk, deep night, the shooting star, then a quiet fade that leads back to dusk. */
export const PHASES: readonly Phase[] = [
  { name: 'dusk', seconds: 8 },
  { name: 'night', seconds: 8 },
  { name: 'shooting star', seconds: 8 },
  { name: 'quiet', seconds: 8 },
];

export const PERIOD = PHASES.reduce((sum, phase) => sum + phase.seconds, 0);

/** Seconds into the loop when the shooting star starts, and how long it takes to cross. */
export const STAR_AT = 17;
export const STAR_SECONDS = 6;
/** A composed moment for reduced motion: the star is mid-sky and both windows are lit. */
export const STILL_TIME = 20.4;

export type Keys = readonly (readonly [number, number])[];

/** Eases between keyed values (time, value). Times wrap, so the loop has no seam. */
export function track(keys: Keys, t: number): number {
  const time = Number.isFinite(t) ? ((t % PERIOD) + PERIOD) % PERIOD : 0;
  let before = keys[0];
  for (const key of keys) {
    if (key[0] <= time) before = key;
    else {
      if (!before) return key[1];
      const span = key[0] - before[0];
      const k = span > 0 ? easeInOut((time - before[0]) / span) : 1;
      return mix(before[1], key[1], k);
    }
  }
  return before ? before[1] : 0;
}

const LEFT_LIGHT: Keys = [
  [0, 0],
  [2, 0],
  [4.5, 1],
  [29, 1],
  [31, 0],
  [32, 0],
];
const RIGHT_LIGHT: Keys = [
  [0, 0],
  [4, 0],
  [6.5, 1],
  [27, 1],
  [29.5, 0],
  [32, 0],
];
const SKY_DEPTH: Keys = [
  [0, 0],
  [8, 0.55],
  [16, 1],
  [24, 1],
  [32, 0],
];
const STARS: Keys = [
  [0, 0],
  [4, 0],
  [14, 1],
  [26, 1],
  [32, 0],
];

export interface Night {
  /** 0 lit-dusk sky, 1 deep night. */
  depth: number;
  stars: number;
  left: number;
  right: number;
}

export function nightAt(t: number): Night {
  return {
    depth: track(SKY_DEPTH, t),
    stars: track(STARS, t),
    left: track(LEFT_LIGHT, t),
    right: track(RIGHT_LIGHT, t),
  };
}

export interface ShootingStar {
  /** Head position in frame fractions (x across, y down). */
  x: number;
  y: number;
  /** Visibility 0–1: it fades in, glides, and fades out. */
  alpha: number;
  /** 0–1 progress along the path. */
  progress: number;
}

/** The path across the sky: a slow arc from above the left window to above the right. */
export function starPath(s: number): { x: number; y: number } {
  return { x: mix(0.06, 0.9, s), y: 0.1 + 0.4 * Math.pow(s, 1.7) };
}

/** The shooting star at time `t`, or null while it is not in the sky. */
export function shootingStarAt(t: number): ShootingStar | null {
  const wrapped = Number.isFinite(t) ? ((t % PERIOD) + PERIOD) % PERIOD : 0;
  const u = (wrapped - STAR_AT) / STAR_SECONDS;
  if (u < 0 || u > 1) return null;
  const progress = easeInOut(u);
  const alpha = Math.min(1, u / 0.1, (1 - u) / 0.15);
  return { ...starPath(progress), alpha: Math.max(0, alpha), progress };
}

/** 0–1 progress of the sparkle that blooms where the star ends, or null when it is not showing. */
export function sparkleAt(t: number): number | null {
  const wrapped = Number.isFinite(t) ? ((t % PERIOD) + PERIOD) % PERIOD : 0;
  const b = (wrapped - (STAR_AT + STAR_SECONDS - 0.8)) / 2.6;
  return b >= 0 && b <= 1 ? b : null;
}
