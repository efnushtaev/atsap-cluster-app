import { IsString } from "class-validator";

import { ObjectsType, SensorObjectsType } from "./types";

export class AtsapObjectsDto {
  @IsString()
  /**
   * Айди объекта
   */
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
