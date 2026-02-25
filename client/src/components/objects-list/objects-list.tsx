import { createCn } from 'bem-react-classname';

import { ObjectsCard } from '../objects-card';
import { useObjectsListFetching } from '../../hooks/use-objects-list-fetching';
import { ObjectsListProps } from './types';

import './styles.css';
import { NAVIGATION_PATHS } from '../constants';
import { transformObjectToCard } from '../../utils/transform-object-to-card';

const cn = createCn('listing');

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
        <ObjectsCard
          key={index}
          {...transformObjectToCard(obj)}
          navigateTo={NAVIGATION_PATHS[type]}
        />
      ))}
    </div>
  );
};
