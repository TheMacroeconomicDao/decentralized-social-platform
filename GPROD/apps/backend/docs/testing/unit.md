# Unit-тестирование в GPROD Backend

## Обзор

Unit-тесты фокусируются на проверке изолированной функциональности отдельных модулей и сервисов. В GPROD Backend они организованы таким образом, чтобы гарантировать корректную работу каждого компонента системы независимо от других.

## Структура unit-тестов

### Расположение тестов

Unit-тесты располагаются рядом с тестируемыми файлами с суффиксом `.spec.ts`:

```
src/
├── module1/
│   ├── module1.service.ts
│   ├── module1.service.spec.ts   # Unit-тест для module1.service.ts
│   ├── module1.controller.ts
│   └── module1.controller.spec.ts # Unit-тест для module1.controller.ts
```

### Структура тестового файла

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    // Настройка тестового модуля
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

  // Тесты для методов
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by id', async () => {
    const userId = '1';
    const mockUser = { id: userId, name: 'Test User' };
    
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
    
    const result = await service.findById(userId);
    
    expect(result).toEqual(mockUser);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId }
    });
  });
});
```

## Запуск unit-тестов

### Локальный запуск

```bash
# Запуск всех unit-тестов
pnpm run test

# Запуск с watch режимом (автоматический перезапуск при изменениях)
pnpm run test:watch

# Запуск тестов с покрытием
pnpm run test:cov
```

### Запуск в Docker

```bash
# Запуск unit-тестов в Docker
pnpm run docker:test:unit

# Запуск с покрытием
pnpm run docker:test:unit:cov
```

## Лучшие практики unit-тестирования

### 1. Изоляция тестов
- Используйте мокирование внешних зависимостей
- Каждый тест должен быть независим от других

```typescript
// Пример мокирования
jest.spyOn(service, 'someMethod').mockImplementation(() => 'mocked result');
```

### 2. Следуйте шаблону AAA (Arrange-Act-Assert)

```typescript
it('should create a new user', async () => {
  // Arrange - подготовка данных
  const userData = { name: 'John', email: 'john@example.com' };
  jest.spyOn(prismaService.user, 'create').mockResolvedValue({ ...userData, id: '1' });
  
  // Act - выполнение тестируемого действия
  const result = await service.create(userData);
  
  // Assert - проверка результата
  expect(result).toHaveProperty('id', '1');
  expect(prismaService.user.create).toHaveBeenCalledWith({ data: userData });
});
```

### 3. Тестирование исключений

```typescript
it('should throw an error if user not found', async () => {
  // Arrange
  jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
  
  // Act & Assert
  await expect(service.findById('nonexistent')).rejects.toThrow('User not found');
});
```

### 4. Группировка тестов по функциональности

```typescript
describe('UsersService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      // ...
    });
    
    it('should throw on duplicate email', async () => {
      // ...
    });
  });
  
  describe('update', () => {
    // Тесты для метода update
  });
});
```

### 5. Тестирование валидации DTO

```typescript
describe('CreateUserDto', () => {
  it('should validate correct data', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John';
    dto.email = 'john@example.com';
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
  
  it('should fail on invalid email', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John';
    dto.email = 'not-an-email';
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

## Подходы к мокированию

### Мокирование сервисов

```typescript
// В тесте контроллера
const mockUsersService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const module: TestingModule = await Test.createTestingModule({
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useValue: mockUsersService,
    },
  ],
}).compile();
```

### Мокирование Prisma

```typescript
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Другие модели...
};
```

### Мокирование HTTP-запросов

```typescript
const mockHttpService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};
```

## Подход к тестированию различных компонентов

### Контроллеры

- Тестируйте валидацию запросов
- Проверяйте HTTP-коды ответов
- Мокируйте сервисы

### Сервисы

- Тестируйте бизнес-логику
- Мокируйте доступ к базе данных
- Проверяйте исключения

### Пайпы, гарды и фильтры

- Тестируйте трансформацию данных
- Проверяйте поведение в граничных случаях
- Мокируйте контекст выполнения
