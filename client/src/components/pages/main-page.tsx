import { createCn } from 'bem-react-classname';

import { UnitsList } from '../units-list';

import './styles.css';

const cn = createCn('page');

export const MainPage = () => {
  return (
    <div className={cn()}>
      <div className={cn('content')}>
        <UnitsList />
      </div>
    </div>
  );
};
