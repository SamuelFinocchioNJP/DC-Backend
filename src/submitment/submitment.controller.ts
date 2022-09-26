import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SubmitmentDto } from "./data-transfer-objects";
import { SubmitmentService } from "./submitment.service";

@Controller('submitments')
export class SubmitmentController {
  constructor (private testcaseService: SubmitmentService) {}

  @UseGuards(AuthGuard('passport-jwt'))
  @Post()
  async create(@Body() dto: SubmitmentDto, @Request() req) {
    dto.userId = req.user.sub;
    return await this.testcaseService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.testcaseService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.testcaseService.findOne(+id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.testcaseService.delete(+id);
  }
}