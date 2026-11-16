import { describe, expect, it } from 'vitest';
import {
  changedCells,
  DEFAULT_RAMP,
  gridFor,
  pickChar,
  renderField,
  type Field,
} from './field';

describe('pickChar', () => {
  it('maps dark to the first and bright to the last character', () => {
    expect(pickChar(0)).toBe(DEFAULT_RAMP[0]);
    expect(pickChar(1)).toBe(DEFAULT_RAMP[DEFAULT_RAMP.length - 1]);
  });

  it('stays in range for odd values', () => {
    expect(pickChar(-4)).toBe(DEFAULT_RAMP[0]);
    expect(pickChar(9)).toBe(DEFAULT_RAMP[DEFAULT_RAMP.length - 1]);
    expect(pickChar(NaN)).toBe(DEFAULT_RAMP[0]);
  });

  it('gets brighter as brightness rises', () => {
    const levels = [0, 0.25, 0.5, 0.75, 1].map((b) =>
      DEFAULT_RAMP.indexOf(pickChar(b)),
    );
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
  });
});

describe('gridFor', () => {
  it('is dense on a 320px screen and fits it', () => {
    const grid = gridFor(320, 320);
    expect(grid.cols).toBe(64);
    const cellWidth = 320 / grid.cols;
    expect(cellWidth).toBeLessThanOrEqual(5);
    expect(grid.rows).toBeGreaterThan(grid.cols / 2 - 2);
  });

  it('keeps the column count in bounds', () => {
    expect(gridFor(40, 40).cols).toBe(24);
    expect(gridFor(4000, 800).cols).toBe(160);
  });
});

describe('renderField', () => {
  const grid = { cols: 8, rows: 4 };
  const ramp: Field = (x) => ({ brightness: x, r: 300, g: -5, b: 128.4 });

  it('returns one cell per grid position with clamped colour', () => {
    const cells = renderField(ramp, grid, 0);
    expect(cells).toHaveLength(32);
    expect(cells[0]).toMatchObject({ r: 255, g: 0, b: 128 });
    expect(cells[0]?.char).toBe(DEFAULT_RAMP[0]);
    expect(cells[7]?.char).not.toBe(DEFAULT_RAMP[0]);
  });

  it('passes time and a width over height aspect to the field', () => {
    const seen: number[][] = [];
    renderField(
      (_x, _y, t, aspect) => {
        seen.push([t, aspect]);
        return { brightness: 0, r: 0, g: 0, b: 0 };
      },
      { cols: 8, rows: 4 },
      2.5,
    );
    expect(seen[0]).toEqual([2.5, 1]);
  });
});

describe('changedCells', () => {
  const a = { char: 'a', r: 1, g: 2, b: 3 };

  it('reports everything on the first frame', () => {
    expect(changedCells(null, [a, a])).toEqual([0, 1]);
  });

  it('reports only cells that changed', () => {
    expect(
      changedCells([a, a, a], [a, { ...a, g: 9 }, { ...a, char: 'b' }]),
    ).toEqual([1, 2]);
    expect(changedCells([a], [a])).toEqual([]);
  });
});
