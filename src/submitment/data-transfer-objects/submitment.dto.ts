import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class SubmitmentDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  userId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  problemId: number;
}
