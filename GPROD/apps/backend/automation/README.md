# Автоматизация GPROD

В этой директории содержатся все инструменты автоматизации для разработки, тестирования и деплоя проекта GPROD.

## Структура директорий

```
automation/
├── ci/                         # Скрипты для непрерывной интеграции
├── docker/                     # Файлы Docker и docker-compose
│   ├── docker-compose.dev.yml     # Конфигурация для development
│   ├── docker-compose.stage.yml   # Конфигурация для staging
│   ├── docker-compose.prod.yml    # Конфигурация для production 
│   ├── docker-compose.reference.yml # Минимальная конфигурация
│   └── docker-manager.sh          # Скрипт для управления Docker
├── env/                        # Работа с переменными окружения
│   └── env-manager.sh            # Скрипт для настройки окружений
├── scripts/                    # Различные скрипты для тестирования и деплоя
└── run.sh                      # Главный скрипт для запуска автоматизации
```

## Контуры окружения

Проект поддерживает три контура окружений:

1. **dev (development)** - для локальной разработки
   - Порт API: 3000
   - Порт БД: 5432
   - Adminer: порт 8080
   - Автоматическое создание миграций

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

## Использование автоматизации

### Через npm/pnpm скрипты

```bash
# Запуск автоматизации с указанием команды и контура
pnpm auto [команда] [контур]

# Настройка окружения
pnpm auto:env:dev      # Настройка development окружения
pnpm auto:env:stage    # Настройка staging окружения
pnpm auto:env:prod     # Настройка production окружения

# Запуск окружения (настройка + запуск Docker)
pnpm auto:run:dev      # Запуск development контура
pnpm auto:run:stage    # Запуск staging контура
pnpm auto:run:prod     # Запуск production контура

# Остановка окружения
pnpm auto:stop:dev     # Остановка development контура
pnpm auto:stop:stage   # Остановка staging контура
pnpm auto:stop:prod    # Остановка production контура

# Просмотр логов
pnpm auto:logs:dev     # Просмотр логов development контура
pnpm auto:logs:stage   # Просмотр логов staging контура
pnpm auto:logs:prod    # Просмотр логов production контура

# Прямой доступ к Docker
pnpm auto:docker:dev          # Запуск Docker для development
pnpm auto:docker:stage        # Запуск Docker для staging
pnpm auto:docker:prod         # Запуск Docker для production
pnpm auto:docker:reference    # Запуск минимальной Docker конфигурации

# Запуск тестов
pnpm auto:test         # Запуск всех тестов
```

### Напрямую через скрипты

```bash
# Главный скрипт автоматизации
./automation/run.sh [команда] [контур]

# Скрипт управления окружением
./automation/env/env-manager.sh [контур] [--silent] [--docker|--local]

# Скрипт управления Docker
./automation/docker/docker-manager.sh [контур] [команда] [--build]
```

## Примеры использования

### Запуск полного цикла разработки на development контуре

```bash
# Настройка окружения и запуск
pnpm auto:run:dev

# Просмотр логов
pnpm auto:logs:dev

# Остановка контейнеров
pnpm auto:stop:dev
```

### Настройка окружения без запуска Docker

```bash
# Настройка окружения (с интерактивным запросом)
pnpm auto:env:dev

# Или через скрипт с флагом --local
./automation/env/env-manager.sh dev --local
```

### Запуск минимальной конфигурации для быстрой разработки

```bash
pnpm auto:docker:reference
```

## Управление тестированием

```bash
# Запуск всех тестов
pnpm auto:test

# Запуск unit тестов
pnpm test:smart:unit

# Запуск e2e тестов
pnpm test:smart:e2e

# Запуск тестов в Docker
pnpm docker:test:smart
```

## Техническое обслуживание

Для поддержки автоматизации в актуальном состоянии:

1. **Добавление нового контура**: создайте файл `docker-compose.{контур}.yml` в директории `automation/docker/` и добавьте соответствующие скрипты в `package.json`

2. **Изменение портов или сервисов**: отредактируйте соответствующий файл `docker-compose.*.yml` и обновите переменные в `env-manager.sh` и `docker-manager.sh`

3. **Добавление новой команды**: обновите файл `run.sh` и добавьте новые функции или case-блоки

## Решение проблем

- **Ошибка "port is already in use"**: измените порт в соответствующем файле docker-compose.yml или остановите конфликтующие сервисы
- **Проблемы с .env файлами**: проверьте, что файлы окружения созданы и содержат корректные значения
- **Ошибки Docker**: убедитесь, что Docker запущен и имеет достаточно ресурсов 