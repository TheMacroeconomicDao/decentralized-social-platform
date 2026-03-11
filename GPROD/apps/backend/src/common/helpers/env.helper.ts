/**
 * EnvHelper - вспомогательный класс для работы с переменными окружения
 *
 * Особенности:
 * - Поддерживает три контура: development (dev), staging (stage), production (prod)
 * - Автоматически выбирает переменную на основе NODE_ENV
 * - Строгая типизация и валидация значений
 * - Логика fallback (резервные значения)
 * - Кэширование значений для производительности
 */
import * as fs from 'fs';
export class EnvHelper {
  // Определение контуров
  static readonly ENV_DEV = 'development';
  static readonly ENV_STAGE = 'staging';
  static readonly ENV_PROD = 'production';
  static readonly ENV_TEST = 'test';

  // Префиксы для переменных окружения (для обратной совместимости)
  private static readonly PREFIX_DEV = 'DEV';
  private static readonly PREFIX_STAGE = 'STAGE';
  private static readonly PREFIX_PROD = 'PRODUCTION';

  // Кэш для переменных окружения (оптимизация)
  private static cache: Record<string, string | number | boolean | string[]> =
    {};

  /**
   * Получает текущий контур выполнения
   */
  static get environment(): string {
    const env = process.env.NODE_ENV?.toLowerCase() || this.ENV_DEV;
    return env;
  }

  /**
   * Проверяет, запущено ли приложение в режиме разработки
   */
  static get isDevelopment(): boolean {
    return this.environment === this.ENV_DEV;
  }

  /**
   * Проверяет, запущено ли приложение в режиме staging
   */
  static get isStaging(): boolean {
    return this.environment === this.ENV_STAGE;
  }

  /**
   * Проверяет, запущено ли приложение в production режиме
   */
  static get isProduction(): boolean {
    return this.environment === this.ENV_PROD;
  }

  /**
   * Проверяет, запущено ли приложение в тестовом режиме
   */
  static get isTest(): boolean {
    return this.environment === this.ENV_TEST;
  }

  /**
   * Проверяет, запущено ли приложение в Docker контейнере
   */
  static get isDocker(): boolean {
    // Проверка на наличие файла /.dockerenv
    try {
      if (fs.existsSync('/.dockerenv')) {
        return true;
      }
    } catch (e) {
      // Игнорируем ошибки
    }

    // Альтернативная проверка через переменную окружения
    return process.env.RUNNING_IN_DOCKER === 'true';
  }

  /**
   * Получает префикс для текущего контура
   */
  private static getPrefix(): string {
    if (this.isProduction) return this.PREFIX_PROD;
    if (this.isStaging) return this.PREFIX_STAGE;
    if (this.isDevelopment) return this.PREFIX_DEV;
    return this.PREFIX_DEV; // По умолчанию, если NODE_ENV некорректен
  }

  /**
   * Определяет правильную переменную окружения для текущего контура
   * Обновлено для работы с новой структурой .env файлов:
   * - Сначала проверяет простую переменную без префикса (новый подход)
   * - Затем проверяет префиксированную переменную (обратная совместимость)
   */
  private static resolveKey(key: string): string | undefined {
    // Приоритет:
    // 1. Простая переменная без префикса (работа с отдельными .env файлами)
    // 2. Префиксированная переменная для текущего контура (обратная совместимость)

    // Ищем простую переменную (новый подход с отдельными .env файлами)
    const commonValue = process.env[key];
    if (commonValue !== undefined) return commonValue;

    // Обратная совместимость с префиксами
    const prefix = this.getPrefix();
    const prefixedValue = process.env[`${prefix}_${key}`];
    if (prefixedValue !== undefined) return prefixedValue;

    // Ищем в других контурах (fallback для обратной совместимости)
    if (prefix !== this.PREFIX_DEV) {
      const devValue = process.env[`${this.PREFIX_DEV}_${key}`];
      if (devValue !== undefined) return devValue;
    }

    if (prefix !== this.PREFIX_STAGE) {
      const stageValue = process.env[`${this.PREFIX_STAGE}_${key}`];
      if (stageValue !== undefined) return stageValue;
    }

    if (prefix !== this.PREFIX_PROD) {
      const prodValue = process.env[`${this.PREFIX_PROD}_${key}`];
      if (prodValue !== undefined) return prodValue;
    }

    return undefined;
  }

  /**
   * Получает строковое значение переменной окружения
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Значение переменной окружения или fallback
   */
  static get(key: string, fallback?: string, required = false): string {
    // Проверяем кэш
    const cacheKey = `string:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as string;
    }

    const value = this.resolveKey(key);

    if (value !== undefined) {
      this.cache[cacheKey] = value;
      return value;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    if (required) {
      const errorMsg = `Env variable ${key} not set. Проверьте .env файл для контура ${this.environment}!`;
      console.error(`EnvHelper: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    return '';
  }

  /**
   * Получает числовое значение переменной окружения
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена или невалидна
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Числовое значение переменной окружения или fallback
   */
  static int(key: string, fallback?: number, required = false): number {
    // Проверяем кэш
    const cacheKey = `int:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as number;
    }

    const stringValue = this.get(key, fallback?.toString(), required);

    if (stringValue === '') {
      return fallback !== undefined ? fallback : 0;
    }

    const num = Number(stringValue);

    if (isNaN(num)) {
      if (required) {
        throw new Error(
          `Env variable ${key} is not a valid number: ${stringValue}`,
        );
      }
      return fallback !== undefined ? fallback : 0;
    }

    this.cache[cacheKey] = num;
    return num;
  }

  /**
   * Получает логическое значение переменной окружения
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Логическое значение переменной окружения или fallback
   */
  static bool(key: string, fallback = false, required = false): boolean {
    // Проверяем кэш
    const cacheKey = `bool:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as boolean;
    }

