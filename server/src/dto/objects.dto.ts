import { IsString } from "class-validator";

import { ObjectsType, SensorObjectsType } from "./types";
import { ObjectsDto } from "./types";

export class SensorObjectsDto implements ObjectsDto {
  /**
   * Айди объекта
   */
  @IsString()
  id: string;
  /**
   * Тип объекта
   */
  type: ObjectsType.SENSOR;
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
  description: string;
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

export class AutomationObjectsDto implements ObjectsDto {
  /**
   * Айди объекта
   */
  @IsString()
  id: string;
  /**
   * Айди комманды
   */
  commandId: string;
  /**
   * Тип объекта
   */
  type: ObjectsType.AUTOMATION;
  /**
   * Топик объекта
   */
  topic: string;
  /**
   * Имя комманды
   */
  name: string;
  /**
   * Описание комманды
   */
  description: string;
  /**
   * Состояние автоматики
   */
  active?: boolean;
}
