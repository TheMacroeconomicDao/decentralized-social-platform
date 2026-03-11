import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';
import { WinstonLogger } from '../../common/logger/winston.logger.js';

@Injectable()
export class UsersService {
  private readonly logger = new WinstonLogger('UsersService');

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.debug('create', undefined, { username: createUserDto.username });
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (err) {
      this.logger.error('create failed', err?.stack);
      throw err;
    }
  }

  async findAll(page = 1, limit = 20, search?: string, sort?: string) {
    this.logger.debug('findAll', undefined, { page, limit, search, sort });
    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    let orderBy: any = { id: 'asc' };
    if (sort) {
      const [field, dir] = sort.split(':');
      if (field && dir && ['asc', 'desc'].includes(dir)) {
        orderBy = { [field]: dir };
      }
    }
    try {
      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
          orderBy,
        }),
        this.prisma.user.count({ where }),
      ]);
      this.logger.debug('findAll result', undefined, { found: data.length, total });
      return { data, total };
    } catch (err) {
      this.logger.error('findAll failed', err?.stack);
      throw err;
    }
  }

  async findOne(id: number) {
    this.logger.debug('findOne', undefined, { id });
    try {
      const user = await this.prisma.user.findFirst({
        where: { id, isActive: true },
      });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (err) {
      this.logger.error('findOne failed', err?.stack);
      throw err;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.debug('update', undefined, { id });
    try {
      await this.findOne(id);

      if (updateUserDto.password) {
        updateUserDto.password = await argon2.hash(updateUserDto.password);
        await this.prisma.refreshToken.deleteMany({ where: { userId: id } });
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (err) {
      this.logger.error('update failed', err?.stack);
      throw err;
    }
  }

  async remove(id: number) {
    this.logger.debug('remove', undefined, { id });
    try {
      await this.findOne(id);
      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      return { success: true };
    } catch (err) {
      this.logger.error('remove failed', err?.stack);
      throw err;
    }
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updatePassword(id: number, newPassword: string) {
    this.logger.debug('updatePassword', undefined, { id });
    try {
      await this.findOne(id);
      const hashedPassword = await argon2.hash(newPassword);

      return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.refreshToken.deleteMany({ where: { userId: id } });
        return tx.user.update({
          where: { id },
          data: { password: hashedPassword },
        });
      });
    } catch (err) {
      this.logger.error('updatePassword failed', err?.stack);
      throw err;
    }
  }
}
