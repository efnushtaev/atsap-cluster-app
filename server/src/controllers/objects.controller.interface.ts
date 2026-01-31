import { NextFunction, Request, Response } from "express";

import { ControllerResponseMessage } from "../common/controller.types";
import { ObjectsDto } from "../dto/objects.dto";

export interface GetObjectsListBodyReq {
  id: string;
}

export type GetObjectsListResponse = { objectsList: ObjectsDto[] };

export interface IObjectsController {
  getObjectsList: (
    req: Request<never, never, GetObjectsListBodyReq>,
    res: Response,
    next: NextFunction,
  ) => ControllerResponseMessage<GetObjectsListResponse>;
}
