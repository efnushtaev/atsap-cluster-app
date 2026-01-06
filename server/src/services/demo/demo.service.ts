import { inject, injectable } from "inversify";

import { TYPES } from "../../types";
import { ILogger } from "../../logger/logger.interface";
import { IDemoService } from "./demo.interface";
import { IConfigService } from "../../config/config.service.interface";

@injectable()
export class DemoService implements IDemoService {
  constructor(
    @inject(TYPES.Logger) private logger: Omit<ILogger, "logger">,
    @inject(TYPES.ConfigService) private config: IConfigService,
  ) {}

  async getTimestamp() {
    try {
      const timestamp = new Date().toISOString();
      return { data: { timestamp } };
    } catch (error) {
      this.logger.error("Error fetching data:", error);
      return error as Error;
    }
  }

  async getCount() {
    try {
      return { data: { count: 0 } };
    } catch (error) {
      this.logger.error("Error fetching data:", error);
      return error as Error;
    }
  }
}
