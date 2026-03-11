# Настройка окружения разработки GPROD Backend

## Требования

Для разработки GPROD Backend необходимы следующие инструменты:

- **Node.js** - версия 18.x или выше
- **pnpm** - версия 8.x или выше
- **Docker** и **Docker Compose** - последние стабильные версии
- **Git** - последняя стабильная версия

## Пошаговая настройка

### 1. Клонирование репозитория

```bash
# Клонирование основного репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
cd gprod-backend
```

### 2. Установка зависимостей

```bash
# Установка pnpm (если не установлен)
npm install -g pnpm

# Установка зависимостей проекта
pnpm install
```

### 3. Настройка переменных окружения

```bash
# Создание шаблонов .env файлов
pnpm run env:setup

# Выбор контура разработки (интерактивно)
pnpm run env:switch:new

# Или напрямую выбор dev-контура
pnpm run env:dev:new
```

После выполнения этих команд будет создан файл `.env` в корне проекта с настройками для разработки.

### 4. Настройка Docker

```bash
# Запуск интерактивного помощника
pnpm run auto:interactive
```

При запуске выберите опцию "4a" для запуска минимальной конфигурации (reference).

Или запустите напрямую:

```bash
# Запуск минимальной конфигурации
pnpm run docker:reference
```

### 5. Применение миграций

```bash
# Применение миграций к базе данных
pnpm run prisma:migrate:dev
```

### 6. Запуск приложения

```bash
# Запуск в режиме разработки
pnpm run start:dev
```

После успешного запуска API будет доступно по адресу: http://localhost:3000/api/v1

## Проверка работоспособности

### Проверка API

Откройте в браузере http://localhost:3000/api/v1/health для проверки статуса приложения.

### Проверка документации API

Swagger-документация доступна по адресу: http://localhost:3000/api/v1/docs

### Проверка базы данных

Для просмотра и управления базой данных можно использовать Prisma Studio:

```bash
pnpm run prisma:studio
```

Prisma Studio будет доступна по адресу: http://localhost:5555

## Настройка для опытных разработчиков

### Запуск с полной инфраструктурой

Для разработки с полной инфраструктурой (включая мониторинг):

```bash
# 1. Клонировать инфраструктурный репозиторий
git clone https://github.com/TheMacroeconomicDao/gybernaty-infra.git
cd gybernaty-infra

# 2. Настройка переменных окружения
cp .env.example .env
# Отредактировать .env при необходимости

# 3. Запуск среды разработки
docker-compose -f docker/docker-compose.yml -f docker/dev/docker-compose.dev.yml up -d
```

### Локальная разработка без Docker

Для разработки без Docker необходимо:

1. Установить и настроить PostgreSQL локально
2. Обновить `.env` файл, указав правильный DATABASE_URL
3. Запустить приложение: `pnpm run start:dev`

## Настройка редактора

### Visual Studio Code

Рекомендуемые расширения:
- ESLint
- Prettier
- TypeScript Hero
- NestJS Snippets
- Prisma

Настройки для VS Code (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Решение проблем при настройке

### Проблемы с доступом к базе данных

**Симптом**: Ошибка подключения к PostgreSQL.

**Решение**:
1. Проверьте, запущен ли контейнер PostgreSQL: `docker ps`
2. Проверьте переменную DATABASE_URL в `.env` файле
3. Для проверки соединения: `pnpm run prisma:validate`

### Ошибки миграции

**Симптом**: Ошибки при запуске миграций.

**Решение**:
1. Сбросьте базу данных: `pnpm run prisma:migrate:reset`
2. Повторите миграцию: `pnpm run prisma:migrate:dev`

### Проблемы с Docker

**Симптом**: Контейнеры не запускаются или завершаются с ошибкой.

**Решение**:
1. Проверьте логи: `docker-compose logs`
2. Остановите все контейнеры: `docker-compose down`
3. Удалите volume: `docker volume prune`
4. Запустите заново: `pnpm run docker:reference:build`

## Дополнительная настройка

### Настройка Git Hooks

Для автоматической проверки кода при коммите:

```bash
# Установка husky
pnpm run prepare

# Теперь при каждом коммите будет запускаться lint-staged
# и при каждом push будут запускаться тесты
```

### Генерация новых компонентов

Для быстрого создания новых модулей:

```bash
# Создание нового модуля
pnpm run nest g module my-module

# Создание контроллера
pnpm run nest g controller my-module

# Создание сервиса
pnpm run nest g service my-module
```
