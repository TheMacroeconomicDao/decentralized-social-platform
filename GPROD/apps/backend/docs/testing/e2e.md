# E2E-тестирование в GPROD Backend

## Обзор

E2E (end-to-end) тесты проверяют работу системы целиком, включая взаимодействие с базой данных и всеми компонентами. Эти тесты имитируют реальное взаимодействие пользователя с API.

## Структура e2e-тестов

### Расположение тестов

E2E-тесты располагаются в отдельной директории `test`:

```
test/
├── jest-e2e.json        # Конфигурация Jest для e2e тестов
├── jest-e2e-setup.js    # Настройка для e2e тестов
├── app.e2e-spec.ts      # Базовый тест приложения
└── modules/
    ├── auth.e2e-spec.ts # Тесты для аутентификации
    ├── users.e2e-spec.ts # Тесты для управления пользователями
    └── projects.e2e-spec.ts # Тесты для управления проектами
```

### Конфигурация Jest

```json
// jest-e2e.json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "setupFilesAfterEnv": ["./jest-e2e-setup.js"]
}
```

### Настройка e2e-тестов

```javascript
// jest-e2e-setup.js
jest.setTimeout(60000);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Непойманное отклонение (unhandledRejection):', promise, 'причина:', reason);
});
```

### Пример e2e-теста

```typescript
// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    
    // Важно: настраиваем приложение так же, как в main.ts
    app.setGlobalPrefix('api');
    // ... другие настройки
    
    await app.init();
    
    // Очистка тестовой БД перед тестами
    await prismaService.cleanDb();
    
    // Создание тестового пользователя и получение токена
    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prismaService.cleanDb();
    await app.close();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('ok');
      });
  });
  
  it('/api/v1/users (GET) - защищенный маршрут', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
  
  it('/api/v1/users (GET) - без токена', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(401);
  });
});
```

## Запуск e2e-тестов

### Локальный запуск

```bash
# Запуск всех e2e-тестов
pnpm run test:e2e

# Запуск с watch режимом
pnpm run test:e2e:watch

# Запуск конкретного теста
pnpm run test:e2e -- -t 'AuthController'
```

### Запуск в Docker

```bash
# Запуск e2e-тестов в Docker с изолированной БД
pnpm run docker:test:e2e

# Запуск всех тестов (unit + e2e)
pnpm run docker:test:all

# Запуск с чистым окружением
pnpm run docker:test:clean
```

## Особенности e2e-тестирования

### Требования к окружению

E2E тесты требуют:
1. Запущенного PostgreSQL сервера
2. Созданной тестовой базы данных
3. Применения миграций к тестовой базе данных

### Особенности работы с базой данных

При запуске e2e тестов система:
- Автоматически определяет, запущена ли она в Docker или локально
- Адаптирует DATABASE_URL соответствующим образом
- Очищает базу данных перед каждым тестом для изоляции тестовых данных

### Метод cleanDb()

```typescript
// Пример метода для очистки БД в PrismaService
async cleanDb() {
  // Отключаем внешние ключи для PostgreSQL
  await this.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  
  // Очищаем все таблицы, соблюдая порядок зависимостей
  const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `;
  
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    }
  }
  
  // Включаем внешние ключи
  await this.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
}
```

## Лучшие практики e2e-тестирования

### 1. Организуйте тесты по модулям

```typescript
describe('AuthModule (e2e)', () => {
  // Тесты для аутентификации
});

describe('UsersModule (e2e)', () => {
  // Тесты для управления пользователями
});
```

### 2. Используйте теги для запуска определённых тестов

```typescript
describe('Critical paths (e2e)', () => {
  // Критичные тесты, которые можно запустить отдельно:
  // pnpm run test:e2e -- -t 'Critical paths'
});
```

### 3. Создавайте вспомогательные утилиты

```typescript
// test/utils/auth-helper.ts
export async function getAuthToken(app, userData) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send(userData);
  
  return response.body.access_token;
}
```

### 4. Тестируйте пользовательские сценарии целиком

```typescript
it('should allow full project management flow', async () => {
  // 1. Создание проекта
  const createResponse = await request(app.getHttpServer())
    .post('/api/v1/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ name: 'Test Project', description: 'Test Description' })
    .expect(201);
  
  const projectId = createResponse.body.id;
  
  // 2. Получение проекта
  const getResponse = await request(app.getHttpServer())
    .get(`/api/v1/projects/${projectId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
  
  expect(getResponse.body.name).toBe('Test Project');
  
  // 3. Обновление проекта
  await request(app.getHttpServer())
    .patch(`/api/v1/projects/${projectId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ name: 'Updated Project' })
    .expect(200);
  
  // 4. Удаление проекта
  await request(app.getHttpServer())
    .delete(`/api/v1/projects/${projectId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
  
  // 5. Проверка, что проект удалён
  await request(app.getHttpServer())
    .get(`/api/v1/projects/${projectId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(404);
});
```

### 5. Тестирование ошибок и граничных случаев

```typescript
it('should handle invalid input properly', async () => {
  // Пустое тело запроса
  await request(app.getHttpServer())
    .post('/api/v1/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({})
    .expect(400);
  
  // Слишком длинное название
  await request(app.getHttpServer())
    .post('/api/v1/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ name: 'a'.repeat(256), description: 'Test' })
    .expect(400);
});
```

## Интеграция с Docker

Для тестирования в Docker используется скрипт `automation/scripts/docker-test-runner.sh`, который:

1. Ожидает доступности базы данных
2. Применяет миграции
3. Запускает тесты с правильными флагами

```bash
# Запуск всех тестов в Docker
pnpm run docker:test:all
```
