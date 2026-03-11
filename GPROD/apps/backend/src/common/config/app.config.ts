import { EnvHelper } from '../helpers/env.helper.js';

/**
 * Типизированная структура конфигурации приложения
 */
export interface AppConfig {
  app: {
    env: string;
    name: string;
    version: string;
    port: number;
    host: string;
    origin: string[];
    domain: string;
    baseUrl: string;
  };
  logging: {
    level: string;
    console: boolean;
    file: boolean;
    filePath: string;
  };
  database: {
    url: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiration: string;
    refreshExpiration: string;
  };
  rateLimits: {
    windowMs: number;
    maxRequests: number;
  };
  security: {
    bcryptRounds: number;
    corsEnabled: boolean;
    csrfEnabled: boolean;
    xssEnabled: boolean;
  };
}

/**
 * Создает конфигурацию на основе переменных окружения
 * @returns Конфигурация приложения
 */
export function createAppConfig(): AppConfig {
  // Получаем окружение из EnvHelper для оптимизации
  const isDev = EnvHelper.isDevelopment;
  const isProd = EnvHelper.isProduction;
  const isStage = EnvHelper.isStaging;
  const isTest = EnvHelper.isTest;

  // Настройки приложения
  const appEnv = EnvHelper.environment;
  const appPort = EnvHelper.getPort();
  const appHost = EnvHelper.get('HOST', 'localhost');
  const appDomain = isProd
    ? EnvHelper.get('DOMAIN', 'gprod.com')
    : isStage
      ? EnvHelper.get('DOMAIN', 'stage.gprod.com')
      : `${appHost}:${appPort}`;

  // Настройки для CORS
  const corsOrigin = EnvHelper.array('CORS_ORIGIN', [
    'http://localhost:3000',
    'http://localhost:5173',
    ...(isProd ? ['https://gprod.com'] : []),
    ...(isStage ? ['https://stage.gprod.com'] : []),
  ]);

  return {
    app: {
      env: appEnv,
      name: EnvHelper.get('APP_NAME', 'GPROD API'),
      version: EnvHelper.get('APP_VERSION', '1.0.0'),
      port: appPort,
      host: appHost,
      origin: corsOrigin,
      domain: appDomain,
      baseUrl: isProd
        ? `https://${appDomain}`
        : isStage
          ? `https://${appDomain}`
          : `http://${appHost}:${appPort}`,
    },
    logging: {
      level: isProd ? 'info' : isTest ? 'error' : 'debug',
      console: !isTest,
      file: isProd || isStage,
      filePath: EnvHelper.get('LOG_FILE_PATH', './logs/app.log'),
    },
    database: {
      url: EnvHelper.getDatabaseUrl(),
      host: EnvHelper.get('POSTGRES_HOST', 'localhost'),
      port: EnvHelper.int('POSTGRES_PORT', 5432),
      username: EnvHelper.get('POSTGRES_USER', 'postgres'),
      password: EnvHelper.get('POSTGRES_PASSWORD', 'postgres'),
      database: EnvHelper.get('POSTGRES_DB', 'gprod'),
    },
    auth: {
      jwtSecret: EnvHelper.getJwtSecret(),
      jwtExpiration: EnvHelper.getJwtExpires(),
      refreshExpiration: EnvHelper.get('JWT_REFRESH_EXPIRES', '7d'),
    },
    rateLimits: {
      windowMs: EnvHelper.int('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
      maxRequests: EnvHelper.int('RATE_LIMIT_MAX', 100),
    },
    security: {
      bcryptRounds: EnvHelper.int('BCRYPT_ROUNDS', 10),
      corsEnabled: EnvHelper.bool('CORS_ENABLED', true),
      csrfEnabled: EnvHelper.bool('CSRF_ENABLED', isProd || isStage),
      xssEnabled: EnvHelper.bool('XSS_ENABLED', true),
    },
  };
}

// Создаем конфигурацию приложения при импорте
export const appConfig = createAppConfig();

// Экспортируем функцию обновления конфигурации (полезно для тестов)
export function refreshConfig(): AppConfig {
  EnvHelper.clearCache();
  return createAppConfig();
}
