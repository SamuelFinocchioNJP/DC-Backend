import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProblemDto, SignUpDto } from "./data-transfer-objects";
import { ProblemService } from "./problem.service";

@Controller('problems')
export class ProblemController {
  constructor (private problemService: ProblemService, private prismaService: PrismaService) {}

  @Post()
  async create(@Body() dto: ProblemDto) {
    return await this.problemService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.problemService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.problemService.findOne(+id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.problemService.delete(+id);
  }
}