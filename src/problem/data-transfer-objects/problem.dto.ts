import { IsArray, IsBoolean, isJSON, IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProblemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  attachment: string;

  @IsString()
  @IsOptional()
  template?: string;

  @IsBoolean()
  @IsOptional()
  isCoding: boolean;

  @IsArray()
  @IsOptional()
  availableLanguages: string[];
}
