import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TestcaseDto } from "./data-transfer-objects";
import { TestcaseService } from "./testcase.service";

@Controller('testcases')
export class TestcaseController {
  constructor (private testcaseService: TestcaseService) {}

  @Post()
  async create(@Body() dto: TestcaseDto) {
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