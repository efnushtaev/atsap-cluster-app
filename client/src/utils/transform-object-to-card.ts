import { ObjectItem } from "../components";

export const transformObjectToCard = (obj: ObjectItem) => ({
  title: obj.name,
  describe: obj.description || '',
  value:
    obj.value !== undefined ? `${obj.value}${obj.sensorValueSymbol || ''}` : '',
});