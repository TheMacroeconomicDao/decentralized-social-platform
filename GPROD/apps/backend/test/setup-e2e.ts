import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import * as express from 'express';
import helmet from 'helmet';
import { cleanDb } from './clean-db';

/**
 * Настраивает тестовое приложение NestJS для e2e тестов
 * @param app Инстанс приложения NestJS
 * @param preserveUsers Если true, не будет удалять пользователей при очистке БД
 */
export async function setupE2EApp(
  app: INestApplication,
  preserveUsers = false,
): Promise<void> {
  app.setGlobalPrefix('api/v1');
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'https:'],
          'script-src': ["'self'", 'https:'],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        },
      },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-prod-domain.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(express.json({ limit: '1mb' }));

  // Очищаем базу перед инициализацией приложения, с опцией сохранения пользователей
  await cleanDb(preserveUsers);

  await app.init();
}
