import { NextFunction, Request, Response } from "express";

import {
  ControllerResponseMessage,
  ParamsDicitionary,
} from "../common/controller.types";
import { ObjectsDto } from "../dto/objects.dto";

export interface GetObjectsListParamsReq extends ParamsDicitionary {
  modelId: string;
}

export type GetObjectsListResponse = { objectsList: ObjectsDto[] };

export interface IObjectsController {
  getObjectsList: (
    req: Request<GetObjectsListParamsReq>,
    res: Response,
    next: NextFunction,
  ) => ControllerResponseMessage<GetObjectsListResponse>;
}
