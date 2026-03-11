import { NextFunction, Request, Response } from "express";

import { ControllerResponseMessage } from "../common/controller.types";
import { AutomationObjectsDto, SensorObjectsDto } from "../dto/objects.dto";

export type GetSensorsListBodyReq = {
  id: string;
}
export type GetAutomationsListBodyReq = {
  id: string;
}

export type GetSensorsListResponse = { objectsList: SensorObjectsDto[] };
export type GetAutomationsListResponse = { objectsList: AutomationObjectsDto[] };

export interface IObjectsController {
  getSensorsList: (
    req: Request<never, never, GetSensorsListBodyReq>,
    res: Response,
  ) => ControllerResponseMessage<GetSensorsListResponse>;

  getAutomationsList: (
    req: Request<never, never, GetAutomationsListBodyReq>,
    res: Response,
  ) => ControllerResponseMessage<GetAutomationsListResponse>;

  callCommand: (
    req: Request<never, never, { id: string; commandId: string; value: string }>,
    res: Response,
  ) => ControllerResponseMessage<{ success: boolean }>;
}
