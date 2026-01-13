import { TEMPORARY_ANY } from "../types";

export interface IRightechProxyService {
  getModelById: (id: string) => Promise<{ data: TEMPORARY_ANY }>;
  getModelsList: () => Promise<{ data: TEMPORARY_ANY[] }>;
  getObjectById: (id: string) => Promise<{ state: TEMPORARY_ANY }>;
  getObjectsList: () => Promise<{ data: TEMPORARY_ANY[] }>;
  getObjectsPackets: (id: string) => Promise<{ data: TEMPORARY_ANY[] }>;
  callCommandById: (
    id: string,
    command: string,
  ) => Promise<{ data: TEMPORARY_ANY }>;
}
