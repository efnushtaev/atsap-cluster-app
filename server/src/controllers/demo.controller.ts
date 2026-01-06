import { Response, Request } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../types";
import "reflect-metadata";
import { ILogger } from "../logger/logger.interface";
import { ControllersRoutesURL, RequestMethod } from "../const";
import { BaseController } from "../common/baseController";
import { IDemoController } from "./demo.controller.interface";
import { IDemoService } from "../services/demo/demo.interface";

@injectable()
export class DemoController extends BaseController implements IDemoController {
  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.DemoService)
    private demoService: IDemoService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: ControllersRoutesURL.DEMO_GET_COUNT,
        method: RequestMethod.GET,
        func: this.getCount,
      },
      {
        path: ControllersRoutesURL.DEMO_GET_TIMESTAMP,
        method: RequestMethod.GET,
        func: this.getTimestamp,
      },
    ]);
  }

  async getCount(_: unknown, res: Response) {
    const result = await this.demoService.getCount();

    return this.ok(res, { ...result });
  }

  async getTimestamp(_: Request, res: Response) {
    const result = await this.demoService.getTimestamp();

    return this.ok(res, { ...result });
  }
}
