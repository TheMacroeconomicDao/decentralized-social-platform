import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';

/**
 * Обертка над Prisma Client для управления подключением к БД
 * и обеспечения интеграции с жизненным циклом NestJS
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  /**
   * Подключение к базе данных при инициализации модуля
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connection established');

    // Middleware больше не поддерживается в Prisma 6.x
    // Если нужно логирование, используйте встроенные опции log в конструкторе
  }

  /**
   * Отключение от базы данных при завершении работы модуля
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Проверка здоровья соединения с базой данных
   * @returns true если соединение работает, иначе false
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }
}
