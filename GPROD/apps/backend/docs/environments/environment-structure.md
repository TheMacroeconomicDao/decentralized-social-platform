# Структура переменных окружения для GPROD API

## Обзор системы окружений

GPROD API поддерживает три контура окружения:
1. **Development** (`.env.development`) - для локальной разработки
2. **Staging** (`.env.staging`) - для тестирования перед релизом
3. **Production** (`.env.production`) - для продакшен-окружения

Переключение между контурами осуществляется через скрипты:
```sh
# Установка шаблонов для всех контуров
pnpm run env:setup

# Переключение на конкретный контур
pnpm run env:dev:new     # активирует development
pnpm run env:stage:new   # активирует staging
pnpm run env:prod:new    # активирует production

# Интерактивное переключение
pnpm run env:switch:new  # выбор через консоль
```

## Новая структура файлов окружения

Каждый контур имеет собственный файл с переменными окружения:

- `.env.development` - для development контура
- `.env.staging` - для staging контура 
- `.env.production` - для production контура

При переключении контура соответствующий файл копируется в `.env`.

EnvHelper автоматически определяет контур на основе `NODE_ENV` и выбирает нужные переменные.

## Структура переменных для DEVELOPMENT

```
# Основные настройки окружения
NODE_ENV=development
PORT=3000

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev

# Авторизация и JWT
JWT_SECRET=dev_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/app.log

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000  # 15 минут в миллисекундах
RATE_LIMIT_MAX=100  # Максимальное количество запросов в окне

# Дополнительные настройки
APP_NAME=GPROD API (Dev)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_dev

# Настройки хеширования паролей (Argon2)
ARGON2_MEMORY_COST=4096      # Использование памяти (в КБ)
ARGON2_TIME_COST=3           # Количество итераций
ARGON2_PARALLELISM=1         # Степень параллелизма
```

## Структура переменных для STAGING

```
# Основные настройки окружения
NODE_ENV=staging
PORT=3003

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_stage

# Авторизация и JWT
JWT_SECRET=stage_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://stage.gprod.com,https://stage-admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000  # 15 минут в миллисекундах
RATE_LIMIT_MAX=100  # Максимальное количество запросов в окне

# Дополнительные настройки
APP_NAME=GPROD API (Staging)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=stage.gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_stage

# Настройки хеширования паролей (Argon2)
ARGON2_MEMORY_COST=4096
ARGON2_TIME_COST=3
ARGON2_PARALLELISM=1

# Prometheus и Grafana
PROMETHEUS_PORT=9090
GRAFANA_PORT=3100
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
```

## Структура переменных для PRODUCTION

```
# Основные настройки окружения
NODE_ENV=production
PORT=3007

# База данных
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/gprod_prod

# Авторизация и JWT
JWT_SECRET=super_secure_jwt_secret_for_production
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=30d

# Логирование
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/gprod/app.log

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://gprod.com,https://admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000  # 15 минут в миллисекундах
RATE_LIMIT_MAX=100  # Максимальное количество запросов в окне

# Дополнительные настройки
APP_NAME=GPROD API
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=super_secure_postgres_password
POSTGRES_DB=gprod_prod

# Настройки хеширования паролей (Argon2) - повышены для production
ARGON2_MEMORY_COST=8192
ARGON2_TIME_COST=4
ARGON2_PARALLELISM=2

# Redis для кэширования
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=super_secure_redis_password

# Nginx
NGINX_PORT=80
NGINX_SSL_PORT=443
SSL_CERTIFICATE_PATH=/etc/ssl/certs/gprod.crt
SSL_KEY_PATH=/etc/ssl/private/gprod.key

# Prometheus и Grafana
GRAFANA_PORT=3500
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=super_secure_grafana_password
```

## Контур для тестирования (E2E-тесты)

