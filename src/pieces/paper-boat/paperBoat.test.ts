import { describe, expect, it } from 'vitest';
import { gridFor, renderField } from '../../ascii/field';
import { PERIOD, boatPose, boatSample, moodAt } from './boat';
import { paperBoatField } from './paperBoatField';

describe('boatSample', () => {
  it('is paper on the sail and hull, and empty away from the boat', () => {
    expect(boatSample(0, -1).cover).toBeGreaterThan(0.9);
    expect(boatSample(0, -0.2).cover).toBeGreaterThan(0.9);
    expect(boatSample(3, -1).cover).toBe(0);
    expect(boatSample(0, 1).cover).toBe(0);
  });
  it('shades the right of the sail more than the left', () => {
    expect(boatSample(0.4, -1).shade).toBeGreaterThan(
      boatSample(-0.4, -1).shade,
    );
  });
});

describe('moodAt', () => {
  it('loops with no jump', () => {
    expect(moodAt(PERIOD)).toEqual(moodAt(0));
    expect(moodAt(-PERIOD)).toEqual(moodAt(0));
  });
  it('lights the lantern and the stars at night, not in the morning', () => {
    expect(moodAt(0).lantern).toBe(0);
    expect(moodAt(PERIOD * 0.75).lantern).toBeGreaterThan(0.99);
    expect(moodAt(PERIOD * 0.75).stars).toBeGreaterThan(0.99);
  });
});

describe('boatPose', () => {
  it.each([0.5, 1, 1.8])(
    'starts and ends out of frame (aspect %s)',
    (aspect) => {
      const start = boatPose(0, aspect);
      const end = boatPose(PERIOD, aspect);
      const reach = (1.5 * start.size) / aspect;
      expect(start.x).toBeLessThan(-reach);
      expect(boatPose(PERIOD - 0.001, aspect).x).toBeGreaterThan(1 + reach);
      expect(end.x).toBe(start.x);
    },
  );
});

describe('paperBoatField', () => {
  const grid = gridFor(320, 560);
  const text = (t: number) =>
    renderField(paperBoatField, grid, t)
      .map((c) => c.char + c.r + c.g + c.b)
      .join('|');

  it('loops seamlessly', () => {
    expect(text(0)).toBe(text(PERIOD));
  });
  it('moves over time', () => {
    expect(text(5)).not.toBe(text(5.5));
  });
  it('draws the boat when it is mid-frame and always returns valid samples', () => {
    const cells = renderField(paperBoatField, grid, PERIOD / 2);
    expect(cells.some((c) => c.char === '@' || c.char === '%')).toBe(true);
    for (let t = 0; t < PERIOD; t += 3.7) {
      for (const [x, y] of [
        [0, 0],
        [0.5, 0.5],
        [1, 1],
        [0.78, 0.76],
      ] as const) {
        const s = paperBoatField(x, y, t, 0.57);
        expect(Number.isFinite(s.brightness)).toBe(true);
        expect(Number.isFinite(s.r + s.g + s.b)).toBe(true);
      }
    }
  });
});
