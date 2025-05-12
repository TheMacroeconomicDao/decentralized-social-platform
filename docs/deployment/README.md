# Руководство по развертыванию

## Общая информация

Проект Gybernaty DSP поддерживает различные варианты развертывания:
- Развертывание через Vercel (рекомендуется)
- Развертывание с использованием Docker
- Ручное развертывание на сервере

## Развертывание через Vercel

### Шаги для развертывания на Vercel:

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Импортируйте проект из GitHub:
   - Нажмите "Add New" > "Project"
   - Выберите репозиторий из списка
   - Нажмите "Import"

3. Настройте переменные окружения (при необходимости)
4. Нажмите "Deploy"

После успешного развертывания, Vercel автоматически предоставит URL для доступа к приложению.

## Развертывание с использованием Docker

Проект поставляется с настроенным Docker и docker-compose конфигурацией.

### Требования:
- Docker
- Docker Compose

### Шаги для развертывания с Docker:

1. Клонируйте репозиторий:
```bash
git clone https://github.com/TheMacroeconomicDao/decentralized-social-platform.git
cd decentralized-social-platform
```

2. Соберите и запустите контейнеры:
```bash
docker-compose up -d
```

3. Приложение будет доступно по адресу `http://localhost:3000`

### Конфигурация Docker

Проект использует два файла для настройки Docker:
- `Dockerfile` - конфигурация образа
- `docker-compose.yml` - конфигурация сервисов

## Ручное развертывание на сервере

### Требования:
- Node.js 16.x или выше
- npm или yarn
- PM2 (опционально, для управления процессом)

### Шаги для ручного развертывания:

1. Клонируйте репозиторий:
```bash
git clone https://github.com/TheMacroeconomicDao/decentralized-social-platform.git
cd decentralized-social-platform
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Создайте производственную сборку:
```bash
npm run build
# или
yarn build
```

4. Запустите приложение:
```bash
npm run start
# или
yarn start
```

5. Для запуска с PM2:
```bash
pm2 start npm --name "gybernaty-dsp" -- start
```

## Переменные окружения

Для настройки приложения можно использовать следующие переменные окружения:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://example.com
```

Создайте файл `.env.local` в корне проекта для локального развертывания или добавьте переменные в настройки вашего хостинг-провайдера.

## CI/CD

Проект настроен для непрерывной интеграции и развертывания через GitHub Actions. Конфигурация находится в директории `.github/workflows/`.

### Основные рабочие процессы:

1. Проверка кода при создании Pull Request
2. Автоматическое развертывание на Vercel при слиянии в ветку `main`

## Мониторинг

Для мониторинга приложения рекомендуется использовать:

1. Vercel Analytics (если используется Vercel)
2. Prometheus + Grafana (для самостоятельного хостинга)
3. Sentry для отслеживания ошибок

## Обновление приложения

### Для Vercel:
Vercel автоматически запускает новое развертывание при изменении кода в репозитории.

### Для Docker:
```bash
git pull
docker-compose build
docker-compose up -d
```

### Для ручного развертывания:
```bash
git pull
npm install
npm run build
npm run start
``` 