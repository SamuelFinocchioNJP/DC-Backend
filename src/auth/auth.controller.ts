import { Body, Controller, ForbiddenException, Get, HttpCode, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './data-transfer-objects';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
