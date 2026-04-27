import { IsString } from "class-validator";

export enum ObjectsType {
  SENSOR = "sensor",
  AUTOMATION = "automation",
}

export enum SensorObjectsType {
  HUMIDITY = "humidity",
  TEMPERATURE = "temperature",
  FLOAT_SENSOR = "Float",
}

export class ObjectsDto {
  /**
   * Айди объекта
   */
  @IsString()
  id: string;
  type: ObjectsType;
  topic: string;
  name: string;
  description: string;
  /**
   * Состояние автоматики
   */
  active?: boolean;
  /**
   * Тип датчика
   */
  sensorType?: SensorObjectsType;
  /**
   * Значение
   */
  value?: number | string | boolean;
  /**
   * Символ - обозначение единицы измерения датчика, если type=sensor
   */
  sensorValueSymbol?: string;
}
