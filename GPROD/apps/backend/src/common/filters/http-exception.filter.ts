import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { WinstonLogger } from '../logger/winston.logger.js';
import { Catch } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new WinstonLogger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = exception;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
      error = (res as any).error || exception.name;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      stack = exception.stack;
    }

    if ((exception as any).type === 'entity.too.large') {
      status = HttpStatus.PAYLOAD_TOO_LARGE;
      message = 'Payload too large';
      error = 'PayloadTooLarge';
    }

    // Подготавливаем структуру ошибки для логирования и ответа
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      code: (exception as any)['code'] || null,
    };

    // Логируем ошибки разного уровня в зависимости от статуса
    const userId = request.user
      ? (request.user as any).userId || (request.user as any).sub
      : undefined;
    const userContext = userId ? { userId } : {};
    const requestId = (request as any)['requestId'] || '-';

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} ${status}`,
        stack,
        'HttpException',
        {
          ...errorResponse,
          ...userContext,
          ip: request.ip,
          requestId,
        },
      );
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(
        `[${request.method}] ${request.url} ${status}`,
        'HttpException',
        {
          ...errorResponse,
          ...userContext,
          ip: request.ip,
          requestId,
        },
      );
    } else {
      this.logger.debug(
        `[${request.method}] ${request.url} ${status}`,
        'HttpException',
        { ...errorResponse, requestId },
      );
    }

    response.status(status).json(errorResponse);
  }
}
