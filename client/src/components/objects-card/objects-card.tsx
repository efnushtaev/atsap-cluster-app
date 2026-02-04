import { useNavigate } from 'react-router-dom';

import { createCn } from 'bem-react-classname';
import { SunOutlined } from '@ant-design/icons';

import './styles.css';

type ObjectsCardProps = {
  title: string;
  describe: string;
  value: string;
};

const cn = createCn('objects-card');

export const ObjectsCard = ({ title, describe, value }: ObjectsCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/monitoring');
  };

  return (
    <div className={cn()} onClick={handleClick}>
      <div className={cn('content')}>
        <div className={cn('content-top')}>
          <div>
            <div className={cn('title')}>{title}</div>
            <div className={cn('describe')}>{describe}</div>
          </div>
          <SunOutlined className={cn('icon')} />
        </div>
        <div className={cn('value')}>{value}</div>
      </div>
    </div>
  );
};
