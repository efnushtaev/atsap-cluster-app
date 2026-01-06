import { RightechObjectDto } from "../../dto/rightechObject.dto";
import { TEMPORARY_ANY } from "../../types";

export interface IRightechObjectService {
  getObjectById: (id: string) => Promise<{ data: RightechObjectDto }>;
  getAllObjects: () => Promise<{ data: RightechObjectDto[] }>;
  callCommandById: (
    id: string,
    command: string,
  ) => Promise<{ data: TEMPORARY_ANY }>;
}
