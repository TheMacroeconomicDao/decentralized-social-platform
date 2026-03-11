import { Module, Global } from '@nestjs/common';
import { UploadService } from './upload.service';

/**
 * Модуль для работы с загрузкой файлов
 */
@Global()
@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
