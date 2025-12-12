/**
 * Production-ready система логирования
 * Автоматически отключает логи в production режиме
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info';

interface LogOptions {
  level?: LogLevel;
  context?: string;
  data?: unknown;
}

class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const context = options?.context || this.context;
    const prefix = context ? `[${context}]` : '';
    return `${prefix} ${message}`.trim();
  }

  private shouldLog(level: LogLevel): boolean {
    // В development логируем всё
    if (isDevelopment) return true;
    
    // В production логируем только ошибки
    if (isProduction) {
      return level === 'error';
    }
    
    // В других режимах логируем всё
    return true;
  }

  log(message: string, options?: LogOptions): void {
    if (!this.shouldLog('log')) return;
    
    const formattedMessage = this.formatMessage('log', message, options);
    
    if (options?.data) {
      // eslint-disable-next-line no-console
      console.log(formattedMessage, options.data);
    } else {
      // eslint-disable-next-line no-console
      console.log(formattedMessage);
    }
  }

  info(message: string, options?: LogOptions): void {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message, options);
    
    if (options?.data) {
      // eslint-disable-next-line no-console
      console.info(formattedMessage, options.data);
    } else {
      // eslint-disable-next-line no-console
      console.info(formattedMessage);
    }
  }

  warn(message: string, options?: LogOptions): void {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message, options);
    
    if (options?.data) {
      // eslint-disable-next-line no-console
      console.warn(formattedMessage, options.data);
    } else {
      // eslint-disable-next-line no-console
      console.warn(formattedMessage);
    }
  }

  error(message: string, error?: Error | unknown, options?: LogOptions): void {
    // Ошибки всегда логируем
    const formattedMessage = this.formatMessage('error', message, options);
    
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(formattedMessage, error);
      
      // В production можно отправлять ошибки в систему мониторинга
      if (isProduction && typeof window !== 'undefined') {
        // Здесь можно добавить отправку в Sentry, LogRocket и т.д.
        // sendToErrorTracking(error, { context: options?.context || this.context });
      }
    } else if (error) {
      // eslint-disable-next-line no-console
      console.error(formattedMessage, error);
    } else {
      // eslint-disable-next-line no-console
      console.error(formattedMessage);
    }
  }

  debug(message: string, options?: LogOptions): void {
    // Debug логи только в development
    if (!isDevelopment) return;
    
    const formattedMessage = this.formatMessage('debug', message, options);
    
    if (options?.data) {
      // eslint-disable-next-line no-console
      console.debug(formattedMessage, options.data);
    } else {
      // eslint-disable-next-line no-console
      console.debug(formattedMessage);
    }
  }
}

/**
 * Создать logger с контекстом
 */
export function createLogger(context?: string): Logger {
  return new Logger(context);
}

/**
 * Глобальный logger без контекста
 */
export const logger = new Logger();

/**
 * Экспорт для удобства
 */
export default logger;


