# Разделенная инфраструктура GPROD

## Концепция разделенной инфраструктуры

Начиная с версии 2.0, проект GPROD использует разделенную архитектуру с двумя основными репозиториями:

- **[gprod-backend](https://github.com/TheMacroeconomicDao/gprod-backend)** - код приложения, API, бизнес-логика
- **[gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra)** - инфраструктурные конфигурации

### Преимущества разделения

- ✅ **Чистота кодовой базы** - код приложения не смешивается с инфраструктурным кодом
- ✅ **Независимое развитие** - инфраструктура может развиваться отдельно от приложения
- ✅ **Соответствие принципам DevOps** - разделение ответственности
- ✅ **Экспертиза команд** - разные команды могут работать над кодом и инфраструктурой

## Способы запуска

### 1. Минимальный запуск для разработки

```bash
# Клонирование основного репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
cd gprod-backend

# Установка зависимостей и настройка окружения
pnpm install
pnpm run env:setup
pnpm run env:switch dev

# Запуск минимальной конфигурации (только DB + API)
pnpm run docker:reference
```

Эта конфигурация запускает:
- PostgreSQL на порту 5432
- Backend API на порту 3000

### 2. Полный запуск с инфраструктурой

```bash
# 1. Клонируем оба репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
git clone https://github.com/TheMacroeconomicDao/gybernaty-infra.git

# 2. Настраиваем основной проект
cd gprod-backend
pnpm install
pnpm run env:setup
pnpm run env:switch dev  # или stage/prod

# 3. Настраиваем инфраструктуру
cd ../gybernaty-infra
cp .env.example .env
# Отредактируйте .env при необходимости

# 4. Запускаем нужный контур
# Для разработки:
docker-compose -f docker/docker-compose.yml -f docker/dev/docker-compose.dev.yml up -d

# ИЛИ для staging:
# docker-compose -f docker/docker-compose.yml -f docker/stage/docker-compose.stage.yml up -d

# ИЛИ для production:
# docker-compose -f docker/docker-compose.yml -f docker/prod/docker-compose.prod.yml up -d
```

### 3. Гибридный подход (выборочная инфраструктура)

```bash
# 1. Настройте базовый Backend
cd gprod-backend
docker-compose -f docker-compose.reference.yml up -d

# 2. Запустите нужные компоненты из инфраструктурного репозитория
cd ../gybernaty-infra

# Например, только мониторинг
docker-compose -f docker/monitoring.yml up -d

# Или только Nginx
docker-compose -f docker/nginx.yml up -d
```

## Интерактивный запуск

Для удобства разработчиков предусмотрен интерактивный запуск:

```bash
# В репозитории gprod-backend
pnpm run auto:interactive
```

Скрипт предложит выбрать:
- Контур окружения (dev, stage, prod, reference)
- Режим запуска (обычный или с пересборкой образов)

## Синхронизация переменных окружения

При работе с разделенной инфраструктурой важно синхронизировать переменные окружения между репозиториями:

- `gprod-backend/.env` - конфигурация для API и Backend
- `gybernaty-infra/.env` - конфигурация для инфраструктуры

### Критические переменные для синхронизации

| Переменная | Описание | Где используется |
|------------|----------|-----------------|
| `POSTGRES_PASSWORD` | Пароль БД | В обоих репозиториях |
| `JWT_SECRET` | Секретный ключ JWT | В основном репозитории |
| `PORT` | Порт API | В обоих репозиториях |

## Поиск неисправностей

### Проблемы с доступом к базе данных

Если API контейнер не может подключиться к базе данных:

1. Проверьте, что `DATABASE_URL` в `.env` правильно указывает на хост БД
2. При использовании полной инфраструктуры, имя сервиса БД должно быть `db`
3. При использовании минимального запуска, также `db`

### Проблемы с сетью Docker

Если контейнеры не видят друг друга:

```bash
# Проверить созданные Docker сети
docker network ls

# Проверить, к каким сетям подключен контейнер
docker inspect -f '{{range $key, $value := .NetworkSettings.Networks}}{{$key}} {{end}}' [ID_КОНТЕЙНЕРА]
```

### Проблемы с переменными окружения

Для проверки переменных внутри контейнера:

```bash
docker exec -it [ID_КОНТЕЙНЕРА] env
```

## Рекомендации по использованию

1. ✅ **Для разработки** - используйте минимальный запуск (`docker:reference`)
2. ✅ **Для тестирования перед релизом** - используйте полную инфраструктуру stage
3. ✅ **Для продакшена** - используйте полную конфигурацию prod
4. ✅ **Для непрерывной интеграции** - настройте CI с использованием Docker Compose
