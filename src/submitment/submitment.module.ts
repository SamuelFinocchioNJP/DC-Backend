import { Module } from '@nestjs/common';
import { SubmitmentController } from './submitment.controller';
import { SubmitmentService } from './submitment.service';

@Module({
  controllers: [SubmitmentController],
  providers: [SubmitmentService],
})
export class SubmitmentModule { }
