import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProblemModule } from './problem/problem.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TestcaseModule } from './testcase/testcase.module';
import { SubmitmentModule } from './submitment/submitment.module';

@Module({
  imports: [AuthModule, UserModule, ProblemModule, TestcaseModule, SubmitmentModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
