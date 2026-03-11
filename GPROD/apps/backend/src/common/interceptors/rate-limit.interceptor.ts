import { Injectable } from '@nestjs/common';
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator.js';
import type { RateLimitOptions } from '../decorators/rate-limit.decorator.js';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Получаем метаданные из декоратора
    const rateLimitOptions = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    // Если метаданные есть, устанавливаем их в request для использования в middleware
    if (rateLimitOptions) {
      request.rateLimitOptions = rateLimitOptions;
    }

    return next.handle();
  }
}
