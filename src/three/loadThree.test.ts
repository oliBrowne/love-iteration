import { describe, expect, it } from 'vitest';
import { loadThree } from './loadThree';

describe('loadThree', () => {
  it('loads three.js on demand and shares one load', async () => {
    const first = loadThree();
    expect(loadThree()).toBe(first);
    const THREE = await first;
    expect(new THREE.Vector3(1, 2, 3).length()).toBeCloseTo(Math.sqrt(14));
  });
});
