# Процесс разработки GPROD Backend

## Начало работы

### Настройка окружения

1. Клонирование репозитория:
```bash
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
cd gprod-backend
```

2. Установка зависимостей:
```bash
pnpm install
```

3. Настройка переменных окружения:
```bash
# Создание шаблонов .env файлов
pnpm run env:setup

# Выбор контура разработки
pnpm run env:switch dev
```

4. Запуск Docker-контейнеров:
```bash
# Интерактивный запуск (рекомендуется)
pnpm run auto:interactive

# Или запуск минимальной конфигурации
pnpm run docker:reference
```

### Структура проекта

```
├── automation/                # Скрипты автоматизации
│   └── scripts/
├── docker/                    # Docker конфигурации
├── docs/                      # Документация
├── prisma/                    # Prisma схемы и миграции
│   ├── migrations/
│   └── schema.prisma          # Основная схема БД
├── src/                       # Исходный код
│   ├── app.module.ts          # Корневой модуль
│   ├── main.ts                # Точка входа
│   ├── common/                # Общие утилиты
│   ├── auth/                  # Модуль аутентификации
│   ├── users/                 # Модуль пользователей
│   ├── projects/              # Модуль проектов
│   └── ... другие модули
├── test/                      # E2E тесты
│   ├── jest-e2e.json
│   └── app.e2e-spec.ts
├── package.json               # Зависимости и скрипты
└── README.md                  # Основная документация
```

## Жизненный цикл разработки

### 1. Создание ветки для задачи

```bash
# Обновление основной ветки
git checkout main
git pull

# Создание новой ветки для задачи
git checkout -b feature/имя-задачи
```

### 2. Разработка функциональности

1. Реализация необходимой функциональности в коде
2. Добавление модульных (unit) тестов для нового кода
3. При необходимости добавление e2e тестов

### 3. Локальное тестирование

```bash
# Запуск unit-тестов
pnpm run test

# Запуск e2e-тестов
pnpm run test:e2e

# Проверка типов TypeScript
pnpm run typecheck

# Проверка линтером
pnpm run lint
```

### 4. Коммит изменений

Проект использует [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(auth): добавлена двухфакторная аутентификация"
```

### 5. Отправка изменений и создание Pull Request

```bash
git push -u origin feature/имя-задачи
```

Затем создайте Pull Request на GitHub с детальным описанием изменений.

### 6. Прохождение CI/CD проверок

После создания PR автоматически запускаются:
- Проверка кода линтером
- Сборка проекта
- Запуск тестов в Docker-окружении

### 7. Код-ревью и утверждение изменений

1. Дождитесь ревью от других разработчиков
2. Внесите необходимые правки по результатам ревью
3. После утверждения изменения будут слиты в основную ветку

## Работа с базой данных

### Создание миграций

При изменении схемы данных (файл `prisma/schema.prisma`):

```bash
# Генерация миграции
pnpm run prisma:migrate:dev

# Применение миграций
pnpm run prisma:migrate:deploy
```

### Обновление Prisma-клиента

```bash
pnpm run prisma:generate
```

### Просмотр данных через Prisma Studio

```bash
pnpm run prisma:studio
```

## Интеграция новых модулей

### 1. Создание структуры модуля

```
src/new-module/
├── dto/                  # Data Transfer Objects
│   ├── create-entity.dto.ts
│   └── update-entity.dto.ts
├── entities/             # Модели сущностей
│   └── entity.entity.ts
├── new-module.module.ts  # Модуль
├── new-module.controller.ts  # Контроллер
├── new-module.service.ts  # Сервис
└── new-module.service.spec.ts  # Тесты
```

### 2. Регистрация модуля в приложении

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { NewModuleModule } from './new-module/new-module.module';

@Module({
  imports: [
    // Другие модули...
    NewModuleModule,
  ],
})
export class AppModule {}
```

### 3. Настройка маршрутов

```typescript
// src/new-module/new-module.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewModuleService } from './new-module.service';
import { CreateEntityDto } from './dto/create-entity.dto';

@Controller('api/v1/entities')
@UseGuards(JwtAuthGuard)
export class NewModuleController {
  constructor(private readonly newModuleService: NewModuleService) {}

  @Post()
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.newModuleService.create(createEntityDto);
  }

  @Get()
  findAll() {
    return this.newModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newModuleService.findOne(id);
  }
}
```

## Развертывание

### Сборка для production

```bash
pnpm run build
```

### Запуск в production режиме

```bash
# С использованием Docker
pnpm run docker:prod

# Запуск собранного приложения
pnpm run start:prod
```

## Решение проблем

### Проблемы с миграциями

```bash
# Сброс миграций (в режиме разработки)
pnpm run prisma:migrate:reset

# Проверка статуса миграций
pnpm run prisma:migrate:status
```

### Проблемы с Docker

```bash
# Проверка логов
docker-compose logs

# Перезапуск контейнеров
pnpm run docker:restart
```

### Проблемы с тестами

```bash
# Запуск с подробным выводом
pnpm run test -- --verbose

# Запуск конкретного файла тестов
pnpm run test -- src/auth/auth.service.spec.ts
```

## Контакты и поддержка

При возникновении вопросов обращайтесь:
- К техническому лиду проекта
- Создайте issue в GitHub-репозитории
- Обсудите в канале проекта в мессенджере
