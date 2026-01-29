import { createCn } from 'bem-react-classname';

import { ObjectsCard } from '../objects-card';

import './styles.css';

const cn = createCn('listing');

const MOCK_LISTING = [
  {
    title: 'Объект №1',
    describe:
      'Описание объекта №1. Подробная информация о характеристиках и состоянии объекта.',
    value: '35%',
  },
  {
    title: 'Объект №2',
    describe:
      'Описание объекта №2. Подробная информация о характеристиках и состоянии объекта.',
    value: '23℃',
  },
  {
    title: 'Объект №3',
    describe:
      'Описание объекта №3. Подробная информация о характеристиках и состоянии объекта.',
    value: '55%',
  },
  {
    title: 'Объект №4',
    describe:
      'Описание объекта №4. Подробная информация о характеристиках и состоянии объекта.',
    value: '27℃',
  },
];

export const ObjectsList = () => {
  return (
    <div className={cn()}>
      {MOCK_LISTING.map((card, index) => (
        <ObjectsCard key={index} {...card} />
      ))}
    </div>
  );
};
