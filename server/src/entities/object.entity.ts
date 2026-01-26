import { PERIOD_1H } from "../const";
import { ObjectsDto } from "../dto/objects.dto";
import { ObjectsType, SensorObjectsType } from "../dto/types";
import { RightechObjectDto } from "../dto/rightechObject.dto";
import { ModelChildren } from "../dto/rightechModel.dto";

// Маппинг для определения типа объекта по первому символу ID
const OBJECT_TYPE_MAP: Record<string, ObjectsType> = {
  s: ObjectsType.SENSOR,
  a: ObjectsType.AUTOMATION,
};

// Маппинг для определения типа сенсора по второму символу ID
const SENSOR_TYPE_MAP: Record<string, SensorObjectsType> = {
  h: SensorObjectsType.HUMIDITY,
  t: SensorObjectsType.TEMPERATURE,
};

// Маппинг для определения символа единицы измерения по второму символу ID
const SENSOR_SYMBOL_MAP: Record<string, string> = {
  h: "%",
  t: "℃",
};

export class AtsapObject {
  constructor() {}

  public getObjectTypeById(id: string): ObjectsType {
    // Используем маппинг вместо switch
    return OBJECT_TYPE_MAP[id[0]] || ObjectsType.SENSOR;
  }

  public getObjectSensorTypeById(id: string): SensorObjectsType | undefined {
    // Проверяем, что это сенсор
    if (id[0] !== "s") {
      return undefined;
    }

    // Используем маппинг вместо switch
    return SENSOR_TYPE_MAP[id[1]];
  }

  public getSensorValueSymbolById(id: string): string | undefined {
    // Проверяем, что это сенсор
    if (id[0] !== "s") {
      return undefined;
    }

    // Используем маппинг вместо switch
    return SENSOR_SYMBOL_MAP[id[1]];
  }

  public getObjectFromRightech(
    rightechObjectState: RightechObjectDto["state"],
    rightechModelParam: ModelChildren,
  ): ObjectsDto {
    const { id, name, description, reference } = rightechModelParam;

    const value = rightechObjectState[id];

    return {
      id,
      name,
      description,
      value,
      topic: reference || "",
      type: this.getObjectTypeById(id),
      sensorType: this.getObjectSensorTypeById(id),
      sensorValueSymbol: this.getSensorValueSymbolById(id),
    };
  }

  public getObjectHistory(
    history: Array<{
      topic?: string;
      time: number;
      payload: unknown;
    }>,
  ): Record<string, unknown[]> {
    const historyMap = new Map<string, { time: number; payload: unknown }[]>();
    const HISTORY_PERIOD_MILLISECONDS = PERIOD_1H * 1000;

    for (let i = 0; i < history.length; i++) {
      const { topic, time, payload } = history[i];

      if (!topic) continue;

      const topicHistory = historyMap.get(topic);

      if (!topicHistory) {
        historyMap.set(topic, [{ time, payload }]);
        continue;
      }

      const lastEntry = topicHistory[topicHistory.length - 1].time;

      if (time - lastEntry >= HISTORY_PERIOD_MILLISECONDS) {
        topicHistory.push({ time, payload });
      }
    }

    const result: Record<string, unknown[]> = {};

    for (const [topic, entries] of historyMap) {
      result[topic] = entries.map((entry) => entry.payload);
    }

    return result;
  }
}
