import {
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { PrismaModule } from './common/prisma.module.js';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware.js';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor.js';
import { LoggerModule } from './common/logger/logger.module.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware, RateLimiterMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
