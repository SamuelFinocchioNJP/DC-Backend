import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { ProblemDto, SignUpDto } from "./data-transfer-objects";
import { ProblemService } from "./problem.service";

@Controller('problems')
export class ProblemController {
  constructor(private problemService: ProblemService, private prismaService: PrismaService) { }

  @UseGuards(AuthGuard('passport-jwt'))
  @Post()
  async create(@Body() dto: ProblemDto) {
    return await this.problemService.create(dto);
  }

  @UseGuards(AuthGuard('passport-jwt'))
  @Get(':id/submitments')
  async findSubmitments(@Param('id') problemId: number, @Request() req) {
    const userId = req.user.sub;
    return await this.problemService.findSubmitments(+userId, +problemId);
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