import { inject, injectable } from "inversify";
import axios, { AxiosRequestConfig } from "axios";

import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IRightechProxyService } from "./rightechProxy.interface";
import { IConfigService } from "../config/config.service.interface";
import { MQTT_BROCKER_API_URL, RequestMethod } from "../const";
import { RightechObjectDto } from "../dto/rightechObject.dto";
import { RightechModelDto } from "../dto/rightechModel.dto";
import { TEMPORARY_ANY } from "../types";

@injectable()
export class RightechProxyService implements IRightechProxyService {
  private readonly apiToken: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(
    @inject(TYPES.Logger) private logger: Omit<ILogger, "logger">,
    @inject(TYPES.ConfigService) private config: IConfigService,
  ) {
    this.apiToken = this.config.get("RIGHTECH_API_TOKEN") || "";
    this.defaultHeaders = {
      Authorization: `Bearer ${this.apiToken}`,
    };
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios({
        ...config,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
      });

      this.logger.log(
        `Success fetching data from ${config.url}:`,
        response.status,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching data from ${config.url}:`,
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw error;
    }
  }

  async getObjectById(id: string): Promise<RightechObjectDto> {
    return this.makeRequest<RightechObjectDto>({
      method: RequestMethod.GET,
      url: `${MQTT_BROCKER_API_URL}/objects/${id}`,
    });
  }

  async getObjectsList(): Promise<{ data: RightechObjectDto[] }> {
    return this.makeRequest<{ data: RightechObjectDto[] }>({
      method: RequestMethod.GET,
      url: `${MQTT_BROCKER_API_URL}/objects`,
    });
  }

  async getModelById(id: string): Promise<{ data: TEMPORARY_ANY }> {
    return this.makeRequest<{ data: TEMPORARY_ANY }>({
      method: RequestMethod.GET,
      url: `${MQTT_BROCKER_API_URL}/models/${id}`,
    });
  }

  async getModelsList(): Promise<{ data: RightechModelDto[] }> {
    return this.makeRequest<{ data: RightechModelDto[] }>({
      method: RequestMethod.GET,
      url: `${MQTT_BROCKER_API_URL}/models?with=data`,
    });
  }

  async getObjectsPackets(id: string): Promise<{ data: TEMPORARY_ANY[] }> {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);
    const toDate = new Date();

    return this.makeRequest<{ data: TEMPORARY_ANY[] }>({
      method: RequestMethod.GET,
      url: `${MQTT_BROCKER_API_URL}/objects/${id}/packets?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`,
    });
  }

  async callCommandById(
    id: string,
    command: string,
  ): Promise<{ data: TEMPORARY_ANY }> {
    return this.makeRequest<{ data: TEMPORARY_ANY }>({
      method: RequestMethod.POST,
      url: `${MQTT_BROCKER_API_URL}/objects/${id}/commands/${command}`,
      data: {},
    });
  }
}
