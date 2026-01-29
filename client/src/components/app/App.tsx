import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { createCn } from 'bem-react-classname';

import { ActionField } from '../action-field';
import { TabBar } from '../tab-bar/tab-bar';
import { TopBar } from '../top-bar';
import { AutomationPage } from '../pages/automation-page';
import { InfoPage } from '../pages/info-page';
import { MainPage } from '../pages/main-page';
import { MonitoringPage } from '../pages/monitoring-page';

import './styles.css';

const cn = createCn('app');

const AppContent = () => {
  const { pathname } = useLocation();

  const [showTabs, setShowTabs] = useState(pathname !== '/');

  const hideActionButton = pathname === '/';

  useEffect(() => {
    setShowTabs(pathname !== '/');
  }, [pathname]);

  return (
    <div className={cn()}>
      <TopBar />

      <div className={cn('wrapper', { 'tabs-visible': !showTabs })}>
        <TabBar isVisible={showTabs} />
        <ActionField hideActionButton={hideActionButton} />
      </div>

      <div className={cn('wrapper', { 'tabs-visible': !showTabs })}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};
