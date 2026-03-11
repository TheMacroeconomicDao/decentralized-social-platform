import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service.js';

/**
 * Глобальный модуль конфигурации для доступа к настройкам приложения
 * через DI в любом месте приложения
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
