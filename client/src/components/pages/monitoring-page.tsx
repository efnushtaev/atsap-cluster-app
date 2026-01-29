import { createCn } from 'bem-react-classname';

import { ObjectsList } from '../objects-list';

import './styles.css';

const cn = createCn('page');

export const MonitoringPage = () => {
  return (
    <div className={cn()}>
      <div className={cn('content')}>
        <ObjectsList />
      </div>
    </div>
  );
};
