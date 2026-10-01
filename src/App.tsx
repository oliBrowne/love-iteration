import { HomePage } from './features/home/HomePage.tsx';
import { SettingsPage } from './features/settings/SettingsPage.tsx';
import { PageLayout } from './ui/index.ts';
import { useRoute } from './useRoute.ts';

function App() {
  const route = useRoute();
  return (
    <PageLayout>
      {route === 'settings' ? <SettingsPage /> : <HomePage />}
    </PageLayout>
  );
}

export default App;
