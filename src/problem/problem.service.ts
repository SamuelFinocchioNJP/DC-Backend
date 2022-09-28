import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ProblemDto } from './data-transfer-objects';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class ProblemService {
  constructor(private prisma: PrismaService) { }

  async create(data: ProblemDto) {
    try {
      const problem = await this.prisma.problem.create({
        data: data,
      });

      return {
        message: 'Problem created successfully',
        data: problem,
        statusCode: 201,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new UnprocessableEntityException(error.code);
    }

    throw new InternalServerErrorException("Unhandled error");
  }

  async findMany() {
    return await this.prisma.problem.findMany();
  }

  async findSubmitments(userId: number, problemId: number) {
    const problem = await this.findOne(problemId);
    return await this.prisma.submitment.findMany({
      where: {
        userId,
        problemId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
      include: {
        testcaseList: true,
      }
    });

    if (!problem) {
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
