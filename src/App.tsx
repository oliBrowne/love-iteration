import { CheckInPage } from './features/checkin/CheckInPage.tsx';
import { GratitudePage } from './features/gratitude/GratitudePage.tsx';
import { HomePage } from './features/home/HomePage.tsx';
import { SettingsPage } from './features/settings/SettingsPage.tsx';
import { IdeasPage } from './features/ideas/IdeasPage.tsx';
import { MemoriesPage } from './features/memories/MemoriesPage.tsx';
import { ReflectionPage } from './features/reflection/ReflectionPage.tsx';
import { RitualsPage } from './features/rituals/RitualsPage.tsx';
import { TimelinePage } from './features/timeline/TimelinePage.tsx';
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
      ) : route === 'rituals' ? (
        <RitualsPage />
      ) : route === 'reflection' ? (
        <ReflectionPage />
      ) : route === 'ideas' ? (
        <IdeasPage />
      ) : route === 'timeline' ? (
        <TimelinePage />
      ) : route === 'check-in' ? (
        <CheckInPage />
      ) : (
        <HomePage />
      )}
    </PageLayout>
  );
}

export default App;
