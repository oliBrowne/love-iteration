import type { Field, FieldSample } from '../../ascii/field';
import {
  clamp01,
  easeInOut,
  fbm,
  hash2,
  mix,
  valueNoise,
} from '../../ascii/helpers';
import {
  PERIOD,
  boatPose,
  boatSample,
  moodAt,
  type BoatPose,
  type Mood,
  type Rgb,
} from './boat';

const HORIZON = 0.46;
const TAU = Math.PI * 2;
const PAPER_LIT: Rgb = [252, 242, 226];
const PAPER_SHADE: Rgb = [214, 170, 168];
const LANTERN: Rgb = [255, 190, 110];
/** Seconds into the loop when a fish leaps, and how long the leap takes. */
const FISH_AT = 17;
const FISH_LEAP = 0.9;
const FIREFLIES = 16;

// Time-only values are the same for every cell, so work them out once per frame.
let frameKey = Number.NaN;
let frameAspect = Number.NaN;
let mood: Mood;
let pose: BoatPose;
function prepare(t: number, aspect: number): void {
  if (t === frameKey && aspect === frameAspect) return;
  frameKey = t;
  frameAspect = aspect;
  mood = moodAt(t);
  pose = boatPose(t, aspect);
}

function lerpRgb(a: Rgb, b: Rgb, k: number): Rgb {
  return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
}

function lightRgb(c: Rgb, amount: number): Rgb {
  return [c[0] * amount, c[1] * amount, c[2] * amount];
}

/** Lays one colour over another by `cover`. Brightness is mixed the same way. */
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

/** Adds light to a sample, tinted. */
function glow(
  base: FieldSample,
  amount: number,
  colour: Rgb,
  lift = 1,
): FieldSample {
  const k = clamp01(amount);
  return {
    brightness: Math.min(1, base.brightness + amount * 0.5 * lift),
    r: mix(base.r, colour[0], k),
    g: mix(base.g, colour[1], k),
    b: mix(base.b, colour[2], k),
  };
}

function sky(x: number, y: number, aspect: number, u: number): FieldSample {
  const g = clamp01(y / HORIZON);
  const colour = lerpRgb(mood.top, mood.horizon, Math.pow(g, 0.8));
  const drift = 0.3 * Math.sin(TAU * u);
  const cloud = fbm(x * aspect * 2.6 + drift, y * 6.5, 4, 3);
  const cloudy = clamp01((cloud - 0.5) * 3.2) * clamp01(1.4 - g * 1.2);
  const body = mood.lum * (0.3 + 0.32 * g);
  const cloudColour = lerpRgb(colour, mood.horizon, 0.7);
  const base: FieldSample = {
    brightness: body,
    r: colour[0],
    g: colour[1],
    b: colour[2],
  };
  let sample = over(
    base,
    mood.lum * (0.75 + 0.25 * (1 - g)),
    lightRgb(cloudColour, 1.2),
    cloudy * 0.6,
  );

  // Stars come out as the light goes, each twinkling on its own beat.
  const cellX = Math.floor(x * 70);
  const cellY = Math.floor(y * 90);
  const star = hash2(cellX, cellY, 9);
  if (mood.stars > 0 && star > 0.975 && y < HORIZON - 0.06) {
    const twinkle = 0.5 + 0.5 * Math.sin(TAU * (u * 4 + star * 40));
    sample = over(
      sample,
      0.45 + 0.25 * twinkle,
      [235, 232, 255],
      mood.stars * (0.5 + 0.5 * twinkle),
    );
  }

  // Sun and moon.
  const sunX = 0.7;
  const sunD = Math.hypot((x - sunX) * aspect, y - mood.sunY);
  if (mood.sunAlpha > 0) {
    const halo = Math.exp(-(sunD * sunD) / 0.018) * 0.7 * mood.sunAlpha;
    sample = glow(sample, halo, [255, 225, 175]);
    sample = over(
      sample,
      1,
      [255, 238, 205],
      clamp01((0.058 - sunD) / 0.012) * mood.sunAlpha,
    );
  }
  if (mood.moonAlpha > 0) {
    const moonD = Math.hypot((x - 0.28) * aspect, y - 0.2);
    sample = glow(
      sample,
      Math.exp(-(moonD * moonD) / 0.012) * 0.6 * mood.moonAlpha,
      [190, 200, 255],
    );
    sample = over(
      sample,
      0.95,
      [238, 240, 255],
      clamp01((0.045 - moonD) / 0.01) * mood.moonAlpha,
    );
  }
  return sample;
}

