import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rate_limit';

export enum RateLimitType {
  DEFAULT = 'default',
  CRITICAL = 'critical', // Для критичных операций (регистрация, логин)
  NORMAL = 'normal', // Для стандартных операций (CRUD)
  READ = 'read', // Для операций чтения
  WRITE = 'write', // Для операций записи
}

export interface RateLimitOptions {
  limit: number; // Максимальное количество запросов
  ttlSeconds: number; // Период сброса лимита в секундах
  type?: RateLimitType; // Тип ограничения
  blockMultiplier?: number; // Множитель времени блокировки при превышении лимита
  weight?: number; // Вес запроса (некоторые запросы могут считаться за несколько)
}

/**
 * Декоратор для ограничения частоты запросов
 * @param limit Максимальное количество запросов
 * @param ttlSeconds Период сброса лимита в секундах
 * @param options Дополнительные опции ограничения
 */
export function RateLimit(
  limit: number,
  ttlSeconds: number,
  options?: Partial<RateLimitOptions>,
) {
  const rateLimitOptions: RateLimitOptions = {
    limit,
    ttlSeconds,
    type: options?.type || RateLimitType.DEFAULT,
    blockMultiplier: options?.blockMultiplier || 2,
    weight: options?.weight || 1,
  };

  return SetMetadata(RATE_LIMIT_KEY, rateLimitOptions);
}

/**
 * Декоратор для критичных операций с низким лимитом
 * @param limit Максимальное количество запросов
 * @param ttlSeconds Период сброса лимита в секундах
 */
export function CriticalRateLimit(limit: number, ttlSeconds: number) {
  return RateLimit(limit, ttlSeconds, {
    type: RateLimitType.CRITICAL,
    blockMultiplier: 5, // Увеличиваем время блокировки в 5 раз при превышении
  });
}

/**
 * Декоратор для операций чтения с высоким лимитом
 * @param limit Максимальное количество запросов
 * @param ttlSeconds Период сброса лимита в секундах
 */
export function ReadRateLimit(limit: number, ttlSeconds: number) {
  return RateLimit(limit, ttlSeconds, {
    type: RateLimitType.READ,
    blockMultiplier: 1.5, // Небольшое увеличение времени блокировки
  });
}

/**
 * Декоратор для операций записи со средним лимитом
 * @param limit Максимальное количество запросов
 * @param ttlSeconds Период сброса лимита в секундах
 */
export function WriteRateLimit(limit: number, ttlSeconds: number) {
  return RateLimit(limit, ttlSeconds, {
    type: RateLimitType.WRITE,
    blockMultiplier: 3, // Среднее увеличение времени блокировки
  });
}
