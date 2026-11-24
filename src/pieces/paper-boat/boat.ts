import { clamp01, easeInOut, mix, type Phase } from '../../ascii/helpers';

/** How much of a point is paper (0–1) and how shadowed that paper is (0 lit, 1 shadow). */
export interface BoatSample {
  cover: number;
  shade: number;
}

const HULL_HEIGHT = 0.55;
const SAIL_TOP = 1.9;

/**
 * The folded boat in its own units, with the waterline at y = 0 and up as negative y.
 * A hull with a crease across it, and one tall sail folded down the middle: light on the
 * left, shadow on the right.
 */
export function boatSample(x: number, y: number): BoatSample {
  let cover = 0;
  let shade = 0;

  if (y <= 0 && y >= -HULL_HEIGHT) {
    const half = 0.8 + 0.5 * (-y / HULL_HEIGHT);
    const edge = Math.min(-y, y + HULL_HEIGHT, half - Math.abs(x));
    const hullCover = clamp01(edge / 0.07 + 0.5);
    if (hullCover > cover) {
      cover = hullCover;
      shade = (y < -0.27 ? 0.2 : 0.55) + (x > 0 ? 0.1 : 0);
      // The fold across the hull, a thin darker line.
      if (Math.abs(y + 0.27) < 0.022) shade = Math.min(1, shade + 0.3);
    }
  }

  if (y <= -HULL_HEIGHT + 0.02 && y >= -SAIL_TOP) {
    const half = (0.95 * (y + SAIL_TOP)) / (SAIL_TOP - HULL_HEIGHT);
    const sailCover = clamp01(((half - Math.abs(x)) * 0.8) / 0.07 + 0.5);
    if (sailCover > cover) {
      cover = sailCover;
      shade = Math.abs(x) < 0.04 ? 0.05 : x < 0 ? 0.1 : 0.55;
      // A second fold on the lit side, and a crisp darker edge along the sail's outline.
      if (Math.abs(x + 0.45 * half) < 0.025) shade = 0.4;
      if (half - Math.abs(x) < 0.05) shade = Math.min(1, shade + 0.25);
    }
  }

  return { cover, shade };
}

export type Rgb = readonly [number, number, number];

/** One moment in the day: everything about the light that changes over the loop. */
export interface Mood {
  top: Rgb;
  horizon: Rgb;
  /** Height of the sun in the frame (0 top, 1 bottom); it sets below the horizon. */
  sunY: number;
  sunAlpha: number;
  moonAlpha: number;
  stars: number;
  lantern: number;
  fireflies: number;
  /** Overall brightness of the scene, 0–1. */
  lum: number;
}

/** Morning, golden hour, dusk, night. Each phase eases from one to the next; night leads back to morning. */
export const MOODS: readonly Mood[] = [
  {
    top: [150, 175, 205],
    horizon: [250, 210, 190],
    sunY: 0.34,
    sunAlpha: 1,
    moonAlpha: 0,
    stars: 0,
    lantern: 0,
    fireflies: 0,
    lum: 0.8,
  },
  {
    top: [115, 150, 190],
    horizon: [255, 200, 125],
    sunY: 0.38,
    sunAlpha: 1,
    moonAlpha: 0,
    stars: 0,
    lantern: 0,
    fireflies: 0,
    lum: 0.9,
  },
  {
    top: [70, 62, 120],
    horizon: [235, 125, 130],
    sunY: 0.46,
    sunAlpha: 0.9,
    moonAlpha: 0.3,
    stars: 0.25,
    lantern: 0.6,
    fireflies: 0.2,
    lum: 0.66,
  },
  {
    top: [44, 52, 118],
    horizon: [120, 118, 190],
    sunY: 0.56,
    sunAlpha: 0,
    moonAlpha: 1,
    stars: 1,
    lantern: 1,
    fireflies: 1,
    lum: 0.68,
  },
];

export const PHASES: readonly Phase[] = [
  { name: 'morning', seconds: 10 },
  { name: 'golden hour', seconds: 10 },
  { name: 'dusk', seconds: 10 },
  { name: 'lantern night', seconds: 10 },
];

/** Length of the whole loop in seconds. */
export const PERIOD = PHASES.reduce((sum, phase) => sum + phase.seconds, 0);

function mixRgb(a: Rgb, b: Rgb, k: number): Rgb {
  return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
}

/** The light at time `t`. It loops: `moodAt(0)` and `moodAt(PERIOD)` are the same. */
export function moodAt(t: number): Mood {
  const wrapped = Number.isFinite(t) ? ((t % PERIOD) + PERIOD) % PERIOD : 0;
  let start = 0;
  let index = 0;
  for (let i = 0; i < PHASES.length; i++) {
    const seconds = PHASES[i]?.seconds ?? 0;
    if (wrapped < start + seconds || i === PHASES.length - 1) {
      index = i;
      break;
    }
    start += seconds;
  }
  const length = PHASES[index]?.seconds ?? 1;
  const k = easeInOut((wrapped - start) / length);
  const from = MOODS[index] as Mood;
  const to = MOODS[(index + 1) % MOODS.length] as Mood;
  return {
    top: mixRgb(from.top, to.top, k),
    horizon: mixRgb(from.horizon, to.horizon, k),
    sunY: mix(from.sunY, to.sunY, k),
    sunAlpha: mix(from.sunAlpha, to.sunAlpha, k),
    moonAlpha: mix(from.moonAlpha, to.moonAlpha, k),
    stars: mix(from.stars, to.stars, k),
    lantern: mix(from.lantern, to.lantern, k),
    fireflies: mix(from.fireflies, to.fireflies, k),
    lum: mix(from.lum, to.lum, k),
  };
}

export interface BoatPose {
  /** Horizontal position as a fraction of the frame width. */
  x: number;
  /** Waterline as a fraction of the frame height. */
  y: number;
  /** Size of one boat unit, in frame heights. */
  size: number;
  /** Rocking angle in radians. */
  angle: number;
  /** Progress through the loop, 0–1. */
  progress: number;
}

/** Where the boat is. It starts and ends fully out of frame, so the loop has no seam. */
export function boatPose(t: number, aspect: number): BoatPose {
  const progress = (((t % PERIOD) + PERIOD) % PERIOD) / PERIOD;
  const size = Math.min(0.13, Math.max(0.05, aspect * 0.27));
  const margin = (1.5 * size) / Math.max(aspect, 0.1) + 0.05;
  const turn = Math.PI * 2 * progress;
  return {
    x: mix(-margin, 1 + margin, progress),
    y: 0.66 + 0.004 * Math.sin(turn * 4),
    size,
    angle: 0.06 * Math.sin(turn * 3),
    progress,
  };
}
