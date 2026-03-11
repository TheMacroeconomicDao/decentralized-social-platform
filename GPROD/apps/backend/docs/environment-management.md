# Управление окружениями в GPROD API

В проекте реализована гибкая система управления окружениями, которая поддерживает три основных контура:
- Development (`dev`) - для локальной разработки
- Staging (`stage`) - для тестирования перед релизом
- Production (`prod`) - для промышленной эксплуатации

## Новый подход: отдельные .env файлы

Каждый контур использует отдельный .env файл:
- `.env.development` - для development окружения
- `.env.staging` - для staging окружения
- `.env.production` - для production окружения

При переключении между контурами выбранный файл копируется в стандартный `.env`, который используется приложением.

### Преимущества отдельных .env файлов

1. **Изоляция конфигураций** - каждый контур имеет свой набор переменных
2. **Безопасность** - меньший риск утечки продакшн-параметров в другие окружения
3. **Прозрачность** - легко увидеть полную конфигурацию для каждого контура
4. **Версионный контроль** - можно хранить шаблоны или некритичные параметры в системе контроля версий
5. **Упрощение CI/CD** - легко интегрировать с системами CI/CD

## Инструменты для управления окружениями

### Скрипты для управления

```bash
# Создание шаблонов .env файлов
pnpm run env:setup

# Переключение окружений (копирует .env.{development|staging|production} в .env)
pnpm run env:dev:new    # Development 
pnpm run env:stage:new  # Staging
pnpm run env:prod:new   # Production

# Запуск контейнеров для выбранного окружения
pnpm run docker:dev     # Запуск dev контейнеров
pnpm run docker:stage   # Запуск stage контейнеров
pnpm run docker:prod    # Запуск production контейнеров
```

### Файловая структура

```
.env.development   # Переменные для development
.env.staging       # Переменные для staging
.env.production    # Переменные для production
.env               # Активный файл (копия из одного из вышеперечисленных)
```

## Работа с базой данных

Для каждого окружения используется своя база данных:
- `gprod_dev` - для development
- `gprod_stage` - для staging 
- `gprod_prod` - для production

### Миграции

```bash
# Миграции для development
pnpm run prisma:migrate:dev

# Миграции для staging
pnpm run prisma:migrate:stage

# Миграции для production
pnpm run prisma:migrate:prod
```

## Docker Compose

Для каждого окружения используется отдельный Docker Compose файл:
- `docker-compose.dev.yml` - для development
- `docker-compose.stage.yml` - для staging
- `docker-compose.prod.yml` - для production

## EnvHelper

В проекте используется утилита `EnvHelper` для работы с переменными окружения. Она автоматически:
- Определяет текущий контур на основе `NODE_ENV`
- Получает значения из файла `.env`
- Предоставляет типизированный доступ к переменным
- Кэширует значения для оптимизации

```typescript
// Примеры использования
const dbUrl = EnvHelper.get('DATABASE_URL', undefined, true); // Строка, обязательная
const port = EnvHelper.int('PORT', 3000); // Число с дефолтным значением
const isDebug = EnvHelper.bool('DEBUG', false); // Булево значение
const origins = EnvHelper.array('CORS_ORIGIN', ['localhost']); // Массив строк
```

## Обратная совместимость

Для обратной совместимости со старым подходом (с префиксами) `EnvHelper` поддерживает:
- Переменные с префиксами `DEV_`, `STAGE_` и `PRODUCTION_`
- Логику fallback между контурами

Однако рекомендуется переходить на новый подход с отдельными .env файлами. 