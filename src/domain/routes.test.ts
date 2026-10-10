import { describe, expect, it } from 'vitest';
import { parseRoute, routeLabels, routes, routeToHash } from './routes.ts';

describe('routes', () => {
  it('lists Home, Check-in, Gratitude, Ideas, and Settings', () => {
    expect(routes.map((route) => routeLabels[route])).toEqual([
      'Home',
      'Check-in',
      'Gratitude',
      'Ideas',
      'Settings',
    ]);
  });
});

describe('parseRoute', () => {
  it('reads a route from a hash and falls back to home', () => {
    expect(parseRoute('#/settings')).toBe('settings');
    expect(parseRoute('#/gratitude')).toBe('gratitude');
    expect(parseRoute('')).toBe('home');
    expect(parseRoute('#/nowhere')).toBe('home');
    expect(routeToHash('check-in')).toBe('#/check-in');
  });
});
