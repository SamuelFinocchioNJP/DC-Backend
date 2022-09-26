import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class TestcaseDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  expectedOutput: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  score: number;

  @IsNumber()
  @IsNotEmpty()
  problemId: number;
}
