// Set from package.json by Vite at build time (see vite.config.ts).
declare const __APP_VERSION__: string;

export const appVersion: string =
  typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';
