export interface ObjectsDto {
  id: string;
  type: ObjectsType;
  topic: string;
  name: string;
  description: string;
}

export enum ObjectsType {
  SENSOR = "sensor",
  AUTOMATION = "automation",
}

export enum SensorObjectsType {
  HUMIDITY = "humidity",
  TEMPERATURE = "temperature",
}
