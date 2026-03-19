import { Container, ContainerModule, interfaces } from "inversify";

import { type IExeptionFilter } from "./errors/exeption.filter.interface";
import { TYPES } from "./types";
import { App } from "./app";
import { type IConfigService } from "./config/config.service.interface";
import { type ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/loggerService";
import { ObjectsController } from "./controllers/objects.controller";
import { ExeptionFilter } from "./errors/exeption.filter";
import { ConfigService } from "./config/config.service";
import {
  type IRightechProxyService,
  RightechProxyService,
  RightechProxyMqttService,
} from "./services/rightech-proxy";
import { type MySQL, MySQLService } from "./services/mysql";
import { type IMqttService, MqttService } from "./services/mqtt";
import {
  type IClimateControlService,
  ClimateControlService,
} from "./services/climate-control";
import { RelayControllerOptions } from "./services/climate-control/types";
import { type IUnitsService, UnitsService } from "./services/units";
import { type IUnitsController } from "./controllers/units.controller.interface";
import { UnitsController } from "./controllers/units.controller";
import { type IObjectsController } from "./controllers/objects.controller.interface";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<IRightechProxyService>(TYPES.RightechProxyService)
    .to(RightechProxyService)
    .inSingletonScope();
  bind<IObjectsController>(TYPES.ObjectsController)
    .to(ObjectsController)
    .inSingletonScope();
  bind<IUnitsController>(TYPES.UnitsController)
    .to(UnitsController)
    .inSingletonScope();
  bind<MySQL>(TYPES.MySQL).to(MySQLService).inSingletonScope();
  bind<IMqttService>(TYPES.MqttService).to(MqttService).inSingletonScope();
  bind<RightechProxyMqttService>(TYPES.RightechProxyMqttService)
    .to(RightechProxyMqttService)
    .inSingletonScope();
  bind<RelayControllerOptions>(TYPES.RelayControllerOptions).toConstantValue(
    {},
  );
  bind<IUnitsService>(TYPES.UnitsService).to(UnitsService).inSingletonScope();
  bind<IClimateControlService>(TYPES.ClimateControlService)
    .to(ClimateControlService)
    .inSingletonScope();
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.ExeptionFilter)
    .to(ExeptionFilter)
    .inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
}

bootstrap();
