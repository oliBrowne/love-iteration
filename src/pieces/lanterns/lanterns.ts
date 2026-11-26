import {
  clamp01,
  easeInOut,
  hash2,
  mix,
  type Phase,
} from '../../ascii/helpers';

/** The loop, in seconds. Every lantern's path is a whole number of these, so it has no seam. */
export const LOOP = 40;

export const PHASES: readonly Phase[] = [
  { name: 'dusk', seconds: 10 },
  { name: 'gather', seconds: 8 },
  { name: 'release', seconds: 8 },
  { name: 'ascent', seconds: 14 },
];

/** 0 at the first soft dusk, 1 at the deepest night (during the release), back to dusk. */
export function nightAt(t: number): number {
  const phase = ((t % LOOP) + LOOP) % LOOP;
  return 0.5 - 0.5 * Math.cos(((phase - 4) / LOOP) * Math.PI * 2);
}

export interface LanternSeed {
  /** Resting column in screen units: -1 is the left edge, 1 the right edge. */
  x: number;
  /** Depth: 0 is far, 1 is near. Near lanterns are bigger and a little faster. */
  depth: number;
  /** When it is lit, in seconds into the loop. */
  launch: number;
  /** How long it takes to leave the top of the sky, seconds. */
  rise: number;
  size: number;
  /** Colour warmth: 0 honey, 1 rose. */
  warmth: number;
  sway: number;
  swayPhase: number;
}

/** Lanterns lit one by one all evening, then a crowd lifting together at the release. */
export function makeLanterns(scatter = 14, crowd = 22): LanternSeed[] {
  const seeds: LanternSeed[] = [];
  const total = scatter + crowd;
  for (let i = 0; i < total; i++) {
    const inCrowd = i >= scatter;
    const r = (k: number) => hash2(i, k, 7);
    const depth = r(1);
    seeds.push({
      x: (inCrowd ? r(2) * 1.7 - 0.85 : r(2) * 2 - 1) * 0.92,
      depth,
      launch: inCrowd ? 18 + r(3) * 3.5 : r(3) * LOOP,
      rise: inCrowd ? 23 + r(4) * 6 : 26 + r(4) * 9,
      size: mix(0.55, 1.15, depth) * mix(0.9, 1.1, r(5)),
      warmth: r(6),
      sway: 0.015 + r(8) * 0.03,
      swayPhase: r(9) * Math.PI * 2,
    });
  }
  return seeds;
}

export interface LanternPose {
  /** Screen units: x in -1..1 across the width, y in -1..1 up the height. */
  x: number;
  y: number;
  /** How bright the flame is, 0 unlit. */
  glow: number;
  /** Whole-lantern opacity, fading in with the flame and out near the top. */
  alpha: number;
  /** Tilt in radians. */
  tilt: number;
  visible: boolean;
}

const HIDDEN: LanternPose = {
  x: 0,
  y: -2,
  glow: 0,
  alpha: 0,
  tilt: 0,
  visible: false,
};

/** Where one lantern is at time `t`. It is hidden before it is lit and after it has left. */
export function lanternPose(seed: LanternSeed, t: number): LanternPose {
  const elapsed = (((t - seed.launch) % LOOP) + LOOP) % LOOP;
  if (elapsed >= seed.rise) return HIDDEN;
  const p = elapsed / seed.rise;
  // It hovers a moment as the flame catches, then climbs, easing so it drifts out slowly.
  const climb = easeInOut(clamp01((p - 0.04) / 0.96));
  const lift = mix(climb, Math.pow(p, 0.85), 0.35);
  const y = mix(-0.74, 1.3, lift);
  const flame = clamp01(p / 0.1);
  const out = 1 - clamp01((p - 0.82) / 0.18);
  const wave = Math.sin(elapsed * 0.55 + seed.swayPhase);
  return {
    x: seed.x + wave * seed.sway * (0.4 + p),
    y,
    glow: flame * (0.85 + 0.15 * Math.sin(elapsed * 7 + seed.swayPhase)),
    alpha: easeInOut(flame) * out,
    tilt: wave * 0.12 * flame,
    visible: true,
  };
}

/** A lantern's gentle hand-given push: an offset that springs back, plus a warm flare. */
export interface Nudge {
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  flare: number;
}

export const noNudge = (): Nudge => ({ ox: 0, oy: 0, vx: 0, vy: 0, flare: 0 });

/** Spring-and-damp step so a nudged lantern bobs back to its path. Stable for any `dt`. */
export function stepNudge(nudge: Nudge, dt: number): Nudge {
  const step = Math.min(Math.max(dt, 0), 0.05);
  const stiffness = 5;
  const damping = 2.2;
  const vx = nudge.vx + (-stiffness * nudge.ox - damping * nudge.vx) * step;
  const vy = nudge.vy + (-stiffness * nudge.oy - damping * nudge.vy) * step;
  return {
    ox: nudge.ox + vx * step,
    oy: nudge.oy + vy * step,
    vx,
    vy,
    flare: nudge.flare * Math.exp(-1.6 * step),
  };
}

/**
 * Pushes a nudge away from a pointer (screen units, `aspect` = width / height so the reach is
 * round). `dx`, `dy` is how the pointer moved; a tap has no movement and puffs outward instead.
 */
export function pushNudge(
  nudge: Nudge,
  lantern: { x: number; y: number },
  pointer: { x: number; y: number },
  move: { dx: number; dy: number },
  aspect: number,
  reach = 0.32,
): Nudge {
  const ax = (lantern.x - pointer.x) * aspect;
  const ay = lantern.y - pointer.y;
  const distance = Math.hypot(ax, ay);
  if (distance >= reach) return nudge;
  const closeness = 1 - distance / reach;
  const falloff = closeness * closeness;
  const moved = Math.hypot(move.dx, move.dy);
  const away =
    distance > 1e-6 ? { x: ax / distance, y: ay / distance } : { x: 0, y: 1 };
  const strength = 0.9 * falloff;
  const pushX = moved > 1e-6 ? (move.dx / moved) * 0.7 + away.x * 0.3 : away.x;
  const pushY = moved > 1e-6 ? (move.dy / moved) * 0.7 + away.y * 0.3 : away.y;
  return {
    ...nudge,
    vx: nudge.vx + (pushX * strength) / aspect,
    vy: nudge.vy + pushY * strength,
    flare: Math.min(1, nudge.flare + falloff),
  };
}

/** Rolling hill silhouette height (screen units) for a given layer, 0 far to 2 near. */
export function hillHeight(x: number, layer: number): number {
  const base = -0.62 - layer * 0.17;
  const a = Math.sin(x * (1.3 + layer * 0.5) + layer * 2.1) * 0.07;
  const b = Math.sin(x * (3.1 + layer) + layer * 5.3) * 0.025;
  return base + a + b;
}

/** Sky colours (hex) for the top and the horizon, mixed from dusk to night. */
export const SKY = {
  duskTop: 0x4a3a7c,
  duskHorizon: 0xf2a68f,
  nightTop: 0x0d0f2e,
  nightHorizon: 0x57386a,
} as const;
