import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import {
  GetObjectsListBodyReq,
  GetObjectsListResponse,
  IObjectsController,
} from "./objects.controller.interface";
import { BaseController } from "../common/baseController";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IRightechProxyService } from "../services/rightechProxy.interface";
import { ObjectsControllersRoutesURL, RequestMethod } from "../const";
import { AtsapObject } from "../entities/object.entity";

@injectable()
export class ObjectsController
  extends BaseController
  implements IObjectsController
{
  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.RightechProxyService)
    private rightechObjectService: IRightechProxyService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: ObjectsControllersRoutesURL.OBJECTS_LIST,
        method: RequestMethod.POST,
        func: this.getObjectsList,
      },
    ]);
  }

  async getObjectsList(
    { body }: Request<never, never, GetObjectsListBodyReq>,
    res: Response,
  ) {
    const rightechObject = await this.rightechObjectService.getObjectById({
      id: body.id,
    });
    /**
     * Запрос getModelById нужен для получения списка всех объектов юнита
     */
    const rightechModel = await this.rightechObjectService.getModelById({
      id: rightechObject.model,
    });

    const rightechObjectsList =
      await this.rightechObjectService.getObjectsList();

    const atsapObject = new AtsapObject();

    const objectsList = atsapObject.getObjectsListFromRightech(
      rightechObjectsList,
      rightechModel,
    );

    return this.ok<GetObjectsListResponse>(res, { objectsList });
  }
}
