# Helm-чарт для деплоя GPROD Backend

## Общая информация

Проект использует Helm для деплоя в Kubernetes. Helm-чарт находится в директории `helm/gprod-backend/` и содержит все необходимые шаблоны и конфигурации для развертывания приложения.

## Структура Helm-чарта

```
helm/gprod-backend/
├── Chart.yaml          # Метаданные чарта
├── values.yaml         # Значения по умолчанию (общие)
├── values-dev.yaml     # Значения для dev-окружения
├── templates/          # Шаблоны ресурсов Kubernetes
│   ├── deployment.yaml # Деплоймент приложения
│   ├── service.yaml    # Сервис для доступа к приложению
│   ├── ingress.yaml    # Ingress для доступа извне
│   └── secret.yaml     # Секрет с переменными окружения
└── .helmignore         # Файлы, исключаемые из чарта
```

## Основные компоненты

### Deployment

- Создает под с контейнером приложения
- Устанавливает переменные окружения из values и secret
- Настраивает readinessProbe для проверки работоспособности
- Устанавливает ограничения ресурсов (CPU, память)

### Service

- Создает ClusterIP сервис для доступа к приложению
- Направляет трафик с порта 80 на порт 3000 контейнера

### Ingress

- Настраивает внешний доступ к приложению
- Интегрируется с Traefik Ingress Controller
- Настраивает TLS с использованием cert-manager

### Secret

- Создает Kubernetes Secret с переменными окружения
- Включает DATABASE_URL, JWT_SECRET и другие чувствительные данные

## Конфигурация окружений

### Общие настройки (values.yaml)

- Репозиторий образа: `ghcr.io/gybernaty/gprod-backend`
- Окружение: production
- Настройки CORS, rate limit и др.
- Placeholder значения для секретов (требуют замены)

### Dev-окружение (values-dev.yaml)

- Репозиторий образа: `ghcr.io/themacroeconomicdao/gprod-backend`
- Окружение: development
- Расширенные лимиты rate limit
- Тестовые значения для секретов
- Дополнительная конфигурация для базы данных

## Использование

### Установка/обновление

```bash
helm upgrade --install gprod-backend ./helm/gprod-backend \
  -n develop-gprod --create-namespace \
  -f ./helm/gprod-backend/values-dev.yaml \
  --set secretEnv.DATABASE_URL="postgresql://postgres:password@postgres:5432/gprod" \
  --set secretEnv.JWT_SECRET="secure_secret_key"
```

### Подключение секретов

Секреты можно передавать через:
1. `--set secretEnv.*` параметры
2. Отдельный values-файл (не хранить в репозитории)
3. Переменные окружения в CI/CD

## Интеграция с CI/CD

Helm-чарт интегрируется с GitHub Actions для автоматического деплоя:
1. Сборка и публикация Docker-образа
2. Применение миграций базы данных
3. Деплой через Helm с передачей секретов из GitHub Secrets
4. Проверка работоспособности после деплоя
