# Модульная архитектура GPROD

## Общая структура

Проект реорганизован для достижения лучшей модульности, тестируемости и масштабируемости. Ключевой принцип - разделение ответственности и инкапсуляция логики в отдельные модули.

```
src/
├── app.module.ts               # Корневой модуль приложения
├── main.ts                     # Точка входа (bootstrap)
├── modules/                    # Бизнес-модули
│   ├── auth/                   # Аутентификация и авторизация
│   ├── users/                  # Управление пользователями
│   ├── projects/               # Управление проектами
│   └── health/                 # Проверка здоровья системы
└── common/                     # Общие модули и компоненты
    ├── database/               # Модуль работы с базой данных
    ├── environment/            # Модуль для переменных окружения
    ├── security/               # Модуль безопасности
    ├── upload/                 # Модуль для работы с файлами
    ├── config/                 # Конфигурация приложения
    ├── logger/                 # Настройка логирования
    ├── middleware/             # HTTP middleware
    ├── filters/                # Обработчики ошибок
    ├── decorators/             # Кастомные декораторы
    ├── dto/                    # Общие DTO
    └── helpers/                # Вспомогательные функции
```

## Основные инфраструктурные модули

### Environment Module

Модуль для работы с переменными окружения. Обеспечивает типизированный доступ к конфигурации через Dependency Injection.

```typescript
// Пример использования
@Injectable()
export class AppService {
  constructor(private readonly environment: EnvironmentService) {}

  getServerInfo() {
    return {
      port: this.environment.getPort(),
      environment: this.environment.environment,
      isDocker: this.environment.isDocker
    };
  }
}
```

### Database Module

Модуль для работы с базой данных через Prisma Client. Обеспечивает подключение к базе, отключение и проверку здоровья.

```typescript
// Пример использования
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

### Security Module

Модуль для централизованной работы с безопасностью. Включает Guards, JWT, хеширование паролей.

```typescript
// Пример использования
@Injectable()
export class AuthService {
  constructor(private readonly security: SecurityService) {}

  async login(user: User) {
    const payload = { sub: user.id, username: user.email, roles: user.roles };
    return {
      accessToken: this.security.generateToken(payload)
    };
  }
}
```

### Upload Module

Модуль для работы с загрузкой и управлением файлами.

```typescript
// Пример использования
@Injectable()
export class FilesService {
  constructor(private readonly uploadService: UploadService) {}

  async saveAvatar(userId: string, file: Buffer) {
    const filename = `avatar-${userId}.jpg`;
    return this.uploadService.saveFile(file, filename, 'avatars');
  }
}
```

## Принципы работы с модулями

1. **Единая точка входа** - каждый модуль имеет index.ts, который экспортирует все необходимые компоненты
2. **Dependency Injection** - зависимости внедряются через конструкторы
3. **Глобальная регистрация** - инфраструктурные модули помечены декоратором `@Global()`
4. **Тестируемость** - архитектура оптимизирована для удобного тестирования
5. **Инкапсуляция** - внутренние детали реализации скрыты за публичными интерфейсами

## Бизнес-модули

Бизнес-модули сосредоточены на конкретной функциональности и используют общую инфраструктуру. Типичная структура модуля:

```
modules/feature/
├── feature.module.ts        # Определение модуля
├── feature.controller.ts    # Обработка HTTP запросов
├── feature.service.ts       # Бизнес-логика
├── feature.types.ts         # Типы и интерфейсы
├── dto/                     # Data Transfer Objects
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
└── entities/                # Сущности
    └── feature.entity.ts
```

## Расширение архитектуры

Для добавления новой функциональности рекомендуется:

1. Для инфраструктурных компонентов - создавать новые модули в директории `common/`
2. Для бизнес-функциональности - создавать новые модули в директории `modules/`
3. Следовать принципам существующей архитектуры, включая Dependency Injection и Single Responsibility 