import { createCn } from 'bem-react-classname';

import { ObjectsCard } from '../objects-card';
import { useObjectsListFetching } from '../../hooks/use-objects-list-fetching';
import { ObjectItem, ObjectsListProps } from './types';

import './styles.css';

const cn = createCn('listing');

const transformObjectToCard = (obj: ObjectItem) => ({
  title: obj.name,
  describe: obj.description || '',
  value:
    obj.value !== undefined ? `${obj.value}${obj.sensorValueSymbol || ''}` : '',
});

export const ObjectsList = ({ type = 'sensors' }: ObjectsListProps) => {
  const { objects, loading, error } = useObjectsListFetching(type);

  if (loading) {
    return <div className={'rotate-scale-up'} />;
  }

  if (error) {
    return <div className={cn()}>Ошибка загрузки: {error}</div>;
  }

  return (
    <div className={cn()}>
      {objects.map((obj, index) => (
        <ObjectsCard key={index} {...transformObjectToCard(obj)} />
      ))}
    </div>
  );
};
