import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import { IUnitsController } from "./units.controller.interface";
import { BaseController } from "../common/baseController";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IRightechProxyService } from "../services/rightechProxy.interface";
import { UnitsControllersRoutesURL, RequestMethod } from "../const";

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
    const unitsList = await this.rightechObjectService.getModelsList();

    return this.ok(res, { unitsList });
  }
}
