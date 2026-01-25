import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import {
  GetObjectsListParamsReq,
  GetObjectsListResponse,
  IObjectsController,
} from "./objects.controller.interface";
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
    ]);
  }

  async getObjectsList(
    { body }: Request<GetObjectsListParamsReq>,
    res: Response,
  ) {
    const { data: rightechModelData } =
      await this.rightechObjectService.getModelById(body.modelId);
    const { state: rightechObjectState } =
      await this.rightechObjectService.getObjectById(body.objectId);

    const atsapObject = new AtsapObject();

    const rightechModelParams = rightechModelData.children.find(
      (child: TEMPORARY_ANY) => child.id === "params",
    );

    console.log("rightechModelParams: ", rightechModelParams);

    const objectsList = rightechModelParams.children.map(
      (rightechModelParam: TEMPORARY_ANY) => {
        return atsapObject.getObjectFromRightech(
          rightechObjectState,
          rightechModelParam,
        );
      },
    );

    return this.ok<GetObjectsListResponse>(res, { objectsList });
  }

  // async getObjectsDetails(
  //   req: Request<GetObjectsDetailsParamsReq>,
  //   res: Response,
  // ) {
  //   const { data } = await this.rightechObjectService.getObjectById(
  //     req.params.objectId,
  //   );

  //   const atsapObject = new AtsapObject();

  //   atsapObject.getObjectFromRightech(rightechObjectState, rightechModelParam);

  //   return this.ok<GetObjectsDetailsRes>(res, { object: data });
  // }
}