    const value = this.get(key, fallback ? 'true' : 'false', required);
    const boolValue = value === 'true' || value === '1' || value === 'yes';

    this.cache[cacheKey] = boolValue;
    return boolValue;
  }

  /**
   * Получает массив строк из переменной окружения (разделенной запятыми)
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Массив строк из переменной окружения или fallback
   */
  static array(
    key: string,
    fallback: string[] = [],
    required = false,
  ): string[] {
    // Проверяем кэш
    const cacheKey = `array:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as string[];
    }

    const value = this.get(key, fallback.join(','), required);

    if (!value && fallback.length > 0) {
      return fallback;
    }

    const result = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    this.cache[cacheKey] = result;
    return result;
  }

  /**
   * Получает URL базы данных для текущего контура
   * @returns URL базы данных
   */
  static getDatabaseUrl(): string {
    // В режиме разработки логгера возвращаем фиктивное значение
    if (this.get('LOGGER_TEST_MODE', 'false') === 'true') {
      return 'postgresql://postgres:postgres@localhost:5432/logger_test';
    }

    // В тестовом режиме учитываем особенности запуска
    if (this.isTest) {
      return this.getTestDatabaseUrl();
    }

    // Приоритет для DATABASE_URL
    const dbUrl = this.get('DATABASE_URL', '', false);
    if (dbUrl) {
      return dbUrl;
    }

    // Для обратной совместимости формируем URL из отдельных параметров
    const host = this.get('POSTGRES_HOST', 'localhost');
    const port = this.int('POSTGRES_PORT', 5432);
    const user = this.get('POSTGRES_USER', 'postgres');
    const password = this.get('POSTGRES_PASSWORD', 'postgres');
    const database = this.get(
      'POSTGRES_DB',
      this.isProduction ? 'gprod' : 'gprod_dev',
    );

    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  /**
   * Получает URL базы данных специально для тестов
   * @returns URL базы данных для тестов, адаптированный под окружение
   */
  static getTestDatabaseUrl(): string {
    const dbUrl = this.get('DATABASE_URL', '');

    // Если явно задан URL через команду test:e2e:local
    if (dbUrl.includes('localhost')) {
      return dbUrl;
    }

    // Если запущено в Docker - используем db:5432
    if (this.isDocker) {
      // Убедимся, что URL сконфигурирован для Docker
      if (dbUrl && !dbUrl.includes('localhost') && dbUrl.includes('db:5432')) {
        return dbUrl;
      }
      // Если нет, используем дефолтное значение для Docker
      return 'postgresql://postgres:postgres@db:5432/gprod_test';
    }

    // Если запущено локально - преобразуем URL в localhost:5432
    if (dbUrl) {
      return dbUrl.replace('db:5432', 'localhost:5432');
    }

    // Дефолтное значение для локальных тестов
    return 'postgresql://postgres:postgres@localhost:5432/gprod_test';
  }

  /**
   * Получает секретный ключ для JWT токена
   * @returns Секретный ключ для JWT
   */
  static getJwtSecret(): string {
    // В режиме разработки логгера возвращаем тестовый ключ
    if (this.get('LOGGER_TEST_MODE', 'false') === 'true') {
      return 'test_secret_key_for_logger_testing';
    }

    return this.get('JWT_SECRET', undefined, true);
  }

  /**
   * Получает время жизни JWT токена
   * @returns Время жизни JWT
   */
  static getJwtExpires(): string {
    // В режиме разработки логгера возвращаем тестовый срок
    if (this.get('LOGGER_TEST_MODE', 'false') === 'true') {
      return '1d';
    }

    return this.get('JWT_EXPIRES', '15m', true);
  }

  /**
   * Получает порт для HTTP сервера
   * Учитывает окружение и Docker-контекст для более надежной работы
   * @returns Номер порта
   */
  static getPort(): number {
    // Получаем порт из переменных окружения с более строгой проверкой
    const portFromEnv = process.env.PORT;

    // Если порт уже определен через process.env напрямую
    if (portFromEnv) {
      const parsedPort = parseInt(portFromEnv, 10);
      if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort < 65536) {
        return parsedPort;
      }
      // Если порт некорректен, выводим предупреждение в консоль
      console.warn(
        `[EnvHelper] Некорректное значение PORT в env: "${portFromEnv}". Будет использовано значение по умолчанию.`,
      );
    }

    // Пробуем получить порт из кэша или через get метод
    const envPort = this.int('PORT', 0, false);

    // Если порт определен через EnvHelper и валиден
    if (envPort > 0 && envPort < 65536) {
      return envPort;
    }

    // Используем порты по умолчанию в зависимости от окружения
    if (this.isDevelopment) {
      return 3008; // Порт для разработки
    } else if (this.isStaging) {
      return 3003; // Порт для стейджинга
    } else if (this.isProduction) {
      return 3007; // Порт для продакшена
    } else if (this.isTest) {
      return 3009; // Порт для тестов
    }

    // Если ничего не определено, используем 3000 как самый последний fallback
    return 3000;
  }

  /**
   * Очищает кэш переменных окружения
   * Полезно для тестов или при необходимости обновить значения
   */
  static clearCache(): void {
    this.cache = {};
  }
}
