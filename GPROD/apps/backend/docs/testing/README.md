# Тестирование GPROD Backend

## Общий подход к тестированию

Проект GPROD Backend использует две основные стратегии тестирования:
1. **Unit-тесты** - для проверки отдельных модулей и компонентов
2. **E2E-тесты** - для проверки интеграции компонентов и API

Все тесты интегрированы в CI/CD пайплайн и автоматически запускаются в Docker-окружении.

## Быстрый старт

```bash
# Запуск всех тестов в Docker
pnpm run docker:test:all

# Запуск с чистым окружением
pnpm run docker:test:clean

# Только unit-тесты
pnpm run docker:test:unit

# Только e2e-тесты
pnpm run docker:test:e2e
```

## Структура тестов

```
├── test/                        # Корневая директория тестов
│   ├── jest-e2e.json            # Конфигурация Jest для e2e тестов
│   ├── jest-e2e-setup.js        # Настройка для e2e тестов
│   └── app.e2e-spec.ts          # Основные e2e тесты
│
├── src/                         # Исходный код
│   ├── module1/
│   │   ├── module1.service.ts
│   │   ├── module1.controller.ts
│   │   └── module1.service.spec.ts   # Unit-тест для сервиса
│   └── module2/
│       └── ...
├── automation/
│   └── scripts/
│       └── docker-test-runner.sh # Скрипт для запуска тестов в Docker
```

## Unit-тестирование

Unit-тесты фокусируются на проверке изолированной функциональности модулей и сервисов.

### Создание unit-тестов

1. Создайте файл с суффиксом `.spec.ts` рядом с тестируемым модулем
2. Используйте `TestingModule` из `@nestjs/testing` для настройки тестового окружения
3. Используйте мокирование внешних зависимостей

### Пример unit-теста

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Тесты для методов
});
```

## E2E-тестирование

E2E-тесты проверяют работу API и интеграцию компонентов системы.

### Настройка e2e тестов

1. Используйте `jest-e2e.json` для конфигурации
2. Настраивайте увеличенные таймауты для асинхронных операций
3. Создавайте тестовую БД для каждого тестового запуска

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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    
    // Настройка приложения как в main.ts
    await app.init();
    
    // Очистка тестовой БД перед тестами
    await prismaService.cleanDb();
  });

  afterAll(async () => {
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
});
```

## Тестирование в Docker

Для тестирования в Docker используется скрипт `automation/scripts/docker-test-runner.sh`, который:

1. Ожидает доступности базы данных
2. Применяет необходимые миграции
3. Запускает тесты с соответствующими флагами

Этот подход обеспечивает чистое и изолированное окружение для каждого тестового запуска.

### Особенности docker-runner.sh:

- Обработка ошибок и непредвиденных завершений
- Корректное завершение процессов
- Увеличенные таймауты для стабильной работы
- Настройка переменных окружения для тестов

## Лучшие практики

1. **Изоляция тестов** - тесты не должны зависеть друг от друга
2. **Чистое состояние** - начинайте каждый тест с известного состояния
3. **Детерминированность** - тесты должны быть воспроизводимыми
4. **Мокирование внешних сервисов** - не полагайтесь на внешние сервисы
5. **Покрытие кода** - стремитесь к 80%+ покрытию критичной функциональности
6. **Обработка ошибок** - тестируйте не только успешные сценарии
7. **Автоматизация** - интегрируйте тесты в CI/CD