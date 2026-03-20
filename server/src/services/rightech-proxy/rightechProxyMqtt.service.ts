import { inject, injectable } from "inversify";
import axios, { AxiosRequestConfig } from "axios";

import { TYPES, TEMPORARY_ANY } from "../../types";
import { ILogger } from "../../logger/logger.interface";
import { IConfigService } from "../../config/config.service.interface";
import { IMqttService } from "./../mqtt/mqtt.interface";
import { IRightechProxyService } from "./";
import { RequestMethod } from "../../const";
import { AtsapObject } from "../../entities/object.entity";

@injectable()
export class RightechProxyMqttService implements IMqttService {
  private readonly apiToken: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly mqttProxyUrl: string;
  private readonly rightechProxyService: IRightechProxyService;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.ConfigService) private config: IConfigService,
    @inject(TYPES.RightechProxyService)
    rightechProxyService: IRightechProxyService,
  ) {
    this.apiToken = this.config.get("RIGHTECH_API_TOKEN") || "";
    this.mqttProxyUrl =
      this.config.get("MQTT_PROXY_URL") || "http://localhost:8001";
    this.defaultHeaders = {
      Authorization: `Bearer ${this.apiToken}`,
    };
    this.rightechProxyService = rightechProxyService;
    this.logger.log(
      "[RightechProxyMqttService] initialized with proxy URL:",
      this.mqttProxyUrl,
    );
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
        `[RightechProxyMqttService] Success request to ${config.url}:`,
        response.status,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `[RightechProxyMqttService] Error request to ${config.url}:`,
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw error;
    }
  }

  async publish(
    topic: string,
    message: string | Buffer,
    options?: TEMPORARY_ANY,
  ): Promise<void> {
    this.logger.log(
      `[RightechProxyMqttService] publish to ${topic}: ${message.toString()}`,
    );

    // Check if topic matches command pattern: units/{unitId}/commands/{command}
    const commandMatch = topic.match(/^units\/(.+)\/commands\/(.+)$/);
    if (commandMatch) {
      const [, unitId, command] = commandMatch;
      let data = {};
      try {
        const messageStr = message.toString();
        if (messageStr.trim() !== "") {
          data = JSON.parse(messageStr);
        }
      } catch (error) {
        this.logger.warn(
          `[RightechProxyMqttService] failed to parse message as JSON, using empty data:`,
          error instanceof Error ? error.message : JSON.stringify(error),
        );
      }
      this.logger.log(
        `[RightechProxyMqttService] forwarding command to Rightech API: unit ${unitId}, command ${command}`,
        data,
      );
      await this.rightechProxyService.callCommandById({
        id: unitId,
        command,
        data,
      });
      return;
    }

    // Otherwise, fallback to MQTT proxy
    await this.makeRequest({
      method: RequestMethod.POST,
      url: `${this.mqttProxyUrl}/mqtt/publish`,
      data: {
        topic,
        message: message.toString(),
        options,
      },
    });
  }

  private intervals = new Map<string, NodeJS.Timeout>();

  async subscribe(
    topic: string,
    callback: (topic: string, message: Buffer) => void,
    options?: TEMPORARY_ANY,
  ): Promise<void> {
    this.logger.log(`[RightechProxyMqttService] subscribe to ${topic}`);
    this.logger.log("[RightechProxyMqttService] options:", options);

    // Determine unitId from options or parse from topic
    let unitId = options?.id;
    if (!unitId && topic.startsWith("units/") && topic.endsWith("/sensors")) {
      // Extract unitId from pattern units/{unitId}/sensors
      const match = topic.match(/^units\/(.+)\/sensors$/);
      if (match) {
        unitId = match[1];
        this.logger.log(
          `[RightechProxyMqttService] extracted unitId from topic: ${unitId}`,
        );
      }
    }
    if (!unitId) {
      this.logger.error(
        `[RightechProxyMqttService] cannot determine unitId for topic ${topic}`,
      );
      // Still create interval but it will fail; we could throw, but for compatibility we'll keep interval and handle error later.
    }

    // Emulate subscription by polling every 5 minutes (300000 ms)
    const interval = setInterval(async () => {
      try {
        this.logger.log(
          `[RightechProxyMqttService] fetching packets for ${topic}`,
        );
        if (!unitId) {
          throw new Error(`UnitId not available for topic ${topic}`);
        }
        const rightechObject = await this.rightechProxyService.getObjectById({
          id: unitId,
        });
        /**
         * Запрос getModelById нужен для получения списка всех объектов юнита
         */
        const rightechModel = await this.rightechProxyService.getModelById({
          id: rightechObject.model,
        });

        const rightechObjectsList =
          await this.rightechProxyService.getObjectsList();

        const atsapObject = new AtsapObject();

        const objectsList = atsapObject.getSensorsListFromRightech({
          objectsList: rightechObjectsList,
          modelData: rightechModel,
          objectId: unitId,
        });

        const messageData = {
          timestamp: new Date().toISOString(),
          topic,
          objectsList,
        };

        const messageBuffer = Buffer.from(JSON.stringify(messageData));
        callback(topic, messageBuffer);
      } catch (error) {
        this.logger.error(
          `[RightechProxyMqttService] failed to fetch packets for ${topic}:`,
          error instanceof Error ? error.message : JSON.stringify(error),
        );
        // Optionally call callback with error message
        const errorMessage = Buffer.from(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            topic,
            error: "Failed to fetch data",
          }),
        );
        callback(topic, errorMessage);
      }
    }, 30000); // 30 seconds

    this.intervals.set(topic, interval);
  }

  async unsubscribe(topic: string): Promise<void> {
    this.logger.log(`[RightechProxyMqttService] unsubscribe from ${topic}`);
    const interval = this.intervals.get(topic);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(topic);
    }
  }
}
