import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

/**
 * Сервис для работы с загрузкой файлов
 */
@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir = process.env.UPLOAD_DIR || 'uploads';

  constructor() {
    this.ensureUploadDirExists();
  }

  /**
   * Проверяет существование директории для загрузки и создает её при необходимости
   */
  private async ensureUploadDirExists(): Promise<void> {
    try {
      if (!(await existsAsync(this.uploadDir))) {
        await mkdirAsync(this.uploadDir, { recursive: true });
        this.logger.log(
          `Создана директория для загрузки файлов: ${this.uploadDir}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Ошибка при создании директории для загрузки: ${error.message}`,
      );
    }
  }

  /**
   * Сохраняет файл на диск
   * @param file Буфер файла
   * @param filename Имя файла
   * @param subDir Поддиректория для сохранения (опционально)
   * @returns Путь к сохраненному файлу
   */
  async saveFile(
    file: Buffer,
    filename: string,
    subDir?: string,
  ): Promise<string> {
    try {
      const targetDir = subDir
        ? path.join(this.uploadDir, subDir)
        : this.uploadDir;

      // Создаем поддиректорию, если она не существует
      if (subDir && !(await existsAsync(targetDir))) {
        await mkdirAsync(targetDir, { recursive: true });
      }

      // Формируем путь к файлу
      const filePath = path.join(targetDir, filename);

      // Сохраняем файл
      await writeFileAsync(filePath, file);

      this.logger.log(`Файл успешно сохранен: ${filePath}`);

      return filePath;
    } catch (error) {
      this.logger.error(
        `Ошибка при сохранении файла: ${error.message}`,
        error.stack,
      );
      throw new Error(`Не удалось сохранить файл: ${error.message}`);
    }
  }

  /**
   * Удаляет файл с диска
   * @param filePath Путь к файлу
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (await existsAsync(filePath)) {
        await promisify(fs.unlink)(filePath);
        this.logger.log(`Файл успешно удален: ${filePath}`);
      } else {
        this.logger.warn(`Файл не найден для удаления: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(
        `Ошибка при удалении файла: ${error.message}`,
        error.stack,
      );
      throw new Error(`Не удалось удалить файл: ${error.message}`);
    }
  }
}
