import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import {
  GetUnitsListResponse,
  IUnitsController,
} from "./units.controller.interface";
import { BaseController } from "../common/baseController";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IRightechProxyService } from "../services/rightechProxy.interface";
import { UnitsControllersRoutesURL, RequestMethod } from "../const";
import { AtsapUnit } from "../entities/unit.entity";

@injectable()
export class UnitsController
  extends BaseController
  implements IUnitsController
{
  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.RightechProxyService)
    private rightechObjectService: IRightechProxyService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: UnitsControllersRoutesURL.UNITS_LIST,
        method: RequestMethod.GET,
        func: this.getUnitsList,
      },
    ]);
  }

  async getUnitsList(_: Request, res: Response) {
    const modelsList = await this.rightechObjectService.getModelsList();
    const atsapUnit = new AtsapUnit();

    const unitsList = modelsList.data.map((model) =>
      atsapUnit.getUnitFromRightech(model),
    );

    const result = {
      unitsList,
    };

    return this.ok<GetUnitsListResponse>(res, result);
  }
}
