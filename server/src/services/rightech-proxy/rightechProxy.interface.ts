import { RightechModelDto } from "../../dto/rightechModel.dto";
import { RightechObjectDto } from "../../dto/rightechObject.dto";
import { TEMPORARY_ANY } from "../../types";

export interface IRightechProxyService {
  getModelById: ({ id }: { id: string }) => Promise<RightechModelDto>;
  getObjectById: ({ id }: { id: string }) => Promise<RightechObjectDto>;
  getModelsList: () => Promise<RightechModelDto[]>;
  getObjectsList: () => Promise<RightechObjectDto[]>;
  getObjectsPackets: (id: string) => Promise<TEMPORARY_ANY[]>;
  callCommandById: ({
    id,
    command,
    data,
  }: {
    id: string;
    command: string;
    data?: TEMPORARY_ANY;
  }) => Promise<TEMPORARY_ANY>;
}
