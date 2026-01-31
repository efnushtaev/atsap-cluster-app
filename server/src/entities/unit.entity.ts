import { RightechObjectDto } from "../dto/rightechObject.dto";
import { UnitDto } from "../dto/units.dto";

export class AtsapUnit {
  constructor() {}

  public getListFromRightechObjectsList(
    rightechObject: RightechObjectDto[],
  ): UnitDto[] {
    return rightechObject.map((model) => ({
      id: model._id,
      name: model.name,
      description: model.description,
    }));
  }
}
