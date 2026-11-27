import type { Field, FieldSample } from '../../ascii/field';
import {
  clamp01,
  easeOut,
  fbm,
  hash2,
  mix,
  valueNoise,
} from '../../ascii/helpers';
import {
  PERIOD,
  nightAt,
  shootingStarAt,
  sparkleAt,
  starPath,
  type Night,
  type Rgb,
  type ShootingStar,
} from './windows';

const TAU = Math.PI * 2;
const SKY_END = 0.8;
const WARM: Rgb = [255, 200, 120];
const TOP_DUSK: Rgb = [58, 50, 112];
const TOP_NIGHT: Rgb = [9, 12, 40];
const HORIZON_DUSK: Rgb = [232, 120, 128];
const HORIZON_NIGHT: Rgb = [62, 70, 140];
const LEFT_X = 0.14;
const RIGHT_X = 0.86;

// Time-only values are the same for every cell, so work them out once per frame.
let frameKey = Number.NaN;
let frameAspect = Number.NaN;
let night: Night;
let star: ShootingStar | null;
let sparkle: number | null;
let u = 0;
let s = 0.06;
function prepare(t: number, aspect: number): void {
  if (t === frameKey && aspect === frameAspect) return;
  frameKey = t;
  frameAspect = aspect;
  night = nightAt(t);
  star = shootingStarAt(t);
  sparkle = sparkleAt(t);
  u = (((t % PERIOD) + PERIOD) % PERIOD) / PERIOD;
  // One window's width in frame heights: smaller on narrow phones, but never tiny.
  s = Math.min(0.075, Math.max(0.05, aspect * 0.1));
}

function lerpRgb(a: Rgb, b: Rgb, k: number): Rgb {
  return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
}

function over(
  base: FieldSample,
  brightness: number,
  colour: Rgb,
  cover: number,
): FieldSample {
  const k = clamp01(cover);
  return {
    brightness: mix(base.brightness, brightness, k),
    r: mix(base.r, colour[0], k),
    g: mix(base.g, colour[1], k),
    b: mix(base.b, colour[2], k),
  };
}

function glow(base: FieldSample, amount: number, colour: Rgb): FieldSample {
  const k = clamp01(amount);
  return {
    brightness: Math.min(1, base.brightness + amount * 0.55),
    r: mix(base.r, colour[0], k),
    g: mix(base.g, colour[1], k),
    b: mix(base.b, colour[2], k),
  };
}

/** Height of the ground at a given x: two soft hills, one under each house. */
function ground(x: number, aspect: number): number {
  const bump = (c: number) => Math.exp(-((((x - c) * aspect) / 0.24) ** 2));
  return (
    0.86 -
    0.075 * bump(LEFT_X) -
    0.075 * bump(RIGHT_X) +
    0.012 * fbm(x * aspect * 3, 4, 3, 2)
  );
}

function farRidge(x: number, aspect: number): number {
  return 0.66 + 0.1 * fbm(x * aspect * 2.2, 1.5, 3, 7);
}

function skyColour(g: number): Rgb {
  const top = lerpRgb(TOP_DUSK, TOP_NIGHT, night.depth);
  const horizon = lerpRgb(HORIZON_DUSK, HORIZON_NIGHT, night.depth);
  return lerpRgb(top, horizon, Math.pow(g, 1.7));
}

function sky(x: number, y: number, aspect: number): FieldSample {
  const g = clamp01(y / SKY_END);
  const c = skyColour(g);
  let sample: FieldSample = {
    brightness:
      0.04 +
      0.1 * g +
      0.4 * g ** 3 * (1 - 0.3 * night.depth) +
      0.1 * (1 - night.depth) * g +
      0.08 * fbm(x * aspect * 3.4, y * 7, 4, 3) * g,
    r: c[0],
    g: c[1],
    b: c[2],
  };

  // A faint river of stars running down across the sky.
  const along = y - (0.52 - 0.5 * x);
  const band =
    Math.exp(-((along / 0.12) ** 2)) *
    clamp01((fbm(x * aspect * 5, y * 9, 4, 5) - 0.35) * 2.2);
  sample = glow(sample, band * 0.5 * night.stars, [150, 150, 230]);

  // Stars: many small, a few large with a little cross of light.
  const cx = Math.floor(x * aspect * 60);
  const cy = Math.floor(y * 60);
  const h = hash2(cx, cy, 9);
  if (h > 0.962 && y < SKY_END - 0.04) {
    const beat = 3 + (Math.floor(h * 1000) % 5);
    const twinkle = 0.5 + 0.5 * Math.sin(TAU * (beat * u + h * 40));
    const big = h > 0.99;
    sample = over(
      sample,
      (big ? 0.75 : 0.42) + 0.22 * twinkle,
      [236, 232, 255],
      night.stars * (0.45 + 0.55 * twinkle) * (big ? 1 : 0.85),
    );
  }
  // One bright star between the two houses: the same one both windows see.
  const dx = (x - 0.5) * aspect;
  const dy = y - 0.17;
  const dist = Math.hypot(dx, dy);
  const arm = Math.min(Math.abs(dx), Math.abs(dy));
  const beacon =
    (Math.exp(-(dist * dist) / 0.0004) +
      0.5 * Math.exp(-(arm * arm) / 0.00003) * Math.exp(-dist / 0.05)) *
    night.stars *
    (0.8 + 0.2 * Math.sin(TAU * 4 * u));
  sample = over(sample, 1, [255, 246, 226], beacon);
  return glow(sample, beacon * 0.2, [200, 205, 255]);
}

function farHills(
  base: FieldSample,
  x: number,
  y: number,
  aspect: number,
): FieldSample {
  const ridge = farRidge(x, aspect);
  if (y < ridge) return base;
  const tint = lerpRgb([22, 26, 62], skyColour(0.95), 0.12);
  const leaf = valueNoise(x * aspect * 50, y * 70, 6);
  let sample = over(
    base,
    0.1 + 0.06 * leaf,
    [tint[0] * (0.8 + 0.4 * leaf), tint[1] * (0.8 + 0.4 * leaf), tint[2]],
    clamp01((y - ridge) / 0.006 + 0.4),
  );
  const mist =
    fbm(x * aspect * 2 + 0.2 * Math.sin(TAU * u), y * 14, 3, 21) *
    Math.exp(-(((y - ridge - 0.02) / 0.05) ** 2));
  sample = glow(sample, mist * 0.12, skyColour(1));
  return sample;
}

function nearGround(
  base: FieldSample,
  x: number,
  y: number,
  aspect: number,
): FieldSample {
  const edge = ground(x, aspect);
  if (y < edge) return base;
  const grass = valueNoise(x * aspect * 90, y * 110, 3);
  const blade = valueNoise(
    x * aspect * 30 + 0.3 * Math.sin(TAU * u),
    y * 12,
    8,
  );
  return over(
    base,
    0.04 + 0.07 * grass + 0.05 * blade * (1 - clamp01((y - edge) * 5)),
    [8 + 10 * grass, 10 + 12 * grass, 30 + 16 * grass],
    clamp01((y - edge) / 0.006 + 0.4),
  );
}

/** A dark conifer with its tip at (xt, base - height). */
function tree(
  base: FieldSample,
  x: number,
  y: number,
  aspect: number,
  xt: number,
  baseY: number,
  height: number,
): FieldSample {
  const top = baseY - height;
  if (y < top || y > baseY) return base;
  const along = (y - top) / height;
  const half =
    (0.32 * height * along * (0.75 + 0.25 * Math.sin(along * 22))) / 1;
  const cover = clamp01((half - Math.abs((x - xt) * aspect)) / 0.005 + 0.4);
  const needle = valueNoise(x * aspect * 120, y * 120, 5);
  return over(
    base,
    0.16 + 0.12 * needle,
    [8 + 10 * needle, 14 + 12 * needle, 30 + 16 * needle],
    cover,
  );
}

interface House {
  /** Centre x as a frame fraction, and where the ground meets it. */
  xc: number;
  base: number;
  wx: number;
  wy: number;
  light: number;
}

function houseOf(
  xc: number,
  aspect: number,
  tall: boolean,
  light: number,
): House {
  const base = ground(xc, aspect) + 0.004;
  const bodyH = (tall ? 3.5 : 2.6) * s;
  return { xc, base, wx: xc, wy: base - bodyH * 0.58, light };
}

function houseBody(
  sample: FieldSample,
  x: number,
  y: number,
  aspect: number,
  h: House,
  tall: boolean,
): FieldSample {
  const dx = (x - h.xc) * aspect;
  const bodyW = (tall ? 3.1 : 3.5) * s;
  const bodyH = (tall ? 3.5 : 2.6) * s;
  const wallTop = h.base - bodyH;
  let out = sample;
  const grain = valueNoise(x * aspect * 160, y * 160, 12);
  const edge = clamp01((bodyW / 2 - Math.abs(dx)) / 0.004 + 0.4);
  if (y >= wallTop && y <= h.base) {
    out = over(
      out,
      0.5 + 0.1 * grain + 0.06 * Math.sin(y * 420),
      [74 + 16 * grain, 68 + 14 * grain, 138 + 20 * grain],
      edge,
    );
  }
  // The roof: a steep gable on the left house, a flat roof and chimney on the right.
  if (tall) {
    const roofTop = wallTop - 0.35 * s;
    if (
      y >= roofTop &&
      y < wallTop + 0.01 &&
      Math.abs(dx) < bodyW / 2 + 0.25 * s
    ) {
      out = over(out, 0.4, [52, 46, 104], 1);
    }
    const cx = dx - 0.9 * s;
    if (y >= roofTop - 1.1 * s && y < roofTop && Math.abs(cx) < 0.28 * s) {
      out = over(out, 0.44, [58, 52, 112], 1);
    }
  } else {
    const rise = 1.5 * s;
    const eave = bodyW / 2 + 0.4 * s;
    const limit = (rise * (eave - Math.abs(dx))) / eave;
    if (y < wallTop + 0.006 && wallTop - y < limit) {
      out = over(
        out,
        0.4 + 0.08 * grain + 0.3 * clamp01(1 - (wallTop - y) * 90),
        [56, 48, 108],
        1,
      );
    }
  }
  return out;
}

function windowPane(
  sample: FieldSample,
  x: number,
  y: number,
  aspect: number,
  h: House,
  pulse: number,
  left: boolean,
): FieldSample {
  const px = ((x - h.wx) * aspect) / s;
  const py = (y - h.wy) / (1.15 * s);
  if (Math.abs(px) > 0.62 || Math.abs(py) > 0.62) return sample;
  const level = clamp01(h.light + pulse);
  // The sill and frame.
  if (Math.abs(px) > 0.5 || Math.abs(py) > 0.5) {
    return over(sample, 0.3, [58, 44, 60], 1);
  }
  if (Math.abs(px) < 0.06 || Math.abs(py) < 0.06) {
    return over(
      sample,
      0.3 + 0.15 * level,
      [74 + 60 * level, 52 + 36 * level, 54],
      1,
    );
  }
  // Glass: dark and faintly blue when empty, warm when lit.
  const warm = lerpRgb([36, 48, 92], WARM, level);
  let brightness = 0.2 + 0.8 * level;
  let colour: Rgb = warm;
  if (level > 0.02) {
    // Something small and homely in each window.
    if (left) {
      // A potted plant on the sill.
      const pot = px > -0.4 && px < -0.12 && py > 0.22;
      const leaf =
        Math.hypot((px + 0.26) / 0.2, (py - 0.0) / 0.3) < 1 ||
        Math.hypot((px + 0.14) / 0.12, (py - 0.1) / 0.18) < 1;
      if (pot || leaf) {
        colour = lerpRgb(warm, pot ? [150, 82, 52] : [120, 150, 70], 0.8);
        brightness *= pot ? 0.7 : 0.6;
      }
    } else {
      // A lamp glowing on a shelf, and a curtain breathing at the edge.
      const lampD = Math.hypot((px - 0.22) / 0.2, (py + 0.12) / 0.26);
      if (lampD < 1) {
        colour = lerpRgb(warm, [255, 240, 190], 0.85);
        brightness = 1;
      }
      const curtain = -0.5 + 0.2 + 0.05 * Math.sin(TAU * 3 * u + py * 5);
      if (px < curtain + 0.2) {
        colour = lerpRgb(warm, [200, 110, 100], 0.55);
        brightness *= 0.75;
      }
    }
  }
  return over(sample, brightness, colour, 1);
}

