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

interface GetObjectsListResponse {
  objectsList: ObjectItem[];
}

interface UseObjectsListResult {
  objects: ObjectItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch objects list data based on unit ID from query parameters
 * @returns Object containing objects list, loading state, and error state
 */
export const useObjectsListFetching = (): UseObjectsListResult => {
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
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        console.error('Error fetching objects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [location.search]);

  return { objects, loading, error };
};
