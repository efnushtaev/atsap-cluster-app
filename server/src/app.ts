import { Server } from "http";
import express, { Express } from "express";
import { inject, injectable } from "inversify";
import bodyParser from "body-parser";

import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import "reflect-metadata";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ObjectController } from "./controllers/object.controller";
import { MySQL } from "./services/my-sql-service/mySql.interface";
import { DemoController } from "./controllers/demo.controller";

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.ObjectController) private objectController: ObjectController,
    @inject(TYPES.DemoController) private demoController: DemoController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.MySQL) private mySQL: MySQL,
  ) {
    this.app = express();
    this.port = 3001;
  }

  private useMiddleware(): void {
    this.app.use(bodyParser.json());
  }

  private useRoutes(): void {
    this.app.use("/mqttBrockerProxy", this.objectController.router);
  }

  private useExeptionFilters(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();

    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`);

    // this.mySQL.initializeDatabase().then(() => {
    //   this.server = this.app.listen(this.port);
    //   this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
    // });
  }
}
