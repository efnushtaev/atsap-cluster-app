import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { mockApi, isMockMode } from '../components/mock-api';

interface ObjectItem {
  id: string;
  name: string;
  description?: string;
  value?: number | string | boolean;
  sensorValueSymbol?: string;
}

interface GetSensorsListResponse {
  objectsList: ObjectItem[];
}

interface GetAutomationsListResponse {
  objectsList: ObjectItem[];
}

interface UseObjectsListResult {
  objects: ObjectItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch objects list data based on unit ID from query parameters
 * @param type - Type of objects to fetch ('sensors' or 'automations')
 * @returns Object containing objects list, loading state, and error state
 */
export const useObjectsListFetching = (type: 'sensors' | 'automations' = 'sensors'): UseObjectsListResult => {
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
          let data;
          if (type === 'sensors') {
            data = await mockApi.getSensorsList(id);
          } else {
            data = await mockApi.getAutomationsList(id);
          }
          setObjects(data.objectsList);
        } else {
          // Use real API
          const response = await fetch(`/api/v1/objects/list/${type}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let data;
          if (type === 'sensors') {
            data = await response.json() as GetSensorsListResponse;
          } else {
            data = await response.json() as GetAutomationsListResponse;
          }
          setObjects(data.objectsList);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        console.error('Error fetching objects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [location.search, type]);

  return { objects, loading, error };
};
