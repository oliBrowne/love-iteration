export const routes = [
  'home',
  'check-in',
  'gratitude',
  'memories',
  'rituals',
  'ideas',
  'settings',
] as const;

export type Route = (typeof routes)[number];

export const routeLabels: Record<Route, string> = {
  home: 'Home',
  'check-in': 'Check-in',
  gratitude: 'Gratitude',
  memories: 'Memories',
  rituals: 'Rituals',
  ideas: 'Ideas',
  settings: 'Settings',
};

export function routeToHash(route: Route): string {
  return `#/${route}`;
}

export function parseRoute(hash: string): Route {
  const name = hash.replace(/^#\/?/, '');
  return routes.find((route) => route === name) ?? 'home';
}
