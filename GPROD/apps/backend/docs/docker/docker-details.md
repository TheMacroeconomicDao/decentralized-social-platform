# Docker-конфигурация GPROD

## Структура файлов Docker

Проект использует следующую организацию Docker-файлов:

- **Базовые файлы в корне проекта**:
  - `Dockerfile` - основной Dockerfile для разработки
  - `Dockerfile.prod` - Dockerfile для продакшена
  - `docker-compose.yml` - основной файл docker-compose для разработки (ссылается на docker-compose.reference.yml)
  - `.dockerignore` - список файлов, исключаемых из Docker-образа

- **Специфичные файлы в директории `docker/`**:
  - `docker/docker-compose.dev.yml` - конфигурация для development
  - `docker/docker-compose.stage.yml` - конфигурация для staging
  - `docker/docker-compose.prod.yml` - конфигурация для production
  - `docker/docker-compose.reference.yml` - минимальная референсная конфигурация
  - `docker/docker-manager.sh` - скрипт для управления Docker-контейнерами

## Использование

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

### Запуск с помощью docker-manager.sh

Для более гибкого управления контурами можно использовать скрипт `docker/docker-manager.sh`:

```bash
# Синтаксис
./docker/docker-manager.sh <контур> <команда> [--build]

# Примеры
./docker/docker-manager.sh dev up          # Запустить development
./docker/docker-manager.sh stage down      # Остановить staging
./docker/docker-manager.sh prod restart    # Перезапустить production
./docker/docker-manager.sh reference logs  # Показать логи reference
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