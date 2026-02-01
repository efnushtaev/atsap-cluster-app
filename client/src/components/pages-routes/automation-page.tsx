import { createCn } from 'bem-react-classname';

import './styles.css';

const cn = createCn('page');

export const AutomationPage = () => {
  return (
    <div className={cn()}>
      <div className={cn('content')}>
        <h2>Скоро здесь будет страница автоматики</h2>
      </div>
    </div>
  );
};
