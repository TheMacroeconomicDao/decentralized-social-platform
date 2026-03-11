import { Injectable } from '@nestjs/common';
import type { AppConfig } from './app.config.js';
import {
  appConfig,
  createAppConfig,
  refreshConfig,
} from './app.config.js';
import { EnvHelper } from '../helpers/env.helper.js';

/**
 * Сервис для работы с конфигурацией приложения через DI
 */
@Injectable()
export class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = appConfig;
  }

  /**
   * Получает всю конфигурацию приложения
   */
  get(): AppConfig {
    return this.config;
  }

  /**
   * Обновляет конфигурацию из текущих переменных окружения
   * Полезно при динамическом изменении настроек
   */
  refresh(): AppConfig {
    this.config = refreshConfig();
    return this.config;
  }

  /**
   * Возвращает раздел app конфигурации
   */
  get app() {
    return this.config.app;
  }

  /**
   * Возвращает раздел database конфигурации
   */
  get database() {
    return this.config.database;
  }

  /**
   * Возвращает раздел auth конфигурации
   */
  get auth() {
    return this.config.auth;
  }

  /**
   * Возвращает раздел logging конфигурации
   */
  get logging() {
    return this.config.logging;
  }

  /**
   * Возвращает раздел rateLimits конфигурации
   */
  get rateLimits() {
    return this.config.rateLimits;
  }

  /**
   * Возвращает раздел security конфигурации
   */
  get security() {
    return this.config.security;
  }

  /**
   * Проверяет, запущено ли приложение в development режиме
   */
  get isDevelopment(): boolean {
    return EnvHelper.isDevelopment;
  }

  /**
   * Проверяет, запущено ли приложение в staging режиме
   */
  get isStaging(): boolean {
    return EnvHelper.isStaging;
  }

  /**
   * Проверяет, запущено ли приложение в production режиме
   */
  get isProduction(): boolean {
    return EnvHelper.isProduction;
  }

  /**
   * Проверяет, запущено ли приложение в тестовом режиме
   */
  get isTest(): boolean {
    return EnvHelper.isTest;
  }
}
