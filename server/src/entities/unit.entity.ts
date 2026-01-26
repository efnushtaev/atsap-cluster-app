import { RightechModelDto } from "../dto/rightechModel.dto";
import { UnitDto } from "../dto/units.dto";

export class AtsapUnit {
  constructor() {}

  public getUnitFromRightech(rightechModel: RightechModelDto): UnitDto {
    return {
      id: rightechModel._id,
      name: rightechModel.name,
      description: rightechModel.description,
    };
  }
}
