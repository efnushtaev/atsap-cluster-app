import { PERIOD_1H } from "../const";
import { RightechObjectDto } from "../dto/rightechObject.dto";
import { RightechModelDto } from "../dto/rightechModel.dto";
import { ObjectsType, SensorObjectsType } from "../dto/objects.dto";
import { TEMPORARY_ANY } from "../types";

// Маппинг для определения типа объекта по первому символу ID
const OBJECT_TYPE_MAP: Record<string, ObjectsType> = {
  s: ObjectsType.SENSOR,
  a: ObjectsType.AUTOMATION,
};

// Маппинг для определения типа сенсора по второму символу ID
const SENSOR_TYPE_MAP: Record<string, SensorObjectsType> = {
  h: SensorObjectsType.HUMIDITY,
  t: SensorObjectsType.TEMPERATURE,
  f: SensorObjectsType.FLOAT_SENSOR,
};

// Маппинг для определения символа единицы измерения по второму символу ID
const SENSOR_SYMBOL_MAP: Record<string, string> = {
  h: "%",
  t: "℃",
};

export class AtsapObject {
  constructor() {}

  private getObjectTypeById(id: string): ObjectsType {
    // Используем маппинг вместо switch
    return OBJECT_TYPE_MAP[id[0]] || ObjectsType.SENSOR;
  }

  private getSensorObjectTypeById(id: string): SensorObjectsType | undefined {
    // Проверяем, что это сенсор
    if (id[0] !== "s") {
      return undefined;
    }

    // Используем маппинг вместо switch
    return SENSOR_TYPE_MAP[id[1]];
  }

  private getSensorValueSymbolById(id: string): string | undefined {
    // Проверяем, что это сенсор
    if (id[0] !== "s") {
      return undefined;
    }

    // Используем маппинг вместо switch
    return SENSOR_SYMBOL_MAP[id[1]];
  }

  public getSensorsListFromRightech({
    objectsList,
    modelData,
    objectId,
  }: {
    objectsList: RightechObjectDto[];
    modelData: RightechModelDto;
    objectId: string;
  }): TEMPORARY_ANY[] {
    const object = objectsList.find(
      (rightechObject) => rightechObject._id === objectId,
    );

    if (!object?.state) {
      return [];
    }

    const objectsParams = modelData.data.children.find(
      (child) => child.id === "params",
    );

    if (!objectsParams?.children) {
      return [];
    }

    return objectsParams.children.map((params) => {
      const { id, name, description = "", reference } = params;

      const value = object.state[id] === null ? undefined : object.state[id];

      return {
        id,
        name,
        description,
        value,
        topic: reference || "",
        type: ObjectsType.SENSOR,
        sensorType: this.getSensorObjectTypeById(id),
        sensorValueSymbol: this.getSensorValueSymbolById(id),
      };
    });
  }

  public getAutomationsListFromRightech(
    objectsList: RightechObjectDto[],
    modelData: RightechModelDto,
  ): TEMPORARY_ANY[] {
    const object = objectsList.find(
      (rightechObject) => rightechObject.model === modelData._id,
    );

    if (!object?.state) {
      return [];
    }

    const objectsParams = modelData.data.children.find(
      (child) => child.id === "cmds",
    );

    if (!objectsParams?.children) {
      return [];
    }

    return objectsParams.children.map((params) => {
      const { id, name, description = "", reference } = params;

      const value = object.state[id] === null ? undefined : object.state[id];

      return {
        id: object._id,
        commandId: id,
        name,
        description,
        value,
        topic: reference || "",
        type: ObjectsType.AUTOMATION,
        active: value === true,
      };
    });
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
