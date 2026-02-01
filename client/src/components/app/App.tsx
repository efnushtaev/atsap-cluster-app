import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom';
import { createCn } from 'bem-react-classname';

import { TopBar } from '../top-bar';

import './styles.css';
import { ControlBar } from '../control-bar/control-bar';
import { PagesRoutes } from '../pages-routes/pages-routes';

const cn = createCn('app');

const AppContent = () => {
  const { pathname } = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [showTabs, setShowTabs] = useState(pathname !== '/');

  useEffect(() => {
    setShowTabs(pathname !== '/');
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn()}>
      <TopBar />

      {!isMobile ? <ControlBar showTabs={showTabs} /> : null}

      <PagesRoutes showTabs={showTabs} />

      {isMobile ? <ControlBar showTabs={showTabs} isMobile={true} /> : null}
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
