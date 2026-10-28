export const routes = [
  'home',
  'check-in',
  'gratitude',
  'memories',
  'rituals',
  'reflection',
  'ideas',
  'timeline',
  'search',
  'settings',
] as const;

export type Route = (typeof routes)[number];

export const routeLabels: Record<Route, string> = {
  home: 'Home',
  'check-in': 'Check-in',
  gratitude: 'Gratitude',
  memories: 'Memories',
  rituals: 'Rituals',
  reflection: 'Reflection',
  ideas: 'Ideas',
  timeline: 'Timeline',
  search: 'Search',
  settings: 'Settings',
};

export function routeToHash(route: Route): string {
  return `#/${route}`;
}

export function parseRoute(hash: string): Route {
  const name = hash.replace(/^#\/?/, '');
  return routes.find((route) => route === name) ?? 'home';
}