```
# Тестовое окружение
NODE_ENV=test
TEST_DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_test

# Тестовые JWT настройки
JWT_SECRET=test_secret_key_for_jwt_e2e_tests
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Хост API для E2E тестов
BASE_URL=http://localhost:3000
```

## Доступ к переменным через EnvHelper

Класс `EnvHelper` в проекте предоставляет удобные типизированные методы для работы с переменными окружения:

```typescript
// Строковые значения (с резервным значением)
const jwtSecret = EnvHelper.get('JWT_SECRET', 'default-secret');

// Числовые значения 
const port = EnvHelper.int('PORT', 3000);

// Логические значения
const isCorsEnabled = EnvHelper.bool('CORS_ENABLED', true);

// Массивы строк (например, для CORS_ORIGIN)
const corsOrigins = EnvHelper.array('CORS_ORIGIN', ['http://localhost:3000']);
```

## Обратная совместимость

EnvHelper также поддерживает обратную совместимость с префиксированными переменными:

1. Сначала проверяет обычную переменную (например, `PORT`)
2. Затем проверяет префиксированную переменную для текущего контура (например, `DEV_PORT` в development)
3. При необходимости ищет в переменных других контуров для fallback

## Рекомендации по безопасности

1. **Никогда не коммитьте** реальные .env файлы в репозиторий
2. Используйте надежные случайные значения для секретов:
   ```bash
   # Генерация надежного JWT_SECRET
   openssl rand -base64 32
   ```
3. В production используйте:
   - Системы управления секретами (HashiCorp Vault, AWS Secrets Manager)
   - Переменные окружения контейнеров вместо .env файлов
   - Разные пароли для разных сервисов
4. Регулярно обновляйте секреты
5. Для JWT_SECRET - минимум 32 случайных символа
6. Используйте разные JWT_SECRET для разных окружений

## Примечания по Docker

При запуске в Docker все переменные должны быть определены в `docker-compose.yml` файле или `.env` файле, который Docker Compose автоматически подхватывает. 

Для передачи переменных в контейнер можно использовать `environment` или `env_file`:

```yaml
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - PORT=3007
    # или
    env_file:
      - .env.production
```

## Модульная архитектура для работы с окружением

### Новая структура файлов

В новой версии приложения работа с переменными окружения реализована через отдельный модуль:

```
src/common/environment/
├── environment.module.ts     # Модуль для внедрения зависимостей
├── environment.service.ts    # Сервис для работы с переменными окружения
└── index.ts                  # Экспорт всех компонентов модуля
```

### EnvironmentService

`EnvironmentService` предоставляет объектно-ориентированный подход к работе с переменными окружения:

```typescript
// Пример получения переменных окружения через EnvironmentService
@Injectable()
export class AppService {
  constructor(private readonly environment: EnvironmentService) {}

  getPort(): number {
    return this.environment.getPort();
  }

  getDatabaseUrl(): string {
    return this.environment.getString('DATABASE_URL');
  }
}
```

### Преимущества новой структуры

1. **Dependency Injection** - EnvironmentService внедряется через конструктор
2. **Тестируемость** - можно легко мокать сервис для тестов
3. **Типизация** - строгая типизация для всех методов
4. **Единая точка доступа** - все переменные получаются из одного сервиса
5. **Автоматическая загрузка** - .env файлы загружаются автоматически при создании сервиса

### Поддерживаемые методы

- `getString(key, defaultValue?)` - получение строкового значения
- `getStringOrThrow(key)` - получение строкового значения с выбросом ошибки, если не найдено
- `getNumber(key, defaultValue?)` - получение числового значения
- `getBoolean(key, defaultValue?)` - получение логического значения
- `getArray(key, defaultValue?)` - получение массива строк
- `getPort()` - получение порта приложения
- `environment` - текущее окружение (`development`, `staging`, `production`, `test`)
- `isDevelopment`, `isStaging`, `isProduction`, `isTest` - проверка текущего окружения
- `isDocker` - проверка, запущено ли приложение в Docker
``` 
</rewritten_file>