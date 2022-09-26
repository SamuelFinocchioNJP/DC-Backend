import { Injectable, NotFoundException } from '@nestjs/common';
import { ProblemDto } from './data-transfer-objects';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class ProblemService {
  constructor(private prisma: PrismaService) {}

  async create(data: ProblemDto) {
    const problem = await this.prisma.problem.create({
      data: data,
    });

    return {
      message: 'Problem created successfully',
      data: problem,
      statusCode: 201,
    };
  }

  async findMany() {
    return await this.prisma.problem.findMany();
  }

  async findOne(id: number) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
      include: {
        testcaseList: true
      }
    });

    if(!problem) {
      throw new NotFoundException('Problem does not exist');
    }

    return problem;
  }

  async delete(id: number) {
    return await this.prisma.problem.delete({
      where: { id },
    });
  }
}
