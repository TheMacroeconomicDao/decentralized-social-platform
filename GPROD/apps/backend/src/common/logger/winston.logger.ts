import type { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
// Импортируем модуль с нашей декларацией типов
import DailyRotateFile from 'winston-daily-rotate-file';
import { EnvHelper } from '../helpers/env.helper.js';
import { join } from 'path';
import * as fs from 'fs';

export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;
  private context?: string;
  private static instance: winston.Logger;

  constructor(context?: string) {
    this.context = context;

    if (!WinstonLogger.instance) {
      WinstonLogger.instance = this.createLogger();
    }

    this.logger = WinstonLogger.instance;
  }

  private createLogger(): winston.Logger {
    // Получаем настройки логирования
    const isProduction = EnvHelper.isProduction;
    const isStaging = EnvHelper.isStaging;
    const isDevelopment = EnvHelper.isDevelopment;
    const isTest = EnvHelper.isTest;

    // Настройки из переменных окружения
    const logLevel = EnvHelper.get(
      'LOG_LEVEL',
      isProduction ? 'info' : isTest ? 'error' : 'debug',
    );
    const logToConsole = !isTest;
    const logToFile =
      isProduction || isStaging || EnvHelper.bool('LOG_TO_FILE', false);

    // Формат логов в зависимости от окружения
    const jsonFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    const devFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.printf(
        ({ timestamp, level, message, context, ...meta }) => {
          const ctx = context || this.context || 'Application';
          const metadata = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';
          return `${timestamp} [${level}] [${ctx}] ${message}${metadata}`;
        },
      ),
    );

    // Транспорты для логгера
    const transports: any[] = [];

    // Добавляем консольный транспорт
    if (logToConsole) {
      transports.push(
        new winston.transports.Console({
          format: isDevelopment ? devFormat : jsonFormat,
        }),
      );
    }

    // Добавляем файловый транспорт если нужно
    if (logToFile) {
      // Создаем директорию для логов, если она не существует
      const dir = join(process.cwd(), 'logs');

      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
          console.error(
            `Ошибка при создании директории для логов: ${e.message}`,
          );
        }
      }

      // Базовые настройки для ротации файлов
      const rotateOptions = {
        dirname: dir,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: jsonFormat,
      };

      // Отдельный файл для ошибок с ротацией
      try {
        const errorTransport = new DailyRotateFile({
          ...rotateOptions,
          filename: 'error-%DATE%.log',
          level: 'error',
        });

        // Обрабатываем события транспорта
        errorTransport.on('error', (error) => {
          console.error(`Ошибка логирования: ${error.message}`);
        });

        transports.push(errorTransport);
      } catch (e) {
        console.error(
          `Ошибка инициализации транспорта для логов ошибок: ${e.message}`,
        );
      }

      // Общий файл логов с ротацией
      try {
        const appTransport = new DailyRotateFile({
          ...rotateOptions,
          filename: 'app-%DATE%.log',
        });

        // Обрабатываем события транспорта
        appTransport.on('error', (error) => {
          console.error(`Ошибка логирования: ${error.message}`);
        });

        transports.push(appTransport);
      } catch (e) {
        console.error(
          `Ошибка инициализации транспорта для общих логов: ${e.message}`,
        );
      }
    }

    return winston.createLogger({
      level: logLevel,
      defaultMeta: {
        service: EnvHelper.get('APP_NAME', 'GPROD API'),
        environment: EnvHelper.environment,
      },
      transports,
    });
  }

  // Вспомогательный метод для добавления контекста
  private getContextMessage(message: any, context?: string): string {
    const ctx = context || this.context;
    return ctx ? `[${ctx}] ${message}` : message;
  }

  // Метод для получения метаданных
  private getMetadata(
    additionalData?: Record<string, any>,
  ): Record<string, any> {
    if (!additionalData) return { context: this.context };
    return { ...additionalData, context: this.context };
  }

  // Основные методы логирования
  log(message: any, context?: string, meta?: Record<string, any>) {
    const metadata = this.getMetadata(meta);
    this.logger.info(this.getContextMessage(message, context), metadata);
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    meta?: Record<string, any>,
  ) {
    const metadata = this.getMetadata({
      ...(meta || {}),
      trace,
    });
    this.logger.error(this.getContextMessage(message, context), metadata);
  }

  warn(message: any, context?: string, meta?: Record<string, any>) {
    const metadata = this.getMetadata(meta);
    this.logger.warn(this.getContextMessage(message, context), metadata);
  }

  debug(message: any, context?: string, meta?: Record<string, any>) {
    const metadata = this.getMetadata(meta);
    this.logger.debug(this.getContextMessage(message, context), metadata);
  }

  verbose(message: any, context?: string, meta?: Record<string, any>) {
    const metadata = this.getMetadata(meta);
    this.logger.verbose(this.getContextMessage(message, context), metadata);
  }

  // Дополнительные полезные методы

  // Логирование с метриками производительности
  logWithPerformance(
    message: string,
    startTime: [number, number],
    context?: string,
    meta?: Record<string, any>,
  ) {
    const duration = process.hrtime(startTime);
    const durationMs = Math.round(duration[0] * 1000 + duration[1] / 1e6);

    const metadata = this.getMetadata({
      ...(meta || {}),
      performance: {
        durationMs,
      },
    });

    this.logger.info(
      this.getContextMessage(`${message} (${durationMs}ms)`, context),
      metadata,
    );
  }

  // Создание логгера с фиксированным контекстом
  withContext(context: string): WinstonLogger {
    return new WinstonLogger(context);
  }

  // Создание логгера с дополнительными метаданными
  withMetadata(metadata: Record<string, any>): WinstonLogger {
    const logger = new WinstonLogger(this.context);
    // Модифицируем логгер для добавления метаданных
    logger.logger = logger.logger.child(metadata);
    return logger;
  }
}
