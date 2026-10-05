import type { ReactNode } from 'react';
import { routeLabels, routeToHash } from '../domain/index.ts';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          // Focus main directly so the URL hash (our route) is left alone.
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <header>
        <h1>Love Iteration</h1>
        <nav aria-label="Main">
          <a href={routeToHash('home')}>{routeLabels.home}</a>{' '}
          <a href={routeToHash('check-in')}>{routeLabels['check-in']}</a>{' '}
          <a href={routeToHash('settings')}>{routeLabels.settings}</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
