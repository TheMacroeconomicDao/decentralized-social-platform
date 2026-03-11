import { Injectable } from '@nestjs/common';
import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { WinstonLogger } from '../logger/winston.logger.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new WinstonLogger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    // Генерируем уникальный идентификатор запроса
    const requestId = uuidv4();
    (request as any)['requestId'] = requestId;

    // Замеряем время запроса
    const startTime = process.hrtime();

    // Логируем начало запроса
    const startMessage = `Request started ${request.method} ${request.originalUrl}`;
    const startMeta = {
      requestId,
      method: request.method,
      url: request.originalUrl,
      ip: request.ip,
      headers: {
        'user-agent': request.get('user-agent'),
        'content-type': request.get('content-type'),
        'content-length': request.get('content-length'),
      },
    };
    this.logger.debug(startMessage, 'RequestLogger', startMeta);

    // Обработчик завершения запроса
    response.on('finish', () => {
      const duration = process.hrtime(startTime);
      const durationMs = Math.round(duration[0] * 1000 + duration[1] / 1e6);

      const userId = request.user
        ? (request.user as any).userId || (request.user as any).sub
        : undefined;

      // Определяем уровень логирования в зависимости от статуса
      const statusCode = response.statusCode;
      const message = `Request completed ${request.method} ${request.originalUrl} ${statusCode} ${durationMs}ms`;

      const meta = {
        requestId,
        method: request.method,
        url: request.originalUrl,
        statusCode,
        durationMs,
        contentLength: response.get('content-length'),
      };

      if (userId) {
        (meta as any).userId = userId;
      }

      if (statusCode >= 500) {
        this.logger.error(message, undefined, 'RequestLogger', meta);
      } else if (statusCode >= 400) {
        this.logger.warn(message, 'RequestLogger', meta);
      } else {
        this.logger.debug(message, 'RequestLogger', meta);
      }
    });

    next();
  }
}
