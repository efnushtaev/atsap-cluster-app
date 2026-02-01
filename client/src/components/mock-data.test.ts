import { mockUnits, mockObjects } from './mock-data';

describe('Mock Data', () => {
  test('should have correct structure for mockUnits', () => {
    expect(mockUnits).toBeDefined();
    expect(Array.isArray(mockUnits)).toBe(true);
    expect(mockUnits.length).toBeGreaterThan(0);
    
    // Check the structure of the first unit
    const firstUnit = mockUnits[0];
    expect(firstUnit).toHaveProperty('id');
    expect(firstUnit).toHaveProperty('name');
    expect(firstUnit).toHaveProperty('description');
  });

  test('should have correct structure for mockObjects', () => {
    expect(mockObjects).toBeDefined();
    expect(Array.isArray(mockObjects)).toBe(true);
    expect(mockObjects.length).toBeGreaterThan(0);
    
    // Check the structure of the first object
    const firstObject = mockObjects[0];
    expect(firstObject).toHaveProperty('id');
    expect(firstObject).toHaveProperty('name');
    expect(firstObject).toHaveProperty('description');
    expect(firstObject).toHaveProperty('value');
    expect(firstObject).toHaveProperty('sensorValueSymbol');
  });
});