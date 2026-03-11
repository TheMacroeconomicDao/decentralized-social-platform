import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { EnvHelper } from './common/helpers/env.helper.js';
import { WinstonLogger } from './common/logger/winston.logger.js';
import * as express from 'express';
import helmet from 'helmet';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Улучшенная загрузка .env файла на основе NODE_ENV
function loadEnvFile() {
  // Получаем текущее окружение из переменной NODE_ENV
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Формируем имена потенциальных .env файлов
  const envFile = `.env.${nodeEnv}`;
  const defaultEnvFile = '.env';

  const logger = new WinstonLogger('EnvLoader');

  // Список файлов для проверки в порядке приоритета
  const envFiles = [
    envFile, // .env.development, .env.production, ...
    defaultEnvFile, // .env (обычно симлинк на активный контур)
  ];

  // Флаг успешной загрузки
  let envLoaded = false;

  // Перебираем файлы и загружаем первый найденный
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      logger.log(`Загружаем переменные окружения из ${file}`);

      // Загружаем переменные из файла
      const result = dotenv.config({ path: file });

      if (result.error) {
        logger.error(`Ошибка при загрузке ${file}: ${result.error}`);
        continue;
      }

      envLoaded = true;
      break;
    }
  }

  // Если не удалось загрузить ни один файл
  if (!envLoaded) {
    logger.warn(
      `Ни один из .env файлов не найден (искали: ${envFiles.join(', ')}). Используем только системные переменные окружения.`,
    );
  }

  // Отладочный вывод для важных переменных
  if (process.env.DEBUG === 'true') {
    logger.debug(`NODE_ENV: ${process.env.NODE_ENV}`);
    logger.debug(`PORT: ${process.env.PORT}`);
    logger.debug(
      `DATABASE_URL: ${process.env.DATABASE_URL ? '***настроен***' : 'не настроен'}`,
    );
  }
}

// Автоматические миграции в зависимости от окружения
async function autoMigrate() {
  const logger = new WinstonLogger('PrismaMigrate');
  const env = process.env.NODE_ENV || 'development';
  try {
    if (env === 'production' || env === 'stage' || env === 'staging') {
      logger.log('Выполняю prisma migrate deploy (prod/stage)...');
      await import('child_process').then(({ execSync }) => {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      });
    } else {
      logger.log('Выполняю prisma migrate dev (dev)...');
      await import('child_process').then(({ execSync }) => {
        execSync('npx prisma migrate dev --name auto --skip-generate --skip-seed', { stdio: 'inherit' });
      });
    }
  } catch (e) {
    logger.error('Ошибка при выполнении миграций', e.stack || e);
    if (env === 'production' || env === 'stage' || env === 'staging') {
      process.exit(1);
    }
  }
}

// Исправленная функция проверки схемы
async function checkSchema() {
  const logger = new WinstonLogger('Database');

  // Пропускаем проверку, если мы в режиме тестирования логгера
  if (EnvHelper.get('LOGGER_TEST_MODE', 'false') === 'true') {
    logger.log(
      'Пропускаем проверку схемы базы данных (режим тестирования логгера)',
    );
    return true;
  }

  // Обычная проверка схемы для рабочего режима
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRawUnsafe('SELECT roles FROM "User" LIMIT 1');
  } catch (e) {
    // Логируем и падаем, если нет поля
    logger.error(
      'FATAL: "roles" column missing in "User" table. Run migrations!',
      e.stack,
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Bootstrap function for starting the NestJS application
async function bootstrap() {
  // Загружаем переменные окружения до создания логгера
  loadEnvFile();

  // Очищаем кэш EnvHelper, чтобы гарантировать актуальность переменных
  EnvHelper.clearCache();

  // Авто-миграции до проверки схемы
  await autoMigrate();

  // WinstonLogger for structured logging (info, error, etc.)
  const logger = new WinstonLogger('Bootstrap');
  try {
    // Проверяем схему до старта приложения
    await checkSchema();

    logger.log('Starting application...');

    // Создаём приложение с кастомным логгером
    const app = await NestFactory.create(AppModule, {
      logger: logger,
      // Отключаем логирование NestJS-ом для входящих запросов, т.к. имеем свой middleware для этого
      bufferLogs: true,
    });

    // Включаем helmet с явной настройкой Content Security Policy (CSP)
    // Это защищает от XSS и других атак, явно указывая разрешённые источники
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'default-src': ["'self'"],
            'img-src': ["'self'", 'data:', 'https:'],
            'script-src': ["'self'", 'https:'],
            'style-src': ["'self'", 'https:', "'unsafe-inline'"],
            // Добавь свои домены если нужно
          },
        },
      }),
    );

    // Включаем CORS с origin из ENV (CORS_ORIGIN=...)
    // Это позволяет гибко управлять разрешёнными доменами для фронта
    app.enableCors({
      origin: EnvHelper.array('CORS_ORIGIN', [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://your-prod-domain.com',
      ]),
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    // Глобальные пайпы для валидации DTO (class-validator)
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    // Глобальный фильтр для обработки ошибок (кастомный формат)
    app.useGlobalFilters(new HttpExceptionFilter());
    // Ограничение размера body (1MB)
    app.use(express.json({ limit: '1mb' }));

    // Глобальный префикс для всех роутов: /api/v1
    // Все эндпоинты будут по /api/v1/...
    app.setGlobalPrefix('api/v1');

    // Swagger v1: документация для основной версии API
    const v1Config = new DocumentBuilder()
      .setTitle('GPROD API v1')
      .setDescription('REST API for users, auth, projects (v1)')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const v1Document = SwaggerModule.createDocument(app, v1Config);
    SwaggerModule.setup('api/v1/docs', app, v1Document);

    // Swagger v2: документация для будущей версии API (пример)
    // Контроллеры для v2 можно добавить в include
    const v2Config = new DocumentBuilder()
      .setTitle('GPROD API v2')
      .setDescription('REST API for users, auth, projects (v2)')
      .setVersion('2.0')
      .addBearerAuth()
      .build();
    const v2Document = SwaggerModule.createDocument(app, v2Config, {
      include: [], // сюда добавь контроллеры v2, если появятся
    });
    SwaggerModule.setup('api/v2/docs', app, v2Document);

    // Запуск приложения на порту из ENV (используем getPort из EnvHelper)
    const port = EnvHelper.getPort();
    await app.listen(port);
    logger.log(`Application started successfully on port ${port}`);
  } catch (err) {
    // Логируем фатальные ошибки старта через WinstonLogger
    logger.error('Fatal error during bootstrap', err.stack || err);
    process.exit(1);
  }
}
// Запуск bootstrap
bootstrap();
