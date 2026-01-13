import { IsString } from "class-validator";

import { ObjectsType, SensorObjectsType } from "./types";

export class ObjectsDto {
  /**
   * Айди объекта
   */
  @IsString()
  id: string;
  /**
   * Тип объекта
   */
  type: ObjectsType;
  /**
   * Тип датчика
   */
  sensorType?: SensorObjectsType;
  /**
   * Топик объекта
   */
  topic: string;
  /**
   * Имя объекта
   */
  name: string;
  /**
   * Описание объекта
   */
  description?: string;
  /**
   * Значение
   */
  value?: number | string | boolean;
  /**
   * Символ - обозначение единицы измерения датчика, если type=sensor
   */
  sensorValueSymbol?: string;
}
