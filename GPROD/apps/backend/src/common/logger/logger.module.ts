import { Module, Global } from '@nestjs/common';
import { WinstonLogger } from './winston.logger.js';
import { ConfigModule } from '../config/config.module.js';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: WinstonLogger,
      useFactory: () => {
        return new WinstonLogger('Application');
      },
    },
  ],
  exports: [WinstonLogger],
})
export class LoggerModule {}
