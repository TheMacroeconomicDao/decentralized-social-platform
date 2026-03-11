# Docker-конфигурация GPROD

## Содержание

- [Структура Docker файлов](#структура-docker-файлов)
- [Использование Docker](#использование-docker)
- [Контуры окружения](#контуры-окружения)
- [Расширенное использование](#расширенное-использование)
- [Рекомендации](#рекомендации)

## Структура Docker файлов

Проект использует следующую организацию Docker-файлов:

### Базовые файлы в корне проекта

- `Dockerfile` - основной Dockerfile для разработки
- `Dockerfile.prod` - Dockerfile для продакшена
- `docker-compose.yml` - основной файл docker-compose для разработки
- `.dockerignore` - список файлов, исключаемых из Docker-образа

### Специфичные файлы в директории `docker/`

- `docker/docker-compose.dev.yml` - конфигурация для development
- `docker/docker-compose.stage.yml` - конфигурация для staging
- `docker/docker-compose.prod.yml` - конфигурация для production
- `docker/docker-compose.reference.yml` - минимальная референсная конфигурация
- `docker/docker-manager.sh` - скрипт для управления Docker-контейнерами

## Использование Docker

### Базовые команды для разработки

```bash
# Запустить development контур
pnpm docker:dev

# Запустить с пересборкой
pnpm docker:dev:build

# Остановить контейнеры
pnpm docker:dev:stop
```

### Команды для других контуров окружения

```bash
# Staging
pnpm docker:stage         # Запустить
pnpm docker:stage:build   # Запустить с пересборкой
pnpm docker:stage:stop    # Остановить

# Production
pnpm docker:prod          # Запустить
pnpm docker:prod:build    # Запустить с пересборкой
pnpm docker:prod:stop     # Остановить

# Reference (минимальная конфигурация)
pnpm docker:reference     # Запустить
pnpm docker:reference:build # Запустить с пересборкой
pnpm docker:reference:down  # Остановить
pnpm docker:reference:logs  # Показать логи
```

### Запуск с помощью автоматизации

Для более гибкого управления можно использовать систему автоматизации:

```bash
# Запуск через run.sh
pnpm auto:run:dev         # Запустить development
pnpm auto:run:stage       # Запустить staging
pnpm auto:run:prod        # Запустить production

# Остановка
pnpm auto:stop:dev        # Остановить development
pnpm auto:stop:stage      # Остановить staging
pnpm auto:stop:prod       # Остановить production

# Логи
pnpm auto:logs:dev        # Показать логи development
pnpm auto:logs:stage      # Показать логи staging
pnpm auto:logs:prod       # Показать логи production
```

## Контуры окружения

1. **dev (development)** - для локальной разработки
   - Порт API: 3008
   - Порт БД: 5432

2. **stage (staging)** - для тестирования перед релизом
   - Порт API: 3003
   - Порт БД: 5433
   - Prometheus: порт 9090
   - Grafana: порт 3100

3. **prod (production)** - для продакшн-окружения
   - Порт API: 3007
   - Порт БД: 5434
   - Nginx с SSL
   - Grafana: порт 3500

4. **reference** - минимальная конфигурация для быстрой разработки
   - Порт API: 3000
   - Порт БД: 5432

## Расширенное использование

### Управление с помощью docker-manager.sh

```bash
# Синтаксис
./docker/docker-manager.sh <контур> <команда> [--build]

# Примеры
./docker/docker-manager.sh dev up          # Запустить development
./docker/docker-manager.sh stage down      # Остановить staging
./docker/docker-manager.sh prod restart    # Перезапустить production
./docker/docker-manager.sh reference logs  # Показать логи reference
```

### Работа с базами данных

```bash
# Миграции Prisma в Docker
pnpm docker:prisma:migrate:dev    # Миграция для development
pnpm docker:prisma:migrate:stage  # Миграция для staging
pnpm docker:prisma:migrate:prod   # Миграция для production

# Prisma Studio
pnpm docker:prisma:studio:dev     # Запуск Prisma Studio для dev
```

## Рекомендации

1. **Для локальной разработки**:
   - Используйте минимальную конфигурацию `docker:reference`
   - Или полную dev-конфигурацию `docker:dev` при необходимости

2. **Для тестирования**:
   - Используйте конфигурацию `docker:stage` с мониторингом

3. **Для продакшена**:
   - Используйте конфигурацию `docker:prod` с Nginx и SSL

## Дополнительные документы

- [Docker Compose конфигурации](docker-compose-configs.md) - подробное описание всех docker-compose файлов
- [Dockerfile описание](dockerfile-details.md) - детали Dockerfile конфигураций
- [Docker в CI/CD](docker-cicd.md) - использование Docker в процессах CI/CD 