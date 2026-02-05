import { Server } from "http";
import express, { Express } from "express";
import { inject, injectable } from "inversify";
import bodyParser from "body-parser";

import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import "reflect-metadata";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ObjectsController } from "./controllers/objects.controller";
import { MySQL } from "./services/mySql.interface";
import { API_V1_URL_PREFIX, ControllersDomens } from "./const";
import { UnitsController } from "./controllers/units.controller";

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.ObjectsController)
    private objectsController: ObjectsController,
    @inject(TYPES.UnitsController)
    private unitsController: UnitsController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.MySQL) private mySQL: MySQL,
  ) {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3001", 10);
  }

  private useMiddleware(): void {
    this.app.use(bodyParser.json());
  }

  private useRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).send("OK");
    });

    this.app.use(
      `${API_V1_URL_PREFIX}${ControllersDomens.OBJECTS}`,
      this.objectsController.router,
    );
    this.app.use(
      `${API_V1_URL_PREFIX}${ControllersDomens.UNITS}`,
      this.unitsController.router,
    );
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
