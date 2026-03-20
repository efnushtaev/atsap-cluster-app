import { inject, injectable } from "inversify";

import { ILogger } from "../../logger/logger.interface";
import { IConfigService } from "../../config/config.service.interface";
import { IMqttService } from "../mqtt/mqtt.interface";
import { TYPES } from "../../types";
import {
  type Commands,
  type RelayControllerOptions,
  type SensorData,
} from "./types";
import { IUnitsService } from "../units";
import { IClimateControlService } from "./";
import { SensorObjectsType } from "../../dto/objects.dto";

@injectable()
export class ClimateControlService implements IClimateControlService {
  private T_SET: number;
  private T_HYST: number;
  private RH_SET: number;
  private RH_HYST: number;
  private T_MAX: number;
  private T_MIN: number;

  private fanState: boolean;
  private humState: boolean;
  private intervals = new Map<string, NodeJS.Timeout>();

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.ConfigService) private config: IConfigService,
    @inject(TYPES.UnitsService) private unitService: IUnitsService,
    @inject(TYPES.MqttService) private mqttService: IMqttService,
    @inject(TYPES.RelayControllerOptions) options: RelayControllerOptions = {},
  ) {
    this.T_SET = options.T_SET ?? this.getConfigNumber("CLIMATE_T_SET", 25);
    this.T_HYST = options.T_HYST ?? this.getConfigNumber("CLIMATE_T_HYST", 1);
    this.RH_SET = options.RH_SET ?? this.getConfigNumber("CLIMATE_RH_SET", 75);
    this.RH_HYST =
      options.RH_HYST ?? this.getConfigNumber("CLIMATE_RH_HYST", 10);
    this.T_MAX = options.T_MAX ?? this.getConfigNumber("CLIMATE_T_MAX", 29);
    this.T_MIN = options.T_MIN ?? this.getConfigNumber("CLIMATE_T_MIN", 24);

    this.fanState = false; // текущее состояние вытяжки
    this.humState = false; // текущее состояние увлажнителя

    this.logger.log("[ClimateControlService] initialized with settings:", {
      T_SET: this.T_SET,
      T_HYST: this.T_HYST,
      RH_SET: this.RH_SET,
      RH_HYST: this.RH_HYST,
      T_MAX: this.T_MAX,
      T_MIN: this.T_MIN,
    });
  }

  private getConfigNumber(key: string, defaultValue: number): number {
    const value = this.config.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private parseSensorDataFromMessage(message: Buffer): SensorData {
    try {
      const data = JSON.parse(message.toString());
      const objectsList: Array<{
        sensorType?: SensorObjectsType;
        value?: number | string | boolean;
      }> = data.objectsList || [];
      const tempObj = objectsList.find(
        (obj) =>
          obj.sensorType === SensorObjectsType.TEMPERATURE &&
          typeof obj.value === "number",
      );
      const humidityObj = objectsList.find(
        (obj) =>
          obj.sensorType === SensorObjectsType.HUMIDITY &&
          typeof obj.value === "number",
      );
      if (!tempObj || !humidityObj) {
        throw new Error("Missing temperature or humidity in sensor data");
      }
      const temperature = tempObj.value as number;
      const humidity = humidityObj.value as number;
      return { temperature, humidity };
    } catch (error) {
      this.logger.error(
        "[ClimateControlService] failed to parse sensor data from message:",
        error,
      );
      throw error;
    }
  }

  /**
   * Обновить состояние на основе новых данных с датчиков
   * @param sensorData - { temperature, humidity }
   * @returns команды для исполнительных устройств (fan, humidifier)
   */
  update(sensorData: SensorData): Commands {
    const { temperature, humidity } = sensorData;
    const commands: Commands = {};

    // Аварийные приоритеты
    if (temperature > this.T_MAX) {
      commands.fan = true; // включить вытяжку
      commands.humidifier = false; // выключить увлажнитель
      this.fanState = true;
      this.humState = false;
      return commands;
    }
    if (temperature < this.T_MIN) {
      commands.fan = false; // выключить вытяжку
      commands.humidifier = false;
      this.fanState = false;
      this.humState = false;
      return commands;
    }

    // Температурный контур
    if (temperature > this.T_SET + this.T_HYST / 2) {
      if (!this.fanState) commands.fan = true;
    } else if (temperature < this.T_SET - this.T_HYST / 2) {
      if (this.fanState) commands.fan = false;
    }

    // Влажностный контур
    if (humidity < this.RH_SET - this.RH_HYST / 2) {
      if (!this.humState) commands.humidifier = true;
    } else if (humidity > this.RH_SET + this.RH_HYST / 2) {
      if (this.humState) commands.humidifier = false;
    }

    // Обновить внутреннее состояние
    if (commands.fan !== undefined) this.fanState = commands.fan;
    if (commands.humidifier !== undefined) this.humState = commands.humidifier;

    return commands;
  }

  /**
   * Получить данные с датчиков климата используя подписку MQTT
   * @param unitId - идентификатор юнита
   * @returns данные с датчиков температуры и влажности
   */
  async getSensorsData(unitId: string): Promise<SensorData> {
    this.logger.log(
      `[ClimateControlService] fetching sensor data for unit ${unitId} via MQTT subscription`,
    );
    const topic = `units/${unitId}/sensors`;
    return new Promise<SensorData>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error(`Timeout waiting for sensor data from unit ${unitId}`),
        );
      }, 120000); // 2 minutes

      const callback = (receivedTopic: string, message: Buffer) => {
        clearTimeout(timeout);
        try {
          const sensorData = this.parseSensorDataFromMessage(message);
          this.logger.log(
            `[ClimateControlService] received sensor data via MQTT:`,
            sensorData,
          );
          // Unsubscribe after receiving data
          this.mqttService.unsubscribe(topic).catch((err) => {
            this.logger.warn(
              `[ClimateControlService] failed to unsubscribe from ${topic}:`,
              err,
            );
          });
          resolve(sensorData);
        } catch (error) {
          reject(error);
        }
      };

      this.mqttService
        .subscribe(topic, callback, { id: unitId })
        .catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }

  /**
   * Запустить фоновый контроль климата для указанного юнита.
   * Метод запускает периодическое обновление (update) на основе данных с датчиков.
   * @param unitId - идентификатор юнита
   */
  async executeControll(unitId: string): Promise<void> {
    this.logger.log(
      `[ClimateControlService] starting climate control for unit ${unitId}`,
    );
    // Если уже есть интервал для этого юнита, очистить его
    const existingInterval = this.intervals.get(unitId);
    if (existingInterval) {
      clearInterval(existingInterval);
      this.intervals.delete(unitId);
    }

    // Интервал обновления (по умолчанию 30 секунд)
    const intervalMs = this.getConfigNumber(
      "CLIMATE_CONTROL_INTERVAL_MS",
      30000,
    );
    const interval = setInterval(async () => {
      try {
        const sensorData = await this.getSensorsData(unitId);
        const commands = this.update(sensorData);
        this.logger.log(
          `[ClimateControlService] computed commands for unit ${unitId}:`,
          commands,
        );
        // Отправка команд через MQTT
        if (commands.fan !== undefined) {
          await this.mqttService.publish(
            `units/${unitId}/commands/fan`,
            JSON.stringify({ value: commands.fan }),
          );
        }
        if (commands.humidifier !== undefined) {
          await this.mqttService.publish(
            `units/${unitId}/commands/humidifier`,
            JSON.stringify({ value: commands.humidifier }),
          );
        }
      } catch (error) {
        this.logger.error(
          `[ClimateControlService] error in control loop for unit ${unitId}:`,
          error,
        );
      }
    }, intervalMs);

    this.intervals.set(unitId, interval);
  }
}
