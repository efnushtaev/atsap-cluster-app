import { inject, injectable } from "inversify";

import { ILogger } from "../../logger/logger.interface";
import { IConfigService } from "../../config/config.service.interface";
import { IUnitsService } from "./";
import { RightechProxyMqttService } from "../rightech-proxy";
import { UnitDto } from "../../dto/units.dto";
import { TYPES } from "../../types";
import { TEMPORARY_ANY } from "../../types";

@injectable()
export class UnitsService implements IUnitsService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.ConfigService) private config: IConfigService,
    @inject(TYPES.RightechProxyMqttService) private rightechProxyMqttService: RightechProxyMqttService,
  ) {
    this.logger.log("[UnitsService] initialized");
  }

  async getUnits(): Promise<UnitDto[]> {
    this.logger.log("[UnitsService] getUnits called (stub)");
    return [];
  }

  async callCommand(
    unitId: string,
    command: string,
    payload?: TEMPORARY_ANY,
  ): Promise<void> {
    this.logger.log(
      `[UnitsService] callCommand for unit ${unitId}, command ${command}`,
      payload,
    );
    const topic = `units/${unitId}/commands/${command}`;
    const message = payload ? JSON.stringify(payload) : "";
    await this.rightechProxyMqttService.publish(topic, message);
  }
}
