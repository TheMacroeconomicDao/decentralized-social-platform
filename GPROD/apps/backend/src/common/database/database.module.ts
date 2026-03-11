import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Глобальный модуль для работы с базой данных
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
