import { IsString } from "class-validator";

export class UnitDto {
  @IsString()
  /**
   * Айди юнита
   */
  id: string;
  /**
   * Имя юнита
   */
  name: string;
  /**
   * Описание юнита
   */
  description?: string;
}
