import { createCn } from 'bem-react-classname';

import { ObjectsCard } from '../objects-card';
import { useObjectsListFetching } from '../../hooks/use-objects-list-fetching';

import './styles.css';

const cn = createCn('listing');

export const ObjectsList = () => {
  const { objects, loading, error } = useObjectsListFetching();

  if (loading) {
    return <div className={'rotate-scale-up'} />;
  }

  if (error) {
    return <div className={cn()}>Ошибка загрузки: {error}</div>;
  }

  // Transform API response to match ObjectsCard props
  const transformedObjects = objects.map((obj) => ({
    title: obj.name,
    describe: obj.description || '',
    value:
      obj.value !== undefined
        ? `${obj.value}${obj.sensorValueSymbol || ''}`
        : '',
  }));

  return (
    <div className={cn()}>
      {transformedObjects.map((card, index) => (
        <ObjectsCard key={index} {...card} />
      ))}
    </div>
  );
};