/** The far bank: a low, dark line of trees with a bit of mist lying in front of it. */
function shore(
  base: FieldSample,
  x: number,
  y: number,
  aspect: number,
): FieldSample {
  const ridge =
    HORIZON - 0.012 - 0.045 * fbm(x * aspect * 3.2, 0.5, 3, 11) ** 1.5;
  let sample = base;
  if (y >= ridge && y <= HORIZON) {
    const leaf = valueNoise(x * aspect * 60, y * 90, 4);
    const tint = lerpRgb([40, 46, 62], mood.horizon, 0.18);
    sample = over(
      sample,
      0.3 + 0.2 * leaf * mood.lum,
      lightRgb(tint, 0.9 + 0.4 * leaf),
      clamp01((y - ridge) / 0.006 + 0.3),
    );
  }
  const mist =
    fbm(x * aspect * 2.2 + 0.2 * Math.sin(0), y * 14, 3, 21) *
    Math.exp(-(((y - HORIZON + 0.015) / 0.035) ** 2));
  return glow(sample, mist * 0.55 * mood.lum, mood.horizon);
}

/** Where the lantern hangs on the boat, in frame fractions, and how bright it is. */
function lanternGlow(x: number, y: number, aspect: number): number {
  if (mood.lantern <= 0) return 0;
  const lx = pose.x - (1.05 * pose.size) / aspect;
  const ly = pose.y - 0.75 * pose.size;
  const dx = (x - lx) * aspect;
  const dy = (y - ly) * 1.4;
  const spread = 1.4 * pose.size;
  return mood.lantern * Math.exp(-(dx * dx + dy * dy) / (2 * spread * spread));
}

function paper(
  x: number,
  y: number,
  aspect: number,
  mirrored: boolean,
): { sample: FieldSample; cover: number } | null {
  const dx = (x - pose.x) * aspect;
  const dy = mirrored ? 2 * pose.y - y - pose.y : y - pose.y;
  const c = Math.cos(pose.angle);
  const s = Math.sin(pose.angle);
  const lx = (dx * c + dy * s) / pose.size;
  const ly = (-dx * s + dy * c) / pose.size;
  const { cover, shade } = boatSample(lx, ly);
  if (cover <= 0.02) return null;
  const grain = 0.94 + 0.12 * valueNoise(lx * 9, ly * 9, 6);
  const lit = lerpRgb(PAPER_LIT, PAPER_SHADE, shade);
  const warm = lanternGlow(x, y, aspect) * 0.6;
  const colour = lerpRgb(
    lightRgb(lit, grain * (0.55 + 0.45 * mood.lum)),
    LANTERN,
    warm * 0.5,
  );
  return {
    sample: {
      brightness: Math.min(
        1,
        (0.95 - shade * 0.38) * (0.6 + 0.4 * mood.lum) * grain + warm * 0.2,
      ),
      r: colour[0],
      g: colour[1],
      b: colour[2],
    },
    cover,
  };
}

