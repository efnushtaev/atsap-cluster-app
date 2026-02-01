import { mockUnits, mockObjects } from './mock-data';

// Mock API service
export const mockApi = {
  getUnitsList: async (): Promise<{ unitsList: typeof mockUnits }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock units data
    return { unitsList: mockUnits };
  },

  getObjectsList: async (id: string): Promise<{ objectsList: typeof mockObjects }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real scenario, we might filter objects based on the unit ID
    // For now, we'll return all mock objects
    return { objectsList: mockObjects };
  },
};

// Function to check if we're in mock mode
export const isMockMode = (): boolean => {
  return process.env.REACT_APP_MOCK_MODE === 'true';
};