import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TestcaseDto } from './data-transfer-objects';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class TestcaseService {
  constructor(private prisma: PrismaService) { }

  async create(data: TestcaseDto) {
    try {
      const testcase = await this.prisma.testcase.create({
        data: data,
      });

      return {
        message: 'Testcase created successfully',
        data: testcase,
        statusCode: 201,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new UnprocessableEntityException(error.code);
    }

    throw new InternalServerErrorException("Unhandled error");
  }

  async findMany() {
    return await this.prisma.testcase.findMany();
  }

  async findOne(id: number) {
    const testcase = await this.prisma.testcase.findUnique({
      where: { id },
      include: {
        problem: true,
      },
    });

    if (!testcase) {
      throw new NotFoundException('testcase does not exist');
    }

    return testcase;
  }

  async delete(id: number) {
    return await this.prisma.testcase.delete({
      where: { id },
    });
  }
}