/** Warm light falling out of a window onto the ground and walls near it. */
function windowGlow(
  sample: FieldSample,
  x: number,
  y: number,
  aspect: number,
  h: House,
  level: number,
): FieldSample {
  if (level <= 0.01) return sample;
  const dx = (x - h.wx) * aspect;
  const dy = y - h.wy;
  const near = Math.exp(-(dx * dx + dy * dy * 1.3) / (2 * (1.1 * s) ** 2));
  const wide = Math.exp(-(dx * dx + dy * dy * 1.3) / (2 * (2.8 * s) ** 2));
  let out = glow(sample, level * (0.5 * near + 0.1 * wide), WARM);
  // A pool of light on the ground just below the sill.
  const pool =
    Math.exp(-((dx / (2.2 * s)) ** 2)) *
    Math.exp(-(((y - h.base) / (0.5 * s)) ** 2));
  out = glow(out, level * 0.25 * pool, WARM);
  return out;
}

/** Smoke from the right chimney: two layers cross-fading as they rise, so it loops cleanly. */
function smoke(
  sample: FieldSample,
  x: number,
  y: number,
  aspect: number,
  h: House,
): FieldSample {
  if (night.right < 0.05) return sample;
  const topY = h.base - 3.5 * s - 0.35 * s - 1.1 * s;
  const rise = topY - y;
  if (rise < 0 || rise > 6 * s) return sample;
  let out = sample;
  for (let layer = 0; layer < 2; layer++) {
    const p = (u * 3 + layer * 0.5) % 1;
    const fade = Math.sin(Math.PI * p) ** 2;
    const lift = rise - p * 3 * s;
    const sway =
      Math.sin(TAU * (rise / (2.2 * s)) + layer * 2) *
      0.35 *
      s *
      clamp01(rise / (3 * s));
    const dx = (x - h.xc) * aspect - 0.9 * s - sway;
    const width = (0.22 + 0.35 * (rise / (6 * s))) * s;
    const body =
      clamp01(1 - Math.abs(dx) / width) * clamp01(1 - rise / (6 * s));
    const puff = fbm(
      ((dx * 28) / s) * 0.1 + layer * 3,
      ((lift * 22) / s) * 0.3,
      3,
      31 + layer,
    );
    out = over(
      out,
      0.35 + 0.25 * puff,
      [150, 150, 190],
      body * clamp01((puff - 0.25) * 2.4) * fade * 0.55 * night.right,
    );
  }
  return out;
}

