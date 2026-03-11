# Руководство по запуску проекта в разделенной инфраструктуре

Начиная с версии 2.0, инфраструктурные конфигурации Gybernaty (Docker, Nginx, мониторинг) были вынесены в отдельный репозиторий [gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra) для лучшего разделения ответственности и соблюдения принципов DevOps.

## Структура репозиториев

- **gprod-new-backend** - основной код приложения, бизнес-логика, API и тесты
- **gybernaty-infra** - инфраструктурный код и конфигурации для развертывания

## Способы запуска

Есть три основных сценария запуска приложения:

### 1. Минимальный запуск для разработки (только Backend)

Для локальной разработки без сложной инфраструктуры можно использовать минимальную конфигурацию из основного репозитория:

```bash
# Клонирование основного репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
cd gprod-backend

# Установка зависимостей и настройка окружения
pnpm install
pnpm run env:setup
pnpm run env:switch dev

# Запуск минимальной конфигурации (только DB + API)
docker-compose -f docker-compose.reference.yml up -d
```

Эта конфигурация запускает:
- Базу данных PostgreSQL
- Backend API на NestJS

### 2. Полный запуск с полной инфраструктурой (рекомендуется для тестирования)

Для полноценного запуска со всей инфраструктурой:

```bash
# 1. Клонируем оба репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
git clone https://github.com/TheMacroeconomicDao/gybernaty-infra.git

# 2. Настраиваем основной проект
cd gprod-backend
pnpm install
pnpm run env:setup
pnpm run env:switch dev  # или stage/prod в зависимости от контура

# 3. Переходим в репозиторий инфраструктуры
cd ../gybernaty-infra

# 4. Копируем файл переменных окружения и настраиваем его
cp .env.example .env
# Отредактируйте .env при необходимости

# 5. Запускаем нужный контур
# Для разработки:
docker-compose -f docker/docker-compose.yml -f docker/dev/docker-compose.dev.yml up -d

# ИЛИ для staging:
# docker-compose -f docker/docker-compose.yml -f docker/stage/docker-compose.stage.yml up -d

# ИЛИ для production:
# docker-compose -f docker/docker-compose.yml -f docker/prod/docker-compose.prod.yml up -d
```

### 3. Гибридный подход (Backend + выборочная инфраструктура)

Если вам нужны определенные части инфраструктуры (например, только мониторинг):

```bash
# 1. Настройте базовый Backend как в варианте 1
cd gprod-backend
docker-compose -f docker-compose.reference.yml up -d

# 2. Запустите нужные компоненты из инфраструктурного репозитория
cd ../gybernaty-infra

# Например, только мониторинг
docker-compose -f docker/monitoring.yml up -d

# Или только Nginx
docker-compose -f docker/nginx.yml up -d
```

## Переменные окружения

При работе с разделенной инфраструктурой важно синхронизировать переменные окружения между репозиториями:

- `gprod-backend/.env` - конфигурация для API и Backend
- `gybernaty-infra/.env` - конфигурация для инфраструктуры

Обязательные переменные для синхронизации:
- `POSTGRES_PASSWORD` - пароль для базы данных
- `JWT_SECRET` - секретный ключ для JWT токенов
- `PORT` - порт для API (должен совпадать с проксированием в Nginx)

## Рекомендации и лучшие практики

1. **Для разработки**:
   - Используйте минимальный запуск (`docker-compose.reference.yml`)
   - Включайте только те компоненты инфраструктуры, с которыми вы работаете

2. **Для тестирования перед релизом**:
   - Используйте полную инфраструктуру stage окружения
   - Проверяйте мониторинг и все дополнительные сервисы

3. **Для продакшена**:
   - Используйте полную конфигурацию prod
   - Убедитесь, что все секреты безопасно храняться вне репозитория

## Поиск неисправностей

### Проблемы с доступом к базе данных

Если API контейнер не может подключиться к базе данных:

1. Проверьте, что переменная `DATABASE_URL` в `.env` правильно указывает на хост базы данных
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

Для проверки переменных окружения внутри контейнера:

```bash
docker exec -it [ID_КОНТЕЙНЕРА] env
``` 