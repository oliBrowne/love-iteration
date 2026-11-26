import { describe, expect, it } from 'vitest';
import {
  LOOP,
  hillHeight,
  lanternPose,
  makeLanterns,
  nightAt,
  noNudge,
  pushNudge,
  stepNudge,
} from './lanterns';

describe('lantern schedule', () => {
  const seeds = makeLanterns();

  it('is deterministic and has a scatter plus a crowd', () => {
    expect(makeLanterns()).toEqual(seeds);
    expect(seeds.length).toBe(36);
  });

  it('loops without a seam', () => {
    for (const seed of seeds) {
      for (const t of [0, 7.3, 19.9, 33]) {
        const a = lanternPose(seed, t + LOOP);
        const b = lanternPose(seed, t);
        expect(a.visible).toBe(b.visible);
        for (const key of ['x', 'y', 'glow', 'alpha', 'tilt'] as const) {
          expect(a[key]).toBeCloseTo(b[key], 6);
        }
      }
    }
  });

  it('rises and brightens after it is lit, then leaves while faded out', () => {
    const seed = { ...seeds[0]!, launch: 5, rise: 20 };
    expect(lanternPose(seed, 4.9).visible).toBe(false);
    const early = lanternPose(seed, 6);
    const mid = lanternPose(seed, 15);
    expect(mid.y).toBeGreaterThan(early.y);
    expect(mid.glow).toBeGreaterThan(early.glow);
    const last = lanternPose(seed, 24.9);
    expect(last.alpha).toBeLessThan(0.1);
    expect(lanternPose(seed, 25.1).visible).toBe(false);
  });

  it('keeps every lantern in a sensible range and always finite', () => {
    for (const seed of seeds) {
      for (let t = -5; t < 90; t += 1.7) {
        const pose = lanternPose(seed, t);
        for (const v of [pose.x, pose.y, pose.glow, pose.alpha, pose.tilt]) {
          expect(Number.isFinite(v)).toBe(true);
        }
        if (pose.visible) expect(Math.abs(pose.x)).toBeLessThan(1.1);
      }
    }
  });

  it('has a crowd lifting together at the release', () => {
    const lit = seeds.filter((s) => lanternPose(s, 24).visible).length;
    const early = seeds.filter((s) => lanternPose(s, 2).visible).length;
    expect(lit).toBeGreaterThan(early);
    expect(lit).toBeGreaterThan(20);
  });
});

describe('night', () => {
  it('starts at dusk, peaks during the release and loops', () => {
    expect(nightAt(0)).toBeLessThan(0.2);
    expect(nightAt(24)).toBeGreaterThan(0.95);
    expect(nightAt(LOOP)).toBeCloseTo(nightAt(0), 6);
  });
});

describe('nudging', () => {
  const lantern = { x: 0, y: 0 };

  it('pushes a nearby lantern along the swipe and flares it', () => {
    const n = pushNudge(
      noNudge(),
      lantern,
      { x: -0.05, y: 0 },
      { dx: 0.1, dy: 0 },
      0.5,
    );
    expect(n.vx).toBeGreaterThan(0);
    expect(n.flare).toBeGreaterThan(0);
  });

  it('puffs a tapped lantern away from the finger', () => {
    const n = pushNudge(
      noNudge(),
      lantern,
      { x: 0, y: -0.1 },
      { dx: 0, dy: 0 },
      1,
    );
    expect(n.vy).toBeGreaterThan(0);
  });

  it('ignores lanterns that are far away', () => {
    const n = noNudge();
    expect(pushNudge(n, lantern, { x: 0.9, y: 0.9 }, { dx: 1, dy: 1 }, 1)).toBe(
      n,
    );
  });

  it('springs back to rest, even with a huge time step', () => {
    let n = pushNudge(
      noNudge(),
      lantern,
      { x: -0.05, y: 0 },
      { dx: 1, dy: 0 },
      1,
    );
    for (let i = 0; i < 600; i++) n = stepNudge(n, i === 3 ? 100 : 1 / 60);
    expect(Math.abs(n.ox)).toBeLessThan(0.01);
    expect(n.flare).toBeLessThan(0.01);
  });
});

describe('hills', () => {
  it('stay low and nearer hills sit lower', () => {
    for (let x = -3; x <= 3; x += 0.25) {
      expect(hillHeight(x, 0)).toBeLessThan(-0.4);
      expect(hillHeight(x, 2)).toBeLessThan(hillHeight(x, 0) + 0.15);
    }
  });
});
