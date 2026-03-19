import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import {
  GetAutomationsListBodyReq,
  GetAutomationsListResponse,
  GetSensorsListBodyReq,
  GetSensorsListResponse,
  IObjectsController,
} from "./objects.controller.interface";
import { BaseController } from "../common/baseController";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IRightechProxyService } from "../services/rightech-proxy";
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
        path: ObjectsControllersRoutesURL.OBJECTS_LIST + "/sensors",
        method: RequestMethod.POST,
        func: this.getSensorsList,
      },
      {
        path: ObjectsControllersRoutesURL.OBJECTS_LIST + "/automations",
        method: RequestMethod.POST,
        func: this.getAutomationsList,
      },
      {
        path: ObjectsControllersRoutesURL.OBJECTS_LIST + "/call-command",
        method: RequestMethod.POST,
        func: this.callCommand,
      },
    ]);
  }

  async getSensorsList(
    { body }: Request<never, never, GetSensorsListBodyReq>,
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

    const objectsList = atsapObject.getSensorsListFromRightech({
      objectsList: rightechObjectsList,
      modelData: rightechModel,
      objectId: body.id,
    });

    return this.ok<GetSensorsListResponse>(res, { objectsList });
  }

  async getAutomationsList(
    { body }: Request<never, never, GetAutomationsListBodyReq>,
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

    const objectsList = atsapObject.getAutomationsListFromRightech(
      rightechObjectsList,
      rightechModel,
    );

    return this.ok<GetAutomationsListResponse>(res, { objectsList });
  }

  async callCommand(
    { body }: Request<never, never, { id: string; commandId: string }>,
    res: Response,
  ) {
    try {
      await this.rightechObjectService.callCommandById({
        id: body.id,
        command: body.commandId,
      });
      return this.ok(res, { success: true });
    } catch (error) {
      return this.send(res, 500, {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