function water(
  x: number,
  y: number,
  aspect: number,
  u: number,
  t: number,
): FieldSample {
  const dw = Math.max(0.001, y - HORIZON);
  const depth = 1 / (dw + 0.04);
  const reflect = lerpRgb(mood.horizon, mood.top, clamp01(dw * 1.6));
  const deep = lerpRgb([24, 40, 66], mood.top, 0.35);
  const body = lerpRgb(reflect, deep, clamp01(dw * 2.2));
  const squiggle = valueNoise(x * aspect * 5, depth * 0.8, 2) * 3;
  const wave = 0.5 + 0.5 * Math.sin(depth * 5.2 + TAU * 5 * u + squiggle);
  const crest = clamp01((wave - 0.62) * 3);
  let sample: FieldSample = {
    brightness: mood.lum * (0.34 + 0.16 * (1 - dw)) + crest * 0.32 * mood.lum,
    r: body[0],
    g: body[1],
    b: body[2],
  };
  sample = glow(sample, crest * 0.25, mood.horizon, 0.6);

  // A path of light under the sun or moon, sparkling on the crests.
  const sourceX =
    (0.7 * mood.sunAlpha + 0.28 * mood.moonAlpha) /
    Math.max(0.001, mood.sunAlpha + mood.moonAlpha);
  const strength = Math.min(
    1,
    Math.max(mood.sunAlpha * 0.9, mood.moonAlpha * 0.7),
  );
  const reach = (0.02 + dw * 0.22) * 1;
  const path = Math.exp(-(((x - sourceX) * aspect) ** 2) / (reach * reach));
  sample = glow(
    sample,
    path * strength * (0.2 + 0.7 * crest) * (1 - dw * 0.8),
    [255, 232, 190],
  );

  // The boat's reflection, broken up by the ripples.
  if (y > pose.y) {
    // A soft dark pool right under the hull, so the pale boat stands out from the water.
    const sx = ((x - pose.x) * aspect) / (1.7 * pose.size);
    const sy = (y - pose.y - 0.008) / (0.3 * pose.size);
    const pool = Math.exp(-(sx * sx + sy * sy));
    sample = over(
      sample,
      sample.brightness * 0.35,
      lightRgb(deep, 0.6),
      pool * 0.7,
    );
    const wobble = 0.012 * Math.sin(y * 110 + TAU * 5 * u + squiggle);
    const mirrored = paper(x + wobble, y, aspect, true);
    if (mirrored) {
      const fade = clamp01(1 - (y - pose.y) / (pose.size * 2.6));
      sample = over(
        sample,
        mirrored.sample.brightness * 0.5,
        lightRgb(
          mirrored.sample.r === 0
            ? body
            : [mirrored.sample.r, mirrored.sample.g, mirrored.sample.b],
          0.65,
        ),
        mirrored.cover * 0.55 * fade * (1 - 0.4 * crest),
      );
    }
    // Wake: two soft lines spreading behind the boat, gone before the boat leaves the frame.
    const back = ((pose.x - x) * aspect) / pose.size;
    const fadeWake =
      clamp01(u / 0.08) *
      easeInOut(clamp01((1 - u) / 0.14)) *
      clamp01(1 - back / 4);
    if (back > 0.8 && fadeWake > 0) {
      const along = 0.012 + 0.004 * back;
      const offset = y - pose.y - 0.012;
      const arm = Math.exp(-(((offset - along) / 0.007) ** 2));
      const centre = Math.exp(-((offset / 0.006) ** 2)) * 0.5;
      sample = glow(
        sample,
        (arm + centre) * 0.32 * fadeWake,
        mood.horizon,
        0.8,
      );
    }
  }

  // The lantern throws a warm pool on the water.
  const warm = lanternGlow(x, y, aspect);
  if (warm > 0) sample = glow(sample, warm * 0.55, LANTERN);

  // A fish leaps once a loop; rings spread from where it lands.
  const since = t - FISH_AT;
  if (since > 0 && since < 4) {
    const cx = 0.78;
    const cy = 0.76;
    const q = since - FISH_LEAP;
    for (let ring = 0; ring < 2; ring++) {
      const age = q - ring * 0.5;
      if (age <= 0) continue;
      const radius = 0.015 + age * 0.045;
      const dx = (x - cx) * aspect;
      const dy = (y - cy) / 0.32;
      const d = Math.hypot(dx, dy);
      const line = Math.exp(-(((d - radius) / 0.008) ** 2));
      sample = glow(
        sample,
        line * 0.55 * clamp01(1 - age / 2.6) * (1 - ring * 0.4),
        [255, 240, 230],
      );
    }
  }
  return sample;
}

