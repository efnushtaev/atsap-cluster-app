import { useState, useEffect } from 'react';
import { createCn } from 'bem-react-classname';
import { useLocation } from 'react-router-dom';

import { ObjectsCard } from '../objects-card';
import { mockApi, isMockMode } from '../mock-api';

import './styles.css';

const cn = createCn('listing');

interface ObjectItem {
  id: string;
  name: string;
  description?: string;
  value?: number | string | boolean;
  sensorValueSymbol?: string;
}

interface GetObjectsListResponse {
  objectsList: ObjectItem[];
}

export const ObjectsList = () => {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        // Extract id from query parameters
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');

        if (!id) {
          throw new Error('ID parameter is required');
        }

        if (isMockMode()) {
          // Use mock data
          const data = await mockApi.getObjectsList(id);
          setObjects(data.objectsList);
        } else {
          // Use real API
          const response = await fetch('/api/v1/objects/list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: GetObjectsListResponse = await response.json();
          setObjects(data.objectsList);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching objects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [location.search]);

  if (loading) {
    return <div className={'rotate-scale-up'} />;
  }

  if (error) {
    return <div className={cn()}>Ошибка загрузки: {error}</div>;
  }

  // Transform API response to match ObjectsCard props
  const transformedObjects = objects.map(obj => ({
    title: obj.name,
    describe: obj.description || '',
    value: obj.value !== undefined ? `${obj.value}${obj.sensorValueSymbol || ''}` : '',
  }));

  return (
    <div className={cn()}>
      {transformedObjects.map((card, index) => (
        <ObjectsCard key={index} {...card} />
      ))}
    </div>
  );
};
