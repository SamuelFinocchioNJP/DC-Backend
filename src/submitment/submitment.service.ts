import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { SubmitmentDto } from './data-transfer-objects';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class SubmitmentService {
  constructor(private prisma: PrismaService) { }

  async create(data: SubmitmentDto) {
    // const client = piston({ server: "https://emkc.org" });

    // const runtimes = await client.runtimes();
    // // [{ language: 'python', version: '3.9.4', aliases: ['py'] }, ...]

    // const result = await client.execute('javascript', 'console.log(JSON.stringify([...Array(10)].map((x, i) => i)))');

    try {
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
