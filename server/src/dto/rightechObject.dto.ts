import { IsString } from "class-validator";

export class RightechObjectDto {
  @IsString()
  model: string;
  id: string;
  name: string;
  state: Record<string, string | number | boolean | undefined>;
}
