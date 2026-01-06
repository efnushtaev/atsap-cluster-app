import { Container, ContainerModule, interfaces } from "inversify";

import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { TYPES } from "./types";
import { App } from "./app";
import { IConfigService } from "./config/config.service.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/loggerService";
import { ObjectController } from "./controllers/object.controller";
import { ExeptionFilter } from "./errors/exeption.filter";
import { ConfigService } from "./config/config.service";
import { IObjectController } from "./controllers/object.controller.interface";
import { RightechObjectService } from "./services/rightech-object-service/rightechObject.service";
import { IRightechObjectService } from "./services/rightech-object-service/rightechObject.interface";
import { IDemoService } from "./services/demo/demo.interface";
import { DemoService } from "./services/demo/demo.service";
import { IDemoController } from "./controllers/demo.controller.interface";
import { DemoController } from "./controllers/demo.controller";
import { MySQL } from "./services/my-sql-service/mySql.interface";
import { MySQLService } from "./services/my-sql-service/mySql.service";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<IRightechObjectService>(TYPES.RightechObjectService)
    .to(RightechObjectService)
    .inSingletonScope();
  bind<IObjectController>(TYPES.ObjectController)
    .to(ObjectController)
    .inSingletonScope();
  bind<IDemoService>(TYPES.DemoService).to(DemoService).inSingletonScope();
  bind<IDemoController>(TYPES.DemoController)
    .to(DemoController)
    .inSingletonScope();
  bind<MySQL>(TYPES.MySQL).to(MySQLService).inSingletonScope();
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
