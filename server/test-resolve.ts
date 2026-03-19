import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";

import { TYPES } from "./src/types";
import { ILogger } from "./src/logger/logger.interface";
import { IConfigService } from "./src/config/config.service.interface";
import { IUnitsService } from "./src/services/units";
import { IMqttService } from "./src/services/mqtt/mqtt.interface";
import { IClimateControlService } from "./src/services/climate-control";
import { ClimateControlService } from "./src/services/climate-control/climateControl.service";
import { LoggerService } from "./src/logger/loggerService";
import { ConfigService } from "./src/config/config.service";
import { UnitsService } from "./src/services/units/unitsService.service";
import { MqttService } from "./src/services/mqtt/mqtt.service";
import { RightechProxyMqttService } from "./src/services/rightech-proxy/rightechProxyMqtt.service";
import { RightechProxyService } from "./src/services/rightech-proxy/rightechProxy.service";
import { RelayControllerOptions } from "./src/services/climate-control/types";

const testBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<IUnitsService>(TYPES.UnitsService).to(UnitsService).inSingletonScope();
  bind<IMqttService>(TYPES.MqttService).to(MqttService).inSingletonScope();
  bind<RightechProxyMqttService>(TYPES.RightechProxyMqttService)
    .to(RightechProxyMqttService)
    .inSingletonScope();
  bind<RightechProxyService>(TYPES.RightechProxyService)
    .to(RightechProxyService)
    .inSingletonScope();
  bind<RelayControllerOptions>(TYPES.RelayControllerOptions).toConstantValue(
    {},
  );
  bind<IClimateControlService>(TYPES.ClimateControlService)
    .to(ClimateControlService)
    .inSingletonScope();
});

async function test() {
  const container = new Container();
  container.load(testBindings);
  try {
    const service = container.get<IClimateControlService>(
      TYPES.ClimateControlService,
    );
    console.log("SUCCESS: Resolved ClimateControlService", service);
  } catch (error) {
    console.error("FAILED to resolve ClimateControlService:", error);
    console.error((error as any).stack);
  }
}

test();