/** The fish and the drops it throws, in the air above the water. */
function leap(
  base: FieldSample,
  x: number,
  y: number,
  aspect: number,
  t: number,
): FieldSample {
  const p = (t - FISH_AT) / FISH_LEAP;
  if (p < 0 || p > 1) return base;
  const arc = 4 * p * (1 - p);
  const fx = 0.73 + 0.1 * p;
  const fy = 0.76 - 0.17 * arc;
  const dx = (x - fx) * aspect;
  const dy = y - fy;
  const body = clamp01((0.028 - Math.hypot(dx * 0.8, dy * 1.5)) / 0.01);
  let sample = over(base, 0.95, [255, 214, 214], body);
  for (let i = 0; i < 6; i++) {
    const h = hash2(i, 5, 2);
    const ex = fx + (h - 0.5) * 0.09 * (0.3 + p);
    const ey = fy + 0.02 + 0.05 * (hash2(i, 6, 2) * p);
    const d = Math.hypot((x - ex) * aspect, y - ey);
    sample = glow(sample, clamp01((0.011 - d) / 0.006) * 0.8, [255, 245, 240]);
  }
  return sample;
}

function fireflies(
  base: FieldSample,
  x: number,
  y: number,
  aspect: number,
  u: number,
): FieldSample {
  if (mood.fireflies <= 0.02) return base;
  let sample = base;
  for (let i = 0; i < FIREFLIES; i++) {
    const h1 = hash2(i, 1, 40);
    const h2 = hash2(i, 2, 40);
    const h3 = hash2(i, 3, 40);
    const fx = h1 + 0.03 * Math.sin(TAU * (2 * u + h3));
    const fy = 0.3 + 0.55 * h2 + 0.02 * Math.sin(TAU * (3 * u + h1));
    const d = Math.hypot((x - fx) * aspect, y - fy);
    const blink = 0.35 + 0.65 * Math.sin(TAU * (4 * u + h3 * 7)) ** 2;
    sample = glow(
      sample,
      Math.exp(-(d * d) / 0.00012) * blink * mood.fireflies,
      [230, 245, 150],
    );
  }
  return sample;
}

/** The whole picture: a paper boat drifting across a river through one long day, then looping. */
export const paperBoatField: Field = (x, y, t, aspect) => {
  prepare(t, aspect);
  const u = pose.progress;
  let sample =
    y < HORIZON
      ? sky(x, y, aspect, u)
      : water(x, y, aspect, u, ((t % PERIOD) + PERIOD) % PERIOD);
  sample = shore(sample, x, y, aspect);
  const tt = ((t % PERIOD) + PERIOD) % PERIOD;
  sample = leap(sample, x, y, aspect, tt);
  const boat = y <= pose.y + 0.002 ? paper(x, y, aspect, false) : null;
  if (boat)
    sample = over(
      sample,
      boat.sample.brightness,
      [boat.sample.r, boat.sample.g, boat.sample.b],
      boat.cover,
    );
  const lantern = lanternGlow(x, y, aspect);
  if (lantern > 0 && y < HORIZON + 0.02)
    sample = glow(sample, lantern * 0.5, LANTERN);
  // The lantern itself, a small bright point on the boat.
  if (mood.lantern > 0) {
    const lx = pose.x - (1.05 * pose.size) / aspect;
    const ly = pose.y - 0.75 * pose.size;
    const d = Math.hypot((x - lx) * aspect, y - ly);
    sample = over(
      sample,
      1,
      [255, 214, 140],
      clamp01((0.1 * pose.size - d) / (0.05 * pose.size)) * mood.lantern,
    );
  }
  return fireflies(sample, x, y, aspect, u);
};
