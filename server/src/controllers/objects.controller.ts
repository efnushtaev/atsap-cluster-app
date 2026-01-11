import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import { IObjectsController } from "./objects.controller.interface";
import { BaseController } from "../common/baseController";
import { ILogger } from "../logger/logger.interface";
import { TEMPORARY_ANY, TYPES } from "../types";
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
      {
        path: ObjectsControllersRoutesURL.OBJECTS_DETAILS,
        method: RequestMethod.GET,
        func: this.getObjectsDetails,
      },
      {
        path: ObjectsControllersRoutesURL.OBJECTS_HISTORY,
        method: RequestMethod.GET,
        func: this.getObjectsHistory,
      },
    ]);
  }
  async getObjectsList({ body }: Request, res: Response) {
    const { data: rightechModelData } =
      await this.rightechObjectService.getModelById(body.modelId);
    const { state: rightechObjectState } =
      await this.rightechObjectService.getObjectById(body.objectId);

    const object = new AtsapObject();

    const rightechModelParams = rightechModelData.children.find(
      (child: TEMPORARY_ANY) => child.id === "params",
    );

    const objectsList = rightechModelParams.children.map(
      (rightechModelParam: TEMPORARY_ANY) => {
        return object.getObjectFromRightech(
          rightechObjectState,
          rightechModelParam,
        );
      },
    );

    return this.ok(res, { objectsList });
  }

  async getObjectsDetails({ params }: Request, res: Response) {
    const object = await this.rightechObjectService.callCommandById(
      params.id,
      params.command,
    );

    return this.ok(res, { ...object });
  }

  async getObjectsHistory({ params }: Request, res: Response) {
    const object = await this.rightechObjectService.getObjectById(params.id);

    return this.ok(res, { ...object });
  }
}
