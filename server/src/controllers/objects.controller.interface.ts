import { NextFunction, Request, Response } from "express";

import {
  ControllerResponseMessage,
  ParamsDicitionary,
} from "../common/controller.types";
import { ObjectsDto } from "../dto/objects.dto";

export interface GetObjectsDetailsParamsReq extends ParamsDicitionary {
  objectId: string;
}

export interface GetObjectsListParamsReq extends ParamsDicitionary {
  modelId: string;
}

export type GetObjectsDetailsResponse = { object: ObjectsDto };
export type GetObjectsListResponse = { objectsList: ObjectsDto[] };

export interface IObjectsController {
  getObjectsList: (
    req: Request<GetObjectsListParamsReq>,
    res: Response,
    next: NextFunction,
  ) => ControllerResponseMessage<GetObjectsListResponse>;

  // getObjectsDetails: (
  //   req: Request<GetObjectsDetailsParamsReq>,
  //   res: Response,
  //   next: NextFunction,
  // ) => ControllerResponseMessage<GetObjectsDetailsRes>;

  // getObjectsHistory: (req: Request, res: Response, next: NextFunction) => void;
}
