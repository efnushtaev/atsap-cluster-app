import { createCn } from 'bem-react-classname';
import { Tabs } from './tabs';
import { ActionField } from './action-field';
import { useLocation } from 'react-router-dom';

import './styles.css';

const cn = createCn('control-bar');

export const ControlBar = ({ showTabs = true, isMobile = false }: { showTabs?: boolean, isMobile?: boolean }) => {
  const { pathname } = useLocation();

  const isMainPage = pathname === '/';

  console.log('showTabs: ', showTabs);

  return (
    <div className={cn(`${isMobile ? 'mobile-wrapper' : 'desktop-wrapper'}`, { 'tabs-visible': showTabs })}>
      {!isMobile ? <Tabs isVisible={showTabs} /> : null}
      <ActionField hideActionButton={isMainPage} />
      {isMobile && !isMainPage ? <Tabs isVisible={showTabs} /> : null}
    </div>
  );
};