/** The shooting star: a bright head and a long tail that thins away behind it. */
function shooting(
  sample: FieldSample,
  x: number,
  y: number,
  aspect: number,
): FieldSample {
  if (!star) return sample;
  const px = x * aspect;
  let best = 0;
  for (let i = 0; i <= 14; i++) {
    const back = i / 14;
    const sPos = star.progress - 0.6 * back * (0.4 + 0.6 * star.progress);
    if (sPos < 0) break;
    const p = starPath(sPos);
    const d = Math.hypot(px - p.x * aspect, y - p.y);
    const width = 0.011 * (1 - back * 0.65) + 0.003;
    const strength = clamp01(1 - d / (width * 2.6)) * (1 - back) ** 0.6;
    if (strength > best) best = strength;
  }
  const headD = Math.hypot(px - star.x * aspect, y - star.y);
  const halo = Math.exp(-(headD * headD) / 0.0004) * 0.9;
  const trail = Math.max(best, halo);
  const out = over(
    sample,
    0.55 + 0.45 * trail,
    [255, 246, 228],
    trail * star.alpha,
  );
  return glow(
    out,
    Math.exp(-(headD * headD) / 0.006) * 0.35 * star.alpha,
    [190, 205, 255],
  );
}

/** Small sparkles that bloom and drift outward where the star came to rest. */
function sparkles(
  sample: FieldSample,
  x: number,
  y: number,
  aspect: number,
): FieldSample {
  if (sparkle === null) return sample;
  const end = starPath(1);
  const dx = (x - end.x) * aspect;
  const dy = y - end.y;
  const r = Math.hypot(dx, dy);
  const grow = 0.07 * easeOut(sparkle);
  const sector = Math.floor(((Math.atan2(dy, dx) + Math.PI) / TAU) * 10);
  const spin = hash2(sector, 3, 5);
  const target = grow * (0.55 + 0.45 * spin);
  const alpha = (1 - sparkle) ** 1.5 * clamp01(sparkle * 6);
  const dot = clamp01(1 - Math.abs(r - target) / 0.006);
  return over(sample, 0.9, [255, 238, 210], dot * alpha * (0.5 + 0.5 * spin));
}

/** Lifts the mid-tones so characters are denser; darks and brights stay put. */
function lift(sample: FieldSample): FieldSample {
  return { ...sample, brightness: Math.pow(clamp01(sample.brightness), 0.75) };
}

/** Two lit windows far apart under one sky, a slow shooting star between them. */
export const twoWindowsField: Field = (x, y, t, aspect) => {
  prepare(t, aspect);
  const left = houseOf(LEFT_X, aspect, false, night.left);
  const right = houseOf(RIGHT_X, aspect, true, night.right);
  // The star lights each window a little as it passes overhead.
  const near = (h: House) =>
    star
      ? 0.3 *
        star.alpha *
        Math.exp(
          -(((star.x - h.xc) * aspect) ** 2 + (star.y - h.wy) ** 2 * 0.15) /
            0.02,
        )
      : 0;
  const pulseL = near(left) * left.light;
  const pulseR = near(right) * right.light;

  let sample =
    y < SKY_END ? sky(x, y, aspect) : sky(x, SKY_END - 0.001, aspect);
  sample = farHills(sample, x, y, aspect);
  sample = windowGlow(sample, x, y, aspect, left, clamp01(left.light + pulseL));
  sample = windowGlow(
    sample,
    x,
    y,
    aspect,
    right,
    clamp01(right.light + pulseR),
  );
  sample = nearGround(sample, x, y, aspect);
  for (const [xt, h] of [
    [0.27, 0.11],
    [0.31, 0.08],
    [0.73, 0.1],
    [0.67, 0.07],
    [0.04, 0.08],
  ] as const) {
    sample = tree(sample, x, y, aspect, xt, ground(xt, aspect) + 0.01, h);
  }
  sample = houseBody(sample, x, y, aspect, left, false);
  sample = houseBody(sample, x, y, aspect, right, true);
  sample = windowPane(sample, x, y, aspect, left, pulseL, true);
  sample = windowPane(sample, x, y, aspect, right, pulseR, false);
  // A little warm spill on the walls beside the windows.
  sample = windowGlow(sample, x, y, aspect, left, 0.25 * left.light);
  sample = windowGlow(sample, x, y, aspect, right, 0.25 * right.light);
  sample = smoke(sample, x, y, aspect, right);
  sample = shooting(sample, x, y, aspect);
  sample = sparkles(sample, x, y, aspect);
  return lift(sample);
};
