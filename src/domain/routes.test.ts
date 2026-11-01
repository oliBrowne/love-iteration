import { describe, expect, it } from 'vitest';
import { parseRoute, routeLabels, routes, routeToHash } from './routes.ts';

describe('routes', () => {
  it('lists the main nav pages: Home, Check-in, Gratitude, Memories, Rituals, Reflection, Ideas, Timeline, Search, and Settings', () => {
    expect(
      routes
        .filter((route) => route !== 'privacy')
        .map((route) => routeLabels[route]),
    ).toEqual([
      'Home',
      'Check-in',
      'Gratitude',
      'Memories',
      'Rituals',
      'Reflection',
      'Ideas',
      'Timeline',
      'Search',
      'Settings',
    ]);
  });

  it('has a Privacy policy page reached from Settings', () => {
    expect(routeLabels.privacy).toBe('Privacy policy');
    expect(parseRoute('#/privacy')).toBe('privacy');
  });
});

describe('parseRoute', () => {
  it('reads a route from a hash and falls back to home', () => {
    expect(parseRoute('#/settings')).toBe('settings');
    expect(parseRoute('#/gratitude')).toBe('gratitude');
    expect(parseRoute('#/memories')).toBe('memories');
    expect(parseRoute('#/rituals')).toBe('rituals');
    expect(parseRoute('#/timeline')).toBe('timeline');
    expect(parseRoute('')).toBe('home');
    expect(parseRoute('#/nowhere')).toBe('home');
    expect(routeToHash('check-in')).toBe('#/check-in');
  });
});
