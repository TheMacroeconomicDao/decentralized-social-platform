# Автоматизация в GPROD

## Содержание

- [Обзор системы автоматизации](#обзор-системы-автоматизации)
- [Структура директории automation](#структура-директории-automation)
- [Центральный скрипт run.sh](#центральный-скрипт-runsh)
- [Интерактивный запуск](interactive-run.md)
- [Скрипты управления окружениями](#скрипты-управления-окружениями)
- [Скрипты управления Docker](#скрипты-управления-docker)
- [Скрипты тестирования](#скрипты-тестирования)
- [Использование через package.json](#использование-через-packagejson)

## Обзор системы автоматизации

Проект GPROD использует комплексную систему автоматизации для управления различными аспектами работы приложения:

- Управление контурами окружения
- Запуск и остановка Docker-контейнеров
- Запуск тестов
- Сбор метрик и логов

Все сценарии автоматизации собраны в директории `automation/` и организованы по категориям для удобства использования.

## Структура директории automation

```
automation/
├─ run.sh                # Основной скрипт для всех автоматизаций
├─ docker/               # Скрипты для работы с Docker
│   └─ docker-manager.sh # Управление Docker-контейнерами
├─ env/                  # Скрипты для работы с окружениями
│   ├─ env-manager.sh    # Управление контурами окружения
│   ├─ env-switch-new.sh # Расширенное управление окружениями
│   └─ setup-env-files.sh # Создание файлов окружения из шаблонов
└─ scripts/              # Скрипты для тестирования и других задач
    ├─ docker-smart-test.sh # Запуск тестов в Docker
    ├─ run-env.sh        # Запуск приложения в разных режимах
    └─ run-tests.sh      # Запуск различных видов тестов
```

## Центральный скрипт run.sh

`automation/run.sh` - это единая точка входа для всех автоматизаций. Он позволяет:

1. Запускать и останавливать контуры
2. Управлять окружениями
3. Запускать тесты
4. Просматривать логи

### Использование run.sh

```bash
# Запуск контуров
./automation/run.sh run dev    # Запуск development контура
./automation/run.sh run stage  # Запуск staging контура
./automation/run.sh run prod   # Запуск production контура

# Запуск с принудительной пересборкой образов
./automation/run.sh run dev --rebuild    # Запуск dev с пересборкой
./automation/run.sh run stage --rebuild  # Запуск stage с пересборкой
./automation/run.sh run prod --rebuild   # Запуск prod с пересборкой

# Остановка контуров
./automation/run.sh stop dev   # Остановка development контура
./automation/run.sh stop stage # Остановка staging контура
./automation/run.sh stop prod  # Остановка production контура

# Просмотр логов
./automation/run.sh logs dev   # Логи development контура
./automation/run.sh logs stage # Логи staging контура
./automation/run.sh logs prod  # Логи production контура

# Тестирование
./automation/run.sh test       # Запуск всех тестов
./automation/run.sh test unit  # Запуск только unit-тестов
./automation/run.sh test e2e   # Запуск только e2e-тестов

# Управление окружениями
./automation/run.sh env dev    # Настройка development окружения
./automation/run.sh env stage  # Настройка staging окружения
./automation/run.sh env prod   # Настройка production окружения

# Интерактивный режим
./automation/run.sh interactive # Запуск в интерактивном режиме с выбором контура и опций
```

## Скрипты управления окружениями

### env-manager.sh

`automation/env/env-manager.sh` - скрипт для настройки контуров окружения:

```bash
# Синтаксис
./automation/env/env-manager.sh <dev|stage|prod> [--silent] [--docker|--local]

# Примеры
./automation/env/env-manager.sh dev           # Настройка development с интерактивным запросом
./automation/env/env-manager.sh stage --silent # Тихая настройка staging
./automation/env/env-manager.sh prod --local   # Настройка production для локального запуска
```

### env-switch-new.sh

`automation/env/env-switch-new.sh` - расширенный скрипт для управления окружениями с дополнительными возможностями:

```bash
# Синтаксис
./automation/env/env-switch-new.sh [dev|stage|prod] [опции]

# Примеры
./automation/env/env-switch-new.sh            # Интерактивный выбор контура
./automation/env/env-switch-new.sh dev --local # Development для локального запуска
./automation/env/env-switch-new.sh stage --docker # Staging для Docker
```

### setup-env-files.sh

`automation/env/setup-env-files.sh` - скрипт для создания файлов окружения из шаблонов:

```bash
# Запуск
./automation/env/setup-env-files.sh

# Создает все файлы окружения из шаблонов в .env-templates/
```

## Скрипты управления Docker

### docker-manager.sh

`docker/docker-manager.sh` - скрипт для управления Docker-контейнерами:

```bash
# Синтаксис
./docker/docker-manager.sh <контур> <команда> [--build]

# Команды
./docker/docker-manager.sh dev up      # Запуск development контура
./docker/docker-manager.sh stage down  # Остановка staging контура
./docker/docker-manager.sh prod restart # Перезапуск production контура
./docker/docker-manager.sh reference logs # Просмотр логов reference контура
```

## Скрипты тестирования

### run-tests.sh

`automation/scripts/run-tests.sh` - скрипт для запуска различных типов тестов:

```bash
# Синтаксис
./automation/scripts/run-tests.sh [unit|e2e]

# Примеры
./automation/scripts/run-tests.sh       # Запуск всех тестов
./automation/scripts/run-tests.sh unit  # Запуск только unit-тестов
./automation/scripts/run-tests.sh e2e   # Запуск только e2e-тестов
```

### docker-smart-test.sh

`automation/scripts/docker-smart-test.sh` - скрипт для запуска тестов в Docker:

```bash
# Синтаксис
./automation/scripts/docker-smart-test.sh [unit|e2e]

# Примеры
./automation/scripts/docker-smart-test.sh       # Запуск всех тестов в Docker
./automation/scripts/docker-smart-test.sh unit  # Запуск только unit-тестов в Docker
./automation/scripts/docker-smart-test.sh e2e   # Запуск только e2e-тестов в Docker
```

## Использование через package.json

Для удобства все скрипты автоматизации доступны через команды в package.json:

```bash
# Основная точка входа
pnpm auto                 # Запуск интерактивного меню

# Управление окружениями
pnpm auto:env:dev         # Настройка development
pnpm auto:env:stage       # Настройка staging
pnpm auto:env:prod        # Настройка production

# Запуск контуров
pnpm auto:run:dev         # Запуск development
pnpm auto:run:stage       # Запуск staging
pnpm auto:run:prod        # Запуск production

# Остановка контуров
pnpm auto:stop:dev        # Остановка development
pnpm auto:stop:stage      # Остановка staging
pnpm auto:stop:prod       # Остановка production

# Просмотр логов
pnpm auto:logs:dev        # Логи development
pnpm auto:logs:stage      # Логи staging
pnpm auto:logs:prod       # Логи production

# Тестирование
pnpm auto:test            # Запуск всех тестов
pnpm test:smart           # Запуск всех тестов (альтернатива)
pnpm test:smart:unit      # Запуск только unit-тестов
pnpm test:smart:e2e       # Запуск только e2e-тестов
```

## Дополнительные документы

- [Детали системы автоматизации](automation-details.md) - подробное описание работы всех скриптов
- [Расширение автоматизации](automation-extension.md) - руководство по добавлению новых сценариев
- [CI/CD интеграция](automation-cicd.md) - использование скриптов в CI/CD пайплайнах 