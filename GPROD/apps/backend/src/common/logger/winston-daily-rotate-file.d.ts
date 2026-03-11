declare module 'winston-daily-rotate-file' {
  import * as winston from 'winston';
  import { EventEmitter } from 'events';

  interface DailyRotateFileTransportOptions
    extends winston.transport.TransportStreamOptions {
    filename?: string;
    dirname?: string;
    datePattern?: string;
    maxSize?: string;
    maxFiles?: string | number;
    zippedArchive?: boolean;
  }

  class DailyRotateFileTransport extends winston.transport {
    constructor(options?: DailyRotateFileTransportOptions);
    
    // Добавляем методы EventEmitter
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'finish', listener: () => void): this;
    on(event: 'new', listener: (filename: string) => void): this;
    on(event: 'rotate', listener: (oldFilename: string, newFilename: string) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  const transports: {
    DailyRotateFile: typeof DailyRotateFileTransport;
  };

  export = DailyRotateFileTransport;
}
