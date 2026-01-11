import { AtsapObjectsDto } from "../dto/atsapObjects.dto";
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
  ): AtsapObjectsDto {
    const { id, name, description } = rightechModelParam;
    const value = rightechObjectState[id];
    return {
      id,
      name,
      description,
      value,
      type: this.getObjectTypeById(id),
      sensorType: this.getObjectSensorTypeById(id),
      sensorValueSymbol: this.getSensorValueSymbolById(id),
    };
  }
}
