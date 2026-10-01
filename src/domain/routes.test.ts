import { describe, expect, it } from 'vitest';
import { routeLabels, routes } from './routes.ts';

describe('routes', () => {
  it('lists Home, Check-in, Ideas, and Settings', () => {
    expect(routes.map((route) => routeLabels[route])).toEqual([
      'Home',
      'Check-in',
      'Ideas',
      'Settings',
    ]);
  });
});
