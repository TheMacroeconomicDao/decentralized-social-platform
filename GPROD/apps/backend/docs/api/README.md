# API документация GPROD

## Содержание

- [Обзор API](#обзор-api)
- [Базовая информация](#базовая-информация)
- [Аутентификация](#аутентификация)
- [Ресурсы API](#ресурсы-api)
- [Форматы данных](#форматы-данных)
- [Интеграция с Swagger](#интеграция-с-swagger)
- [Примеры запросов](#примеры-запросов)

## Обзор API

API GPROD построено по принципам REST и предоставляет доступ к основным ресурсам системы: пользователям, проектам, а также возможности аутентификации и авторизации. API использует JSON для форматирования данных и стандартные HTTP-методы для операций.

API имеет версионирование и все эндпоинты доступны по маршруту `/api/v1/...`.

## Базовая информация

- **Базовый URL**: `/api/v1`
- **Формат данных**: JSON
- **Аутентификация**: JWT (Bearer token)
- **Состояние приложения**: `GET /api/v1/health`
- **Информация о сборке**: `GET /api/v1`

## Аутентификация

API использует JWT (JSON Web Tokens) для аутентификации. Токен должен быть включен в заголовок `Authorization` в формате `Bearer <token>`.

### Получение токена

Для получения токена доступа необходимо выполнить вход:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "username",
  "password": "password"
}
```

Ответ содержит токены доступа и обновления:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Обновление токена

Для обновления токена доступа используется refresh token:

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Ресурсы API

### Auth

| Метод | Путь                  | Описание                         | Аутентификация |
|-------|----------------------|----------------------------------|-----------------|
| POST  | `/auth/register`     | Регистрация нового пользователя   | Нет             |
| POST  | `/auth/login`        | Аутентификация и получение токена | Нет             |
| POST  | `/auth/refresh`      | Обновление токена доступа         | Нет             |

### Users

| Метод  | Путь            | Описание                    | Аутентификация |
|--------|----------------|---------------------------- |----------------|
| GET    | `/users`       | Список пользователей         | Нет*           |
| GET    | `/users/:id`   | Получение пользователя по ID  | Нет*           |
| POST   | `/users`       | Создание пользователя         | Да             |
| PATCH  | `/users/:id`   | Обновление пользователя       | Да             |
| DELETE | `/users/:id`   | Удаление пользователя         | Да             |

\* Некоторые данные могут быть скрыты без аутентификации

### Projects

| Метод  | Путь               | Описание                  | Аутентификация |
|--------|--------------------|--------------------------|--------------------|
| GET    | `/projects`        | Список проектов           | Да                 |
| GET    | `/projects/:id`    | Получение проекта по ID    | Да                 |
| POST   | `/projects`        | Создание проекта           | Да                 |
| PATCH  | `/projects/:id`    | Обновление проекта         | Да                 |
| DELETE | `/projects/:id`    | Удаление проекта           | Да (роль: admin)   |

### Health

| Метод | Путь       | Описание                              | Аутентификация |
|-------|-----------|---------------------------------------|----------------|
| GET   | `/health`  | Проверка состояния API и базы данных   | Нет            |

## Форматы данных

### User

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["user"],
  "createdAt": "2023-05-01T12:00:00.000Z",
  "updatedAt": "2023-05-01T12:00:00.000Z"
}
```

### Project

```json
{
  "id": 1,
  "title": "Project Name",
  "description": "Project Description",
  "ownerId": 1,
  "createdAt": "2023-05-01T12:00:00.000Z",
  "updatedAt": "2023-05-01T12:00:00.000Z"
}
```

### API Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "code": "USER_NOT_FOUND"
}
```

## Интеграция с Swagger

API документация доступна через Swagger UI:

- **Для v1**: `http://localhost:{PORT}/api/v1/docs` 
- **Для v2**: `http://localhost:{PORT}/api/v2/docs`

Где PORT зависит от контура окружения:
- Development: 3008
- Staging: 3003
- Production: 3007

Swagger UI предоставляет интерактивную документацию API со следующими возможностями:
- Просмотр всех доступных эндпоинтов
- Тестирование API запросов непосредственно из интерфейса
- Изучение моделей данных и структур ответов
- Авторизация с использованием Bearer токена для тестирования защищенных эндпоинтов

Документация API автоматически генерируется с использованием декораторов из `@nestjs/swagger`, которые размещены в контроллерах и DTO.

## Примеры запросов

### Регистрация пользователя

```bash
curl -X POST http://localhost:3008/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"vasya","email":"vasya@mail.com","password":"qwerty"}'
```

### Вход пользователя

```bash
curl -X POST http://localhost:3008/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"vasya","password":"qwerty"}'
```

### Получение списка пользователей

```bash
curl http://localhost:3008/api/v1/users
```

### Получение списка проектов (с аутентификацией)

```bash
curl http://localhost:3008/api/v1/projects \
  -H 'Authorization: Bearer <token>'
```

### Проверка состояния API

```bash
curl http://localhost:3008/api/v1/health
```

## Дополнительные документы

- [Детальная спецификация API](api-specification.md) - полное описание всех эндпоинтов
- [Модели данных](data-models.md) - детальное описание моделей данных
- [Руководство по авторизации](authorization-guide.md) - подробности о системе авторизации
