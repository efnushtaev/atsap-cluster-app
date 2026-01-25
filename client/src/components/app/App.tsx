import { useState, useEffect, useRef } from 'react';
import { API_URLS, TIMESTAMP_MOCK } from '../constants';
import { TopBar } from '../top-bar';
import { Listing } from '../listing';
import { createCn } from 'bem-react-classname';
import { ActionField } from '../action-field';

import './styles.css'
import { TabBar } from '../tab-bar/tab-bar';

export const App = () => {
  const cn = createCn('app');
  const [timestamp, setTimestamp] = useState(TIMESTAMP_MOCK);

  // Refs для хранения значений между рендерами
  const counterRef = useRef(11);
  const currentTimestampRef = useRef(new Date(timestamp).getTime());

  useEffect(() => {
    const fetchTimestamp = async () => {
      if (counterRef.current < 10) {
        // Локальное обновление времени
        currentTimestampRef.current += 1000;
        setTimestamp(new Date(currentTimestampRef.current).toISOString());
        counterRef.current++;
      } else {
        // Сброс и запрос к серверу
        counterRef.current = 0;
        try {
          const response = await fetch(API_URLS.getTimestamp);
          const data = await response.json();
          const serverTime = new Date(data.timestamp).getTime();
          currentTimestampRef.current = serverTime;
          setTimestamp(data.timestamp);
        } catch (error) {
          console.error('Error fetching timestamp:', error);
          currentTimestampRef.current += 1000;
        }
      }
    };

    // Запускаем сразу и затем каждую секунду
    fetchTimestamp();
    const interval = setInterval(fetchTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn()} >
      <TopBar />
      <TabBar />
      <div className={cn('content')}>
        <ActionField />
        {/* <div className='rotate-scale-up' /> */}
        <Listing />
      </div>
    </div >
  );
}