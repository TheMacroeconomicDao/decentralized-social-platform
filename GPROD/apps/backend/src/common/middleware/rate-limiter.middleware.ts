import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { WinstonLogger } from '../logger/winston.logger.js';
import type { Request as ExpressRequest } from 'express';

// Определяю enum и интерфейс прямо здесь
export enum RateLimitType {
  DEFAULT = 'default',
}

export interface RateLimitOptions {
  limit: number;
  ttlSeconds: number;
  type?: RateLimitType;
  blockMultiplier?: number;
  weight?: number;
}

interface RateLimitRecord {
  count: number;
  lastRequest: Date;
  blockedUntil: Date | null;
  violations: number;
}

interface RateLimitRequest extends ExpressRequest {
  rateLimitOptions?: RateLimitOptions;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly ipLimits: Map<string, Record<string, RateLimitRecord>> =
    new Map();
  private readonly cleanupInterval: NodeJS.Timeout;
  private readonly logger: WinstonLogger = new WinstonLogger('RateLimiter');

  constructor(private readonly configService: ConfigService) {
    // Запускаем регулярную очистку устаревших записей
    this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000); // каждые 10 минут
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Исключения для health, swagger, probe
    if (
      req.path === '/api/v1/health' ||
      req.path === '/api/v1/docs' ||
      req.path.startsWith('/swagger') ||
      req.path.startsWith('/api/docs') ||
      (req.headers['user-agent'] && req.headers['user-agent'].includes('kube-probe'))
    ) {
      return next();
    }
    const typedReq = req as RateLimitRequest;
    const ip = req.ip || req.connection.remoteAddress;
    if (!ip) {
      this.logger.warn('Cannot determine client IP address');
      return next();
    }
    let rateLimitOptions: RateLimitOptions = typedReq.rateLimitOptions ?? {
      limit: this.configService.get<number>('RATE_LIMIT_DEFAULT', 60),
      ttlSeconds: this.configService.get<number>('RATE_LIMIT_TTL', 60),
      type: RateLimitType.DEFAULT,
      blockMultiplier: 2,
      weight: 1,
    };
    const rateType = rateLimitOptions.type ?? RateLimitType.DEFAULT;
    if (!this.ipLimits.has(ip)) {
      this.ipLimits.set(ip, {});
    }
    const ipRecords = this.ipLimits.get(ip);
    if (!ipRecords) {
      this.logger.warn('ipRecords is undefined');
      return next();
    }
    if (!ipRecords[rateType]) {
      ipRecords[rateType] = {
        count: 0,
        lastRequest: new Date(),
        blockedUntil: null,
        violations: 0,
      };
    }
    const record = ipRecords[rateType];
    const now = new Date();
    if (record.blockedUntil && now < record.blockedUntil) {
      const remainingTime = Math.ceil((record.blockedUntil.getTime() - now.getTime()) / 1000);
      this.logger.warn(`Rate limit violation: ${ip} is blocked for ${remainingTime}s more`);
      record.violations += 1;
      if (record.violations > 3) {
        const additionalBlock = record.violations * 10;
        record.blockedUntil = new Date(record.blockedUntil.getTime() + additionalBlock * 1000);
        this.logger.warn(`Increased block time for ${ip} by ${additionalBlock}s due to repeated violations`);
      }
      res.setHeader('Retry-After', remainingTime.toString());
      throw new HttpException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Too many requests. Try again in ${remainingTime} seconds.`,
        error: 'Too Many Requests',
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
    const timeSinceLastRequest = (now.getTime() - record.lastRequest.getTime()) / 1000;
    if (timeSinceLastRequest > rateLimitOptions.ttlSeconds) {
      record.count = 0;
      record.violations = Math.max(0, record.violations - 1);
    }
    record.count += rateLimitOptions.weight ?? 1;
    record.lastRequest = now;
    if (record.count > rateLimitOptions.limit) {
      record.violations += 1;
      const blockMultiplier = rateLimitOptions.blockMultiplier ?? 2;
      const blockTime = Math.min(
        600,
        rateLimitOptions.ttlSeconds * blockMultiplier * Math.pow(1.5, Math.min(5, record.violations - 1)),
      );
      record.blockedUntil = new Date(now.getTime() + blockTime * 1000);
      this.logger.warn(`Rate limit exceeded: ${ip} blocked for ${blockTime}s (violations: ${record.violations})`);
      res.setHeader('Retry-After', Math.ceil(blockTime).toString());
      throw new HttpException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Too many requests. Try again in ${Math.ceil(blockTime)} seconds.`,
        error: 'Too Many Requests',
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
    res.setHeader('X-RateLimit-Limit', rateLimitOptions.limit.toString());
    res.setHeader('X-RateLimit-Remaining', (rateLimitOptions.limit - record.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitOptions.ttlSeconds - timeSinceLastRequest).toString());
    next();
  }

  // Очистка устаревших записей
  private cleanup() {
    const now = new Date();
    const cleanupCount = { ips: 0, records: 0 };

    this.ipLimits.forEach((records, ip) => {
      let allExpired = true;
      let recordsRemoved = 0;

      Object.keys(records).forEach((type) => {
        const record = records[type];
        const timeSinceLastRequest =
          (now.getTime() - record.lastRequest.getTime()) / 1000;

        // Удаляем записи старше 1 часа и без активной блокировки
        if (
          timeSinceLastRequest > 3600 &&
          (!record.blockedUntil || now > record.blockedUntil)
        ) {
          delete records[type];
          recordsRemoved++;
        } else {
          allExpired = false;
        }
      });

      // Если все записи для IP удалены, удаляем сам IP
      if (allExpired) {
        this.ipLimits.delete(ip);
        cleanupCount.ips++;
      }

      cleanupCount.records += recordsRemoved;
    });

    if (cleanupCount.ips > 0 || cleanupCount.records > 0) {
      this.logger.debug(
        `Cleanup: removed ${cleanupCount.records} records for ${cleanupCount.ips} IPs`,
      );
    }
  }

  // Очистка при завершении работы
  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }
}
