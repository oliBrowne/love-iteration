import { routeLabels, routeToHash } from './domain/index.ts';
import { HomePage } from './features/home/HomePage.tsx';
import { SettingsPage } from './features/settings/SettingsPage.tsx';
import { useRoute } from './useRoute.ts';

function App() {
  const route = useRoute();
  return (
    <div>
      <h1>Love Iteration</h1>
      <nav aria-label="Main">
        <a href={routeToHash('home')}>{routeLabels.home}</a>{' '}
        <a href={routeToHash('settings')}>{routeLabels.settings}</a>
      </nav>
      {route === 'settings' ? <SettingsPage /> : <HomePage />}
    </div>
  );
}

export default App;
