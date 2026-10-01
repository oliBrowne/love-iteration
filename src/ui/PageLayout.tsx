import type { ReactNode } from 'react';
import { routeLabels, routeToHash } from '../domain/index.ts';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>
        <h1>Love Iteration</h1>
        <nav aria-label="Main">
          <a href={routeToHash('home')}>{routeLabels.home}</a>{' '}
          <a href={routeToHash('settings')}>{routeLabels.settings}</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
