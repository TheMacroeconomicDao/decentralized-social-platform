# GPROD Backend (Gybernaty Community)

**Production-ready бэкенд на NestJS + Prisma + PostgreSQL + pnpm + Docker**

---

## 🚀 Quick Start / Быстрый старт

- **Клонировать и запустить:**
  ```bash
  git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
  cd gprod-backend
  pnpm install
  pnpm run env:setup
  pnpm run env:switch dev
  pnpm docker:reference
  # или интерактивно: pnpm run auto:interactive
  ```
- **Swagger:** [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs) (reference/dev)
- **Документация:** [docs/README.md](docs/README.md)
- **Частые команды:** [см. ниже](#основные-команды)
- **Быстрый билд и запуск:**
  ```bash
  pnpm run build:docker:dev
  ```
  (пересобирает проект и сразу запускает его в Docker)

---

## 🛠️ Статус проекта

![Версия](https://img.shields.io/badge/версия-1.0.0-blue)
![Статус](https://img.shields.io/badge/статус-активная_разработка-green)
![Тесты](https://img.shields.io/badge/тесты-проходят-success)

| Компонент | Статус | Прогресс |
|-----------|--------|----------|
| API v1 | ✅ Релиз | 100% |
| Аутентификация | ✅ Релиз | 100% |
| Авторизация | ✅ Релиз | 100% |
| Управление пользователями | ✅ Релиз | 100% |
| Управление проектами | ✅ Релиз | 100% |
| API v2 | ⏳ В разработке | 40% |
| Расширенная безопасность | 📅 Запланировано | 0% |

---

## 🔥 Основные фичи

- ✅ **Три контура окружения** - dev, stage, prod
- ✅ **Ролевой доступ** - RBAC с детальными правами
- ✅ **JWT-аутентификация** - безопасная и масштабируемая
- ✅ **Автоматические миграции** - управление схемой БД
- ✅ **Документация API** - Swagger для всех эндпоинтов
- ✅ **Мониторинг** - Grafana + Prometheus

---

## 🌐 Swagger и эндпоинты

- **Swagger (API docs):**
  - reference/dev: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)
  - dev: [http://localhost:3008/api/v1/docs](http://localhost:3008/api/v1/docs)
  - stage: [http://localhost:3003/api/v1/docs](http://localhost:3003/api/v1/docs)
  - prod: [http://localhost:3007/api/v1/docs](http://localhost:3007/api/v1/docs)
- **API root:** `/api/v1`

---

## 🏗️ Инфраструктура

- **[gprod-backend](https://github.com/TheMacroeconomicDao/gprod-backend)** — код приложения, API, бизнес-логика
- **[gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra)** — инфраструктурные конфиги (k8s, мониторинг, ingress, etc)

---

## ⚡️ Основные команды

### Запуск приложения
```bash
# Интерактивный запуск
pnpm run auto:interactive

# Быстрый запуск reference/dev
pnpm docker:reference

# Полноценная разработка
pnpm docker:dev

# Продакшн
pnpm docker:prod
```

### Тестирование
```bash
# Все тесты в Docker
pnpm run docker:test:all

# Чистое окружение
pnpm run docker:test:clean
```

### Миграции Prisma
```bash
pnpm docker:prisma:migrate:dev
pnpm docker:prisma:migrate:stage
pnpm docker:prisma:migrate:prod
```

### Быстрый билд и запуск в Docker
```bash
pnpm run build:docker:dev
```
- Пересобирает проект и сразу запускает его в Docker (development compose)

---

## 📦 Документация

- [docs/README.md](docs/README.md) — корневая документация
- [🗺️ Дорожная карта](docs/ROADMAP.md)
- [📈 Статус](docs/STATUS.md)
- [📝 История изменений](docs/CHANGELOG.md)
- [🏛️ Архитектура](docs/architecture/README.md)
- [🧩 Модули](docs/architecture/modules.md)
- [📋 Разработка](docs/development/README.md)
- [🧪 Тестирование](docs/testing/README.md)
- [🐳 Docker](docs/docker/README.md)

---

## 🧰 Технологический стек

- **NestJS** — модульный бэкенд-фреймворк с DI-контейнером
- **TypeScript** — строгая типизация
- **Prisma ORM** — типобезопасный ORM с миграциями
- **PostgreSQL** — надёжная СУБД
- **Docker & docker-compose** — контейнеризация
- **Swagger** — автоматическая документация API
- **JWT** — безопасная аутентификация
- **Winston** — структурированное логирование
- **Jest** — тестирование
- **Prometheus & Grafana** — мониторинг

---

## 🏭 CI/CD

- **CI:** GitHub Actions, пайплайн в `.github/workflows/`
- **Docker:** все окружения запускаются через docker-compose, поддержка миграций и healthcheck
- **CD:** Автоматический деплой через k8s manifests (см. [gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra))
- **Тесты:** Запуск через Docker, поддержка e2e/unit

---

## ⚡️ Управление переменными окружения (env)

- Нет фиксированного .env — всегда генерируется или переключается через скрипты в `automation/env/`.
- Основные скрипты: `env-manager.sh`, `env-switch-new.sh`, `setup-env-files.sh`.
- Симлинк `.env` всегда указывает на актуальный .env.<env>.
- Для CI/CD, Docker, локальной разработки — всегда используйте скрипты из `automation/env/`.
- Если .env не найден — создайте через:
  ```sh
  ./automation/env/env-manager.sh dev
  # или интерактивно
  ./automation/env/env-switch-new.sh
  ```
- Для тестов и разработки всегда запускай:
  ```sh
  ./automation/env/env-manager.sh dev --docker
  ```

---

## ❓ FAQ / Траблшутинг

**Q: Контейнер не стартует, порт занят?**
- Проверь, не запущен ли другой сервис на этом порту (`lsof -i :3000`)
- Останови все контейнеры: `docker ps -aq | xargs docker stop`

**Q: Нет .env?**
- Запусти `pnpm run env:setup` и `pnpm run env:switch dev`

**Q: Не работает Prisma миграция?**
- Проверь переменные окружения для БД
- Запусти миграцию вручную: `pnpm docker:prisma:migrate:dev`

**Q: Как посмотреть логи?**
- `pnpm docker:reference:logs` или `./docker/docker-manager.sh dev logs`

**Q: Как подключиться к БД?**
- В docker-compose указан порт, например, 5432 для reference/dev
- Можно подключиться через DBeaver, TablePlus и т.д.

---

## 🧑‍💻 Contributing & Support

- Pull requests welcome!
- Вопросы — через issues или Telegram: @gyberdev
- Для новых контрибьюторов: см. [docs/development/README.md](docs/development/README.md)

---

## Лицензия

AGPL-3.0

## Важно для разработки (ESM + TypeScript)

- **Все локальные импорты должны быть с явным расширением `.js`!**
  - Пример: `import { Foo } from './foo.js'`
  - Без расширения (`import { Foo } from './foo'`) — не будет работать в Node.js ESM, получите `ERR_MODULE_NOT_FOUND`.
- Это касается всех файлов в `src/`, включая тесты, DTO, guards, сервисы и т.д.
- Импорты npm-пакетов (`import ... from 'express'`) не требуют расширения.
- Если используешь автогенерацию/рефакторинг — всегда проверяй, чтобы не возвращались старые импорты без расширения.
- Подробнее: [Node.js ESM docs](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions)

**TL;DR:**  
> Локальный импорт = всегда с `.js` на конце!