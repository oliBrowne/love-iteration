import { CheckInPage } from './features/checkin/CheckInPage.tsx';
import { HomePage } from './features/home/HomePage.tsx';
import { SettingsPage } from './features/settings/SettingsPage.tsx';
import { PageLayout } from './ui/index.ts';
import { useRoute } from './useRoute.ts';

function App() {
  const route = useRoute();
  return (
    <PageLayout>
      {route === 'settings' ? (
        <SettingsPage />
      ) : route === 'check-in' ? (
        <CheckInPage />
      ) : (
        <HomePage />
      )}
    </PageLayout>
  );
}

export default App;
