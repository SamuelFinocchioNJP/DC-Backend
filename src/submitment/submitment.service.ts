import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { SubmitmentDto } from './data-transfer-objects';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import piston from 'src/libs/piston-client/piston';

@Injectable({})
export class SubmitmentService {
  private pistonClient;

  constructor(private prisma: PrismaService) {
    this.pistonClient = piston({ server: "https://emkc.org" });
  }

  async create(data: SubmitmentDto) {
    // const runtimes = await this.pistonClient.runtimes();

    const problem = await this.prisma.problem.findUnique({
      where: { id: data.problemId },
      include: {
        testcaseList: true
      }
    });

    if (!problem) {
      throw new BadRequestException("Problem does not exist");
    }

    // TODO: refactor
    const report = [];
    let overallScore = 0;
    for (let testcase of problem.testcaseList) {
      if (problem.isCoding) {
        const result = await this.pistonClient.execute(data.language, data.code, {
          stdin: testcase.input,
        });

        console.info("Piston Outcome:", result)
        const outcomeStdout = result.run.stdout.trim();

        report.push({
          score: testcase.score * +(testcase.expectedOutput === outcomeStdout),
          stdout: outcomeStdout,
          outcome: testcase.expectedOutput === outcomeStdout
        });

        overallScore += testcase.score * +(testcase.expectedOutput === outcomeStdout);
      } else {
        const outcomeStdout = data.code.trim();
        report.push({
          score: testcase.score * +(testcase.expectedOutput === outcomeStdout),
          stdout: outcomeStdout,
          outcome: testcase.expectedOutput === outcomeStdout
        });

        overallScore += testcase.score * +(testcase.expectedOutput === outcomeStdout);
      }
    }

    try {
      data.report = report;
      data.score = overallScore;

      const submitment = await this.prisma.submitment.create({
        data: data,
      });

      return {
        message: 'Submitment created successfully',
        data: submitment,
        statusCode: 201,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new UnprocessableEntityException(error.code);
    }

    throw new InternalServerErrorException("Unhandled error");
  }

  async findMany() {
    return await this.prisma.submitment.findMany();
  }

  async findOne(id: number) {
    const submitment = await this.prisma.submitment.findUnique({
      where: { id },
      include: {
        problem: true,
      },
    });

    if (!submitment) {
      throw new NotFoundException('Submitment does not exist');
    }

    return submitment;
  }

  async delete(id: number) {
    return await this.prisma.submitment.delete({
      where: { id },
    });
  }
}
