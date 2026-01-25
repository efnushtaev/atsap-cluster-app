import { ObjectsDto } from "../dto/objects.dto";
import { RightechModelDto } from "../dto/rightechModel.dto";
import { RightechObjectDto } from "../dto/rightechObject.dto";
import { TEMPORARY_ANY } from "../types";

export interface IRightechProxyService {
  getModelById: (id: string) => Promise<{ data: TEMPORARY_ANY }>;
  getModelsList: () => Promise<{ data: RightechModelDto[] }>;
  getObjectById: (id: string) => Promise<RightechObjectDto>;
  getObjectsList: () => Promise<{ data: RightechObjectDto[] }>;
  getObjectsPackets: (id: string) => Promise<{ data: TEMPORARY_ANY[] }>;
  callCommandById: (
    id: string,
    command: string,
  ) => Promise<{ data: ObjectsDto[] }>;
}
