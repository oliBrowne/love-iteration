export const routes = ['home', 'check-in', 'ideas', 'settings'] as const;

export type Route = (typeof routes)[number];

export const routeLabels: Record<Route, string> = {
  home: 'Home',
  'check-in': 'Check-in',
  ideas: 'Ideas',
  settings: 'Settings',
};
