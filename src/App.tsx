import { CheckInPage } from './features/checkin/CheckInPage.tsx';
import { GratitudePage } from './features/gratitude/GratitudePage.tsx';
import { HomePage } from './features/home/HomePage.tsx';
import { SettingsPage } from './features/settings/SettingsPage.tsx';
import { IdeasPage } from './features/ideas/IdeasPage.tsx';
import { MemoriesPage } from './features/memories/MemoriesPage.tsx';
import { PageLayout } from './ui/index.ts';
import { useRoute } from './useRoute.ts';

function App() {
  const route = useRoute();
  return (
    <PageLayout>
      {route === 'settings' ? (
        <SettingsPage />
      ) : route === 'gratitude' ? (
        <GratitudePage />
      ) : route === 'memories' ? (
        <MemoriesPage />
      ) : route === 'ideas' ? (
        <IdeasPage />
      ) : route === 'check-in' ? (
        <CheckInPage />
      ) : (
        <HomePage />
      )}
    </PageLayout>
  );
}

export default App;
