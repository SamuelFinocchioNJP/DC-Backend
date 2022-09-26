import { ForbiddenException, Injectable, PreconditionFailedException } from '@nestjs/common';
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from './data-transfer-objects';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  signToken(id: number, username: string, email: string): string {
    const payload = {
      sub: id,
      username,
      email,
    };

    const secret = this.config.getOrThrow('JWT_SECRET');

    return this.jwt.sign(payload, {
      expiresIn: '1d',
      secret,
    });
  }

  async signUp(userData: SignUpDto) {
    if (userData.password !== userData.passwordConfirm) {
      throw new PreconditionFailedException('Password and confirmation missmatch');
    }

    const hash = await argon.hash(userData.password);
    const user = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email.toLowerCase(),
        hash: hash,
      },
    });

    delete user.hash;

    return {
      message: 'Registration success',
      statusCode: 200,
      data: user,
    };
  }

  async signIn(userData: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    const passwordMatch = await argon.verify(
      user.hash,
      userData.password
    );

    if(!passwordMatch) {
      throw new ForbiddenException('Incorrect password');
    }

    const token = this.signToken(user.id, user.username, user.email);

    return {
      message: 'Login success',
      statusCode: 200,
      data: token
    };
  }
}

