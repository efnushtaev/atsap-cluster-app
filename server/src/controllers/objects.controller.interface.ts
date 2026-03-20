import {  Request, Response } from "express";

import { ControllerResponseMessage } from "../common/controller.types";
import { TEMPORARY_ANY } from "../types";

export type GetSensorsListBodyReq = {
  id: string;
};
export type GetAutomationsListBodyReq = {
  id: string;
};

export type GetSensorsListResponse = { objectsList: TEMPORARY_ANY[] };
export type GetAutomationsListResponse = {
  objectsList: TEMPORARY_ANY[];
};

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
    req: Request<
      never,
      never,
      { id: string; commandId: string; value: string }
    >,
    res: Response,
  ) => ControllerResponseMessage<{ success: boolean }>;
}
