import { PERIOD_1H } from "../const";
import { ObjectsDto } from "../dto/objects.dto";
import { ObjectsType, SensorObjectsType } from "../dto/types";
import { TEMPORARY_ANY } from "../types";

export class AtsapObject {
  constructor() {}

  public getObjectTypeById(id: string) {
    /**
     * @TODO: Убрать свитч, реализовать через маппы
     */
    switch (id[0]) {
      case "s":
        return ObjectsType.SENSOR;
      case "a":
        return ObjectsType.AUTOMATION;
      default:
        return ObjectsType.SENSOR;
    }
  }

  public getObjectSensorTypeById(id: string) {
    /**
     * @TODO: Убрать свитч, реализовать через маппы
     */
    if (id[0] !== "s") {
      return undefined;
    }

    switch (id[1]) {
      case "h":
        return SensorObjectsType.HUMIDITY;
      case "t":
        return SensorObjectsType.TEMPERATURE;
      default:
        return undefined;
    }
  }

  public getSensorValueSymbolById(id: string) {
    /**
     * @TODO: Убрать свитч, реализовать через маппы
     */
    if (id[0] !== "s") {
      return undefined;
    }

    switch (id[1]) {
      case "h":
        return "%";
      case "t":
        return "℃";
      default:
        return undefined;
    }
  }

  public getObjectFromRightech(
    rightechObjectState: TEMPORARY_ANY,
    rightechModelParam: TEMPORARY_ANY,
  ): ObjectsDto {
    const { id, name, description, reference } = rightechModelParam;
    const value = rightechObjectState[id];
    return {
      id,
      name,
      description,
      value,
      topic: reference,
      type: this.getObjectTypeById(id),
      sensorType: this.getObjectSensorTypeById(id),
      sensorValueSymbol: this.getSensorValueSymbolById(id),
    };
  }

  public getObjectHistory(history: TEMPORARY_ANY) {
    const historyMap = new Map<
      string,
      { time: number; payload: TEMPORARY_ANY }[]
    >();
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

    const result: TEMPORARY_ANY = {};

    for (const [topic, entries] of historyMap) {
      result[topic] = entries.map((entry) => entry.payload);
    }

    return result;
  }
}
