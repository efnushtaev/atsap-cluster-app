import { NextFunction, Response, Request } from "express";

export interface IUnitsController {
  getUnitsList: (req: Request, res: Response, next: NextFunction) => void;
}
