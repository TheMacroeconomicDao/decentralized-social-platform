import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { PrismaService } from '../../common/database/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByUsername(
      createUserDto.username,
    );
    const existingEmail = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser || existingEmail) {
      throw new ConflictException('User already exists');
    }
    const hash = await argon2.hash(createUserDto.password);
    return this.usersService.create({ ...createUserDto, password: hash });
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const valid = await argon2.verify(user.password, password);
    if (!valid) return null;
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    // Генерируем токены
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    // Сохраняем refresh токен в БД
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Срок действия 7 дней

    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Проверяем refresh_token в базе
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Проверяем срок действия
      if (new Date() > tokenRecord.expiresAt) {
        await this.prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      // Проверяем JWT
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const { sub, username, roles } = payload;

      // Генерируем новые токены (ротация refresh token)
      const new_access_token = await this.jwtService.signAsync(
        { sub, username, roles },
        { expiresIn: '15m' },
      );
      const new_refresh_token = await this.jwtService.signAsync(
        { sub, username, roles },
        { expiresIn: '7d' },
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Атомарно удаляем старый и создаём новый refresh token
      await this.prisma.$transaction([
        this.prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        }),
        this.prisma.refreshToken.create({
          data: {
            token: new_refresh_token,
            userId: tokenRecord.userId,
            expiresAt,
          },
        }),
      ]);

      return { access_token: new_access_token, refresh_token: new_refresh_token };
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number, refreshToken: string) {
    // Удаляем конкретный refresh токен из БД
    return this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });
  }

  async revokeAllUserTokens(userId: number) {
    // Удаляем все refresh токены пользователя
    return this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
