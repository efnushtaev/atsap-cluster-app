export interface ObjectItem {
  id: string;
  name: string;
  description?: string;
  value?: number | string | boolean;
  sensorValueSymbol?: string;
}

export interface ObjectsListProps {
  type?: 'sensors' | 'automations';
}
