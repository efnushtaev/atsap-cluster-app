import { NextFunction, Response, Request } from "express";

import { UnitDto } from "../dto/units.dto";
import { ControllerResponseMessage } from "../common/controller.types";

export type GetUnitsListResponse = { unitsList: UnitDto[] };

export interface IUnitsController {
  getUnitsList: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => ControllerResponseMessage<GetUnitsListResponse>;
}
