import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import { IObjectController } from "./object.controller.interface";
import { BaseController } from "../common/baseController";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IRightechObjectService } from "../services/rightech-object-service/rightechObject.interface";
import { ControllersRoutesURL, RequestMethod } from "../const";

@injectable()
export class ObjectController
  extends BaseController
  implements IObjectController
{
  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.RightechObjectService)
    private rightechObjectService: IRightechObjectService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: ControllersRoutesURL.OBJECT_ID,
        method: RequestMethod.GET,
        func: this.getObjectById,
      },
      {
        path: ControllersRoutesURL.OBJECTS_ALL,
        method: RequestMethod.GET,
        func: this.getAllObjects,
      },
      {
        path: ControllersRoutesURL.COMMAND_BY_ID,
        method: RequestMethod.POST,
        func: this.callCammandById,
      },
    ]);
  }

  async getObjectById({ params }: Request, res: Response) {
    const object = await this.rightechObjectService.getObjectById(params.id);

    return this.ok(res, { ...object });
  }

  async getAllObjects(_: Request, res: Response) {
    const object = await this.rightechObjectService.getAllObjects();

    return this.ok(res, { ...object });
  }

  async callCammandById({ params }: Request, res: Response) {
    const object = await this.rightechObjectService.callCommandById(
      params.id,
      params.command,
    );

    return this.ok(res, { ...object });
  }
}
