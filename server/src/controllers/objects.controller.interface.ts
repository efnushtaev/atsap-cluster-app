import { NextFunction, Response, Request } from "express";

export interface IObjectsController {
  getObjectsList: (req: Request, res: Response, next: NextFunction) => void;
  getObjectsDetails: (req: Request, res: Response, next: NextFunction) => void;
  getObjectsHistory: (req: Request, res: Response, next: NextFunction) => void;
}
