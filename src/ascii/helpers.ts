import type { Cell } from './field';

/** Easing curves: each maps 0–1 to 0–1 and is safe for out-of-range input. */
export function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function easeInOut(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function easeOut(value: number): number {
  const t = clamp01(value);
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface Phase {
  name: string;
  /** Length in seconds. */
  seconds: number;
}

export interface PhaseState {
  index: number;
  name: string;
  /** Linear progress through this phase, 0–1. */
  progress: number;
  /** Progress with ease-in-out applied. */
  eased: number;
  /** Seconds into the whole loop. */
  time: number;
}

/** Looping timeline over named phases. Negative, huge or invalid times are safe. */
export function phaseAt(phases: readonly Phase[], t: number): PhaseState {
  const total = phases.reduce((sum, p) => sum + Math.max(0, p.seconds), 0);
  if (phases.length === 0 || total <= 0) {
    return { index: 0, name: '', progress: 0, eased: 0, time: 0 };
  }
  const raw = Number.isFinite(t) ? t : 0;
  const time = ((raw % total) + total) % total;
  let start = 0;
  for (let index = 0; index < phases.length; index++) {
    const phase = phases[index];
    if (!phase) continue;
    const length = Math.max(0, phase.seconds);
    if (time < start + length) {
      const progress = clamp01((time - start) / length);
      return {
        index,
        name: phase.name,
        progress,
        eased: easeInOut(progress),
        time,
      };
    }
    start += length;
  }
  const last = phases[phases.length - 1];
  return {
    index: phases.length - 1,
    name: last?.name ?? '',
    progress: 1,
    eased: 1,
    time,
  };
}

/**
 * The time to hold for reduced motion: the end of the named phase, when the scene is most
 * fully composed. Falls back to 0 if the phase does not exist.
 */
export function stillTimeAt(phases: readonly Phase[], name: string): number {
  let start = 0;
  for (const phase of phases) {
    start += Math.max(0, phase.seconds);
    if (phase.name === name) return start;
  }
  return 0;
}

/** Deterministic hash of an integer lattice point to 0–1. */
export function hash2(ix: number, iy: number, seed = 0): number {
  let h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

/** Smooth value noise, 0–1, continuous across lattice cells. */
export function valueNoise(x: number, y: number, seed = 0): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = easeInOut(x - ix);
  const fy = easeInOut(y - iy);
  const top = mix(hash2(ix, iy, seed), hash2(ix + 1, iy, seed), fx);
  const bottom = mix(hash2(ix, iy + 1, seed), hash2(ix + 1, iy + 1, seed), fx);
  return mix(top, bottom, fy);
}

/** Layered noise for cloud-like texture, 0–1. */
export function fbm(x: number, y: number, octaves = 4, seed = 0): number {
  let sum = 0;
  let amplitude = 0.5;
  let norm = 0;
  let scale = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amplitude * valueNoise(x * scale, y * scale, seed + i);
    norm += amplitude;
    amplitude /= 2;
    scale *= 2;
  }
  return norm > 0 ? sum / norm : 0;
}

/**
 * A soft glow pass over rendered cells: each cell is lightened by its neighbours' colour,
 * weighted by distance, so bright shapes bleed a little into the space around them.
 * Returns new cells; the input is not changed. Blank cells that gain light get a faint dot.
 */
export function bloom(
  cells: readonly Cell[],
  cols: number,
  radius = 2,
  strength = 0.35,
): Cell[] {
  if (cols <= 0 || radius < 1 || strength <= 0)
    return cells.map((c) => ({ ...c }));
  const rows = Math.floor(cells.length / cols);
  const lum = (c: Cell) => (c.char === ' ' ? 0 : (c.r + c.g + c.b) / 765);
  return cells.map((cell, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    let r = 0;
    let g = 0;
    let b = 0;
    let weight = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx === 0 && dy === 0) continue;
        const x = col + dx;
        const y = row + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const other = cells[y * cols + x];
        if (!other) continue;
        const w = (1 / (1 + dx * dx + dy * dy * 4)) * lum(other);
        r += other.r * w;
        g += other.g * w;
        b += other.b * w;
        weight += w;
      }
    }
    if (weight < 0.05) return { ...cell };
    const amount = Math.min(1, weight * strength);
    const mixChannel = (own: number, glow: number) =>
      Math.round(Math.min(255, mix(own, Math.max(own, glow / weight), amount)));
    return {
      char: cell.char === ' ' && amount > 0.12 ? '.' : cell.char,
      r: mixChannel(cell.r, r),
      g: mixChannel(cell.g, g),
      b: mixChannel(cell.b, b),
    };
  });
}
