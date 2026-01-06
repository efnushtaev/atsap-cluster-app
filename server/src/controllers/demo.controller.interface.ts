import { NextFunction, Response, Request } from "express";

export interface IDemoController {
  getTimestamp: (req: Request, res: Response, next: NextFunction) => void;
  getCount: (req: Request, res: Response, next: NextFunction) => void;
}
