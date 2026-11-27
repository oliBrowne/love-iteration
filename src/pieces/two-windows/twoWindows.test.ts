import { describe, expect, it } from 'vitest';
import { gridFor, renderField } from '../../ascii/field';
import {
  PERIOD,
  STAR_AT,
  STAR_SECONDS,
  STILL_TIME,
  nightAt,
  shootingStarAt,
  sparkleAt,
  starPath,
  track,
} from './windows';
import { twoWindowsField } from './twoWindowsField';

describe('track', () => {
  it('eases between keys and wraps', () => {
    const keys = [
      [0, 0],
      [10, 1],
      [32, 0],
    ] as const;
    expect(track(keys, 0)).toBe(0);
    expect(track(keys, 5)).toBeCloseTo(0.5);
    expect(track(keys, 10)).toBe(1);
    expect(track(keys, PERIOD)).toBe(track(keys, 0));
    expect(track(keys, Number.NaN)).toBe(0);
  });
});

describe('nightAt', () => {
  it('loops with no jump', () => {
    expect(nightAt(PERIOD)).toEqual(nightAt(0));
    expect(nightAt(-PERIOD)).toEqual(nightAt(0));
  });
  it('lights the left window before the right, and both for the star', () => {
    const early = nightAt(4);
    expect(early.left).toBeGreaterThan(early.right);
    expect(nightAt(STAR_AT + 1).left).toBe(1);
    expect(nightAt(STAR_AT + 1).right).toBe(1);
    expect(nightAt(0).left).toBe(0);
  });
});

describe('shootingStarAt', () => {
  it('is only in the sky during its window of time', () => {
    expect(shootingStarAt(STAR_AT - 1)).toBeNull();
    expect(shootingStarAt(STAR_AT + STAR_SECONDS + 1)).toBeNull();
    expect(shootingStarAt(STILL_TIME)).not.toBeNull();
  });
  it('crosses from the left side of the sky to the right', () => {
    const early = shootingStarAt(STAR_AT + 0.6);
    const late = shootingStarAt(STAR_AT + STAR_SECONDS - 0.6);
    expect(early && late && late.x - early.x).toBeGreaterThan(0.5);
    expect(starPath(0).x).toBeLessThan(0.2);
    expect(starPath(1).x).toBeGreaterThan(0.8);
  });
  it('blooms a sparkle at the end', () => {
    expect(sparkleAt(STAR_AT + STAR_SECONDS + 0.5)).not.toBeNull();
    expect(sparkleAt(2)).toBeNull();
  });
});

describe('twoWindowsField', () => {
  it('renders a full grid at several times and sizes with finite values', () => {
    for (const [w, h] of [
      [320, 480],
      [1000, 600],
    ] as const) {
      const grid = gridFor(w, h);
      for (const t of [0, 5, 12, STILL_TIME, 28, PERIOD - 0.01]) {
        const cells = renderField(twoWindowsField, grid, t);
        expect(cells).toHaveLength(grid.cols * grid.rows);
        expect(cells.some((c) => c.char !== ' ')).toBe(true);
      }
    }
  });
  it('shows a lit window at night and a dark one at the start', () => {
    const aspect = 0.7;
    const lit = twoWindowsField(0.14, 0.7, 14, aspect);
    const dark = twoWindowsField(0.14, 0.7, 0, aspect);
    expect(lit.brightness).toBeGreaterThan(dark.brightness + 0.2);
  });
  it('loops: the first and last frames match', () => {
    const grid = gridFor(320, 480);
    const first = renderField(twoWindowsField, grid, 0);
    const last = renderField(twoWindowsField, grid, PERIOD);
    expect(last).toEqual(first);
  });
});
