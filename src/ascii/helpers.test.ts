import { describe, expect, it } from 'vitest';
import {
  bloom,
  easeInOut,
  easeOut,
  fbm,
  phaseAt,
  stillTimeAt,
  valueNoise,
} from './helpers';
import { renderField } from './field';
import type { Cell } from './field';

const phases = [
  { name: 'open', seconds: 2 },
  { name: 'dive', seconds: 4 },
  { name: 'rest', seconds: 2 },
];

describe('easing', () => {
  it('runs 0 to 1 and clamps', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5);
    expect(easeInOut(-3)).toBe(0);
    expect(easeOut(9)).toBe(1);
    expect(easeOut(Number.NaN)).toBe(0);
    expect(easeOut(0.5)).toBeGreaterThan(0.5);
  });
});

describe('phaseAt', () => {
  it('finds the phase and progress', () => {
    const state = phaseAt(phases, 4);
    expect(state.name).toBe('dive');
    expect(state.progress).toBeCloseTo(0.5);
    expect(state.eased).toBeCloseTo(0.5);
  });
  it('loops and survives odd times', () => {
    expect(phaseAt(phases, 8).name).toBe('open');
    expect(phaseAt(phases, -1).name).toBe('rest');
    expect(phaseAt(phases, Number.NaN).name).toBe('open');
    expect(phaseAt([], 3).name).toBe('');
  });
  it('finds a composed still time', () => {
    expect(stillTimeAt(phases, 'dive')).toBe(6);
    expect(stillTimeAt(phases, 'missing')).toBe(0);
  });
});

describe('noise', () => {
  it('is deterministic and in range', () => {
    expect(valueNoise(1.3, 2.7, 5)).toBe(valueNoise(1.3, 2.7, 5));
    for (let i = 0; i < 50; i++) {
      const v = fbm(i * 0.37, i * 0.91, 4);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
  it('changes smoothly', () => {
    expect(
      Math.abs(valueNoise(3.5, 4.5) - valueNoise(3.5001, 4.5)),
    ).toBeLessThan(0.01);
  });
});

describe('bloom', () => {
  const blank: Cell = { char: ' ', r: 0, g: 0, b: 0 };
  const lit: Cell = { char: '@', r: 255, g: 200, b: 200 };
  const row = [blank, blank, lit, blank, blank];

  it('spreads light to neighbours without changing the input', () => {
    const out = bloom(row, 5, 2, 1);
    expect(out[1]!.r).toBeGreaterThan(0);
    expect(out[1]!.char).toBe('.');
    expect(out[2]).toEqual(lit);
    expect(row[1]).toEqual(blank);
  });
  it('does nothing when off or in empty space', () => {
    expect(bloom(row, 5, 2, 0)).toEqual(row);
    const dark = [blank, blank, blank];
    expect(bloom(dark, 3)).toEqual(dark);
  });
  it('is deterministic over a rendered field', () => {
    const field = () => ({ brightness: 0.8, r: 200, g: 120, b: 120 });
    const cells = renderField(field, { cols: 8, rows: 4 }, 0);
    expect(bloom(cells, 8)).toEqual(bloom(cells, 8));
  });
});
