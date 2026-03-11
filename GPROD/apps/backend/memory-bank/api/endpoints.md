# API эндпоинты GPROD Backend

## Общая информация

API GPROD Backend организовано в соответствии с принципами RESTful и разделено на модули:

- **auth** - аутентификация и авторизация
- **users** - управление пользователями
- **projects** - управление проектами
- **health** - проверка работоспособности API

Все эндпоинты документированы с использованием Swagger и доступны по URL `/api/v1/docs`.

## Модули API

### Модуль аутентификации (auth)

| Метод | Эндпоинт | Описание | Параметры | Ограничения |
|-------|----------|----------|-----------|-------------|
| POST | `/auth/register` | Регистрация пользователя | `CreateUserDto` (username, email, password, roles) | 5 req/min |
| POST | `/auth/login` | Авторизация пользователя | `LoginDto` (username, password) | 10 req/min |
| POST | `/auth/refresh` | Обновление JWT токена | `refresh_token` | - |

#### DTO объекты

**LoginDto**
```typescript
class LoginDto {
  username: string;
  password: string;
}
```

### Модуль пользователей (users)

| Метод | Эндпоинт | Описание | Параметры | Auth | Роли |
|-------|----------|----------|-----------|------|------|
| POST | `/users` | Создание пользователя | `CreateUserDto` | - | - |
| GET | `/users` | Получение списка пользователей | page, limit, search, sort | JWT | - |
| GET | `/users/:id` | Получение пользователя по ID | id | JWT | - |
| PATCH | `/users/:id` | Обновление пользователя | id, `UpdateUserDto` | JWT | - |
| DELETE | `/users/:id` | Удаление пользователя | id | JWT | admin |

#### DTO объекты

**CreateUserDto**
```typescript
export class CreateUserDto {
  @IsString() @MinLength(3) @MaxLength(64)
  username: string;

  @IsEmail() @MaxLength(128)
  email: string;

  @IsString() @MinLength(6) @MaxLength(128)
  password: string;

  @IsOptional() @IsArray() @ArrayNotEmpty() @ArrayUnique()
  @IsIn([UserRole.USER, UserRole.ADMIN], { each: true })
  roles?: UserRole[];
}
```

**UpdateUserDto**
```typescript
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  username?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional() @IsArray() @ArrayNotEmpty() @ArrayUnique()
  @IsIn([UserRole.USER, UserRole.ADMIN], { each: true })
  roles?: UserRole[];
}
```

### Модуль проектов (projects)

| Метод | Эндпоинт | Описание | Параметры | Auth | Rate Limit |
|-------|----------|----------|-----------|------|------------|
| POST | `/projects` | Создание проекта | `CreateProjectDto` | JWT | 10 req/min |
| GET | `/projects` | Получение списка проектов | page, limit, search, sort | JWT | 30 req/min |
| GET | `/projects/:id` | Получение проекта по ID | id | JWT | - |
| PATCH | `/projects/:id` | Обновление проекта | id, `UpdateProjectDto` | JWT | - |
| DELETE | `/projects/:id` | Удаление проекта | id | JWT* | - |

\* Только admin или владелец проекта может удалить проект

#### DTO объекты

**CreateProjectDto**
```typescript
export class CreateProjectDto {
  @IsString() @MaxLength(128)
  title: string;

  @IsString() @IsOptional()
  description?: string;

  @IsInt() @IsOptional()
  ownerId?: number;
}
```

**UpdateProjectDto**
```typescript
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
```

### Модуль проверки работоспособности (health)

| Метод | Эндпоинт | Описание | Rate Limit |
|-------|----------|----------|------------|
| GET | `/health` | Проверка работоспособности API и базы данных | 5 req/min |

## Общие особенности API

### Безопасность

- **JWT аутентификация** через заголовок `Authorization: Bearer <token>`
- **Ролевая модель** с ролями `user` и `admin`
- **Rate Limiting** для защиты от атак
- **Валидация** входящих данных через class-validator

### Запросы и ответы

- **Пагинация** через параметры `page` и `limit`
- **Поиск** через параметр `search`
- **Сортировка** через параметр `sort` (формат: `field:asc/desc`)
- **Унифицированные ответы** с статус-кодами HTTP
- **Подробные сообщения об ошибках** через `ApiErrorResponseDto`

### Документация

- **Swagger UI** для интерактивной документации
- **Аннотации** для всех эндпоинтов, параметров и схем
- **Примеры запросов и ответов**
