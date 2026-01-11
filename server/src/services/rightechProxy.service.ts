import { inject, injectable } from "inversify";
import axios from "axios";

import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IRightechProxyService } from "./rightechProxy.interface";
import { IConfigService } from "../config/config.service.interface";
import { MQTT_BROCKER_API_URL } from "../const";

@injectable()
export class RightechProxyService implements IRightechProxyService {
  constructor(
    @inject(TYPES.Logger) private logger: Omit<ILogger, "logger">,
    @inject(TYPES.ConfigService) private config: IConfigService,
  ) {}

  async getObjectById(id: string) {
    try {
      // @todo добавить типизацию для response
      const response = await axios.get(`${MQTT_BROCKER_API_URL}objects/${id}`, {
        headers: {
          Authorization: `Bearer ${this.config.get("RIGHTECH_API_TOKEN")}`,
        },
      });
      this.logger.log("Succes fetching data:", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching data:", JSON.stringify(error));
      return error as Error;
    }
  }

  async getObjectsList() {
    try {
      // @todo добавить типизацию для response
      const response = await axios.get(`${MQTT_BROCKER_API_URL}objects`, {
        headers: {
          Authorization: `Bearer ${this.config.get("RIGHTECH_API_TOKEN")}`,
        },
      });
      this.logger.log("Succes fetching data:", response.status);
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching data:", error);
      return error as Error;
    }
  }

  async getModelById(id: string) {
    try {
      // @todo добавить типизацию для response
      const response = await axios.get(`${MQTT_BROCKER_API_URL}models/${id}`, {
        headers: {
          Authorization: `Bearer ${this.config.get("RIGHTECH_API_TOKEN")}`,
        },
      });
      this.logger.log("Succes fetching data:", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching data:", JSON.stringify(error));
      return error as Error;
    }
  }

  async getModelsList() {
    try {
      // @todo добавить типизацию для response
      const response = await axios.get(
        `${MQTT_BROCKER_API_URL}models?with=data`,
        {
          headers: {
            Authorization: `Bearer ${this.config.get("RIGHTECH_API_TOKEN")}`,
          },
        },
      );
      this.logger.log("Succes fetching data:", response.status);
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching data:", error);
      return error as Error;
    }
  }

  async callCommandById(id: string, command: string) {
    try {
      // @todo добавить типизацию для response
      const response = await axios.post(
        `${MQTT_BROCKER_API_URL}objects/${id}/commands/${command}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.config.get("RIGHTECH_API_TOKEN")}`,
          },
        },
      );
      this.logger.log("Succes fetching data:", response.status);
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching data:", JSON.stringify(error));
      return error as Error;
    }
  }
}
