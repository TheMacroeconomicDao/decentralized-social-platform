# Миграции базы данных в GPROD Backend

## Общая информация

Проект использует Prisma ORM для управления схемой базы данных и миграциями. Миграции определены в директории `prisma/migrations/` и применяются автоматически при деплое приложения.

## Структура миграций

```
prisma/
├── schema.prisma         # Схема базы данных
├── seed.ts              # Скрипт для заполнения начальными данными
├── migrations/          # Директория с миграциями
│   ├── migration_lock.toml         # Файл блокировки миграций
│   ├── 20250502025251_init/        # Первая миграция (инициализация)
│   ├── 20250503123000_add_refresh_token/  # Добавление RefreshToken
│   └── 20250503150000_add_roles_column/   # Добавление roles
```

## История миграций

### Миграция 1: init (20250502025251)

Начальная миграция, создающая основные таблицы:

- **User** - таблица пользователей с полями:
  - id, username, email, password, isActive, createdAt, updatedAt
  - Уникальные индексы по username и email

- **Project** - таблица проектов с полями:
  - id, title, description, ownerId, createdAt, updatedAt
  - Внешний ключ на таблицу User (ownerId)

### Миграция 2: add_refresh_token (20250503123000)

Добавление системы refresh токенов:

- **RefreshToken** - новая таблица для хранения токенов обновления:
  - id, token, userId, createdAt, expiresAt
  - Уникальный индекс по token
  - Внешний ключ на User с CASCADE при удалении

- Изменения в существующих таблицах:
  - Изменение поведения внешнего ключа в Project (ON DELETE SET NULL)
  - Поле ownerId в Project становится необязательным

### Миграция 3: add_roles_column (20250503150000)

Добавление ролевой модели:

- Добавление поля roles в таблицу User:
  - Тип данных: массив строк (TEXT[])
  - Значение по умолчанию: [\"user\"]

## Управление миграциями

### Создание новой миграции

```bash
# Локально после изменения schema.prisma
pnpm prisma:migrate:dev

# В Docker
pnpm docker:prisma:migrate:dev
```

### Применение миграций

```bash
# В development окружении
pnpm prisma:migrate:dev

# В staging окружении
pnpm prisma:migrate:stage

# В production окружении
pnpm prisma:migrate:prod
```

### Применение миграций в CI/CD

В GitHub Actions миграции применяются после деплоя контейнеров, но до запуска приложения:

```yaml
- name: Apply migrations
  run: |
    kubectl exec -n develop-gprod deploy/gprod-backend -- \
      npx prisma migrate deploy
```

## Схема базы данных

Схема определена в файле `prisma/schema.prisma` и включает следующие модели:

- **User**: пользователи системы с ролями
- **Project**: проекты, связанные с пользователями (many-to-one)
- **RefreshToken**: токены обновления для пользователей

## Лучшие практики

1. **Всегда создавайте миграции** через Prisma CLI, а не вручную
2. **Тестируйте миграции** в dev-окружении перед применением на stage/prod
3. **Избегайте деструктивных изменений** в production (удаление таблиц/столбцов)
4. **Используйте транзакции** для сложных миграций
5. **Создавайте бэкапы** перед применением миграций в production
