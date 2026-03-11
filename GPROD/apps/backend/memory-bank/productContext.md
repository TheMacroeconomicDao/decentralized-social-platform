# Контекст продукта

## API Endpoints

### Авторизация
- POST /api/v1/auth/register - регистрация
- POST /api/v1/auth/login - вход (JWT)
- POST /api/v1/auth/refresh - обновление токена

### Пользователи
- GET /api/v1/users - список (с пагинацией, поиском, сортировкой)
- GET /api/v1/users/:id - получение по ID
- POST /api/v1/users - создание
- PATCH /api/v1/users/:id - обновление
- DELETE /api/v1/users/:id - удаление (soft-delete)

### Проекты
- GET /api/v1/projects - список (с пагинацией, поиском, сортировкой)
- GET /api/v1/projects/:id - получение по ID
- POST /api/v1/projects - создание
- PATCH /api/v1/projects/:id - обновление
- DELETE /api/v1/projects/:id - удаление

### Системные
- GET /api/v1/health - проверка работоспособности API и базы данных
- GET /api/v1 - информация о сборке (buildTime, gitHash, version)
