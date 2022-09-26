import { Body, Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private prismaService: PrismaService) { }

  @UseGuards(AuthGuard('passport-jwt'))
  @Get('me')
  async userInfo(@Request() req) {
    return req.user;
  }
}
