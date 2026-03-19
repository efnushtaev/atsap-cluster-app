export interface SensorData {
  temperature: number;
  humidity: number;
}

export interface Commands {
  fan?: boolean;
  humidifier?: boolean;
}

export interface RelayControllerOptions {
  T_SET?: number;
  T_HYST?: number;
  RH_SET?: number;
  RH_HYST?: number;
  T_MAX?: number;
  T_MIN?: number;
}
