import { PrismaClient } from '@prisma/client';
import { EnvHelper } from '../src/common/helpers/env.helper';

// Используем EnvHelper для корректного определения URL базы данных
const prismaUrl = EnvHelper.getTestDatabaseUrl();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: prismaUrl,
    },
  },
});

/**
 * Очищает базу данных для тестов
 * @param preserveUsers Если true, не будет удалять пользователей (только проекты и токены)
 */
export async function cleanDb(preserveUsers = false): Promise<void> {
  try {
    console.log('Используется URL базы данных:', prismaUrl);

    // Проверяем структуру базы данных
    let hasRefreshToken = true;
    let hasProject = true;

    // Проверяем таблицы - безопасно пытаемся удалить одну запись, чтобы понять наличие таблицы
    try {
      await prisma.$executeRaw`DELETE FROM "RefreshToken" WHERE FALSE;`;
      console.log('Таблица RefreshToken существует');
    } catch (err) {
      console.log(
        'Таблица RefreshToken не существует или не доступна:',
        (err as Error).message,
      );
      hasRefreshToken = false;
    }

    try {
      await prisma.$executeRaw`DELETE FROM "Project" WHERE FALSE;`;
      console.log('Таблица Project существует');
    } catch (err) {
      console.log(
        'Таблица Project не существует или не доступна:',
        (err as Error).message,
      );
      hasProject = false;
    }

    // Очищаем таблицы в правильном порядке (сначала зависимые)
    if (hasRefreshToken) {
      await prisma.$executeRaw`TRUNCATE "RefreshToken" CASCADE;`;
      console.log('Таблица RefreshToken очищена');
    }

    if (hasProject) {
      await prisma.$executeRaw`TRUNCATE "Project" CASCADE;`;
      console.log('Таблица Project очищена');
    }

    // Удаляем пользователей только если не требуется их сохранить
    if (!preserveUsers) {
      await prisma.$executeRaw`TRUNCATE "User" CASCADE;`;
      console.log('Таблица User очищена');
    }

    console.log(
      `База данных успешно очищена${preserveUsers ? ' (сохранены пользователи)' : ''}`,
    );
  } catch (error) {
    console.error('Ошибка при очистке базы данных:', error);
    throw error;
  }
}
