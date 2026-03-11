# Шаблоны и паттерны системы

## Общие компоненты (src/common)

- **Guards** - RolesGuard (проверка ролей), RateLimitGuard (ограничение частоты запросов)
- **Helpers** - EnvHelper (для работы с переменными окружения)
- **Decorators** - Roles, RateLimit и другие
- **Filters** - HttpExceptionFilter (обработка ошибок)
- **Config** - ConfigModule (глобальная конфигурация)
- **PrismaModule** - интеграция с базой данных

## Паттерны безопасности

- **JWT-аутентификация** с refresh токенами
- **Argon2** для хеширования паролей
- **Roles Guard** - защита эндпоинтов по ролям
- **Rate Limiting** - защита от брутфорс-атак
- **Helmet** - защита заголовков
- **CORS** - настройка доступа с разных доменов
