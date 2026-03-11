
> **DEPRECATED**: This frontend is no longer maintained. The primary frontend is **DSP** (`/DSP`) — a Next.js application with Feature-Sliced Design. All new UI development should happen in DSP. This directory is kept for reference only.

# GPROD — React Vite FSD Theming Template (DEPRECATED)

**Современный шаблон для старта production-ready приложений на React, Vite, TanStack, Redux Toolkit и Feature-Sliced Design.**

---

## 🔄 Развертывание

### Клонирование репозитория

```bash
git clone https://gitlab.com/GybernatyTech/gyberplan-web-app-frontend.git
cd gyberplan-web-app-frontend
```

### Установка пакетов

```bash
npm install
```

### Запуск в режиме разработке

```bash
npm run dev
```

### Сборка

```bash
npm run build
```

### Линтинг кода

```bash
npm run lint
```

### Предварительный просмотр сборки

```bash
npm run preview
```

---

## 🚀 Ключевые особенности

- **Технологический стек**:
  - **React**: Используется для создания пользовательского интерфейса.
  - **Vite**: Современный инструмент сборки для быстрой разработки и высокой производительности.
  - **Redux Toolkit**: Управление состоянием приложения.
  - **TanStack Query/Router/Table**: Асинхронные данные, роутинг, таблицы.
  - **@emotion/styled**: Темизация и CSS-in-JS.
  - **TypeScript**: Строгая типизация.
  - **ESLint, Prettier**: Линтинг и автоформатирование.
  - **Vitest**: Unit-тесты.

- **Feature-Sliced Design (FSD)**:
  - Структура проекта организована по методологии FSD, что обеспечивает четкое разделение функциональности на независимые модули или "фичи".
  - Упрощает масштабирование и поддержку кода.

- **Темизация**:
  - Поддержка светлой и темной тем.
  - Реализована через **ThemeProvider** из **@emotion/styled**, что упрощает управление глобальными стилями.
  - Позволяет адаптировать внешний вид приложения к предпочтениям пользователя.

- **Типографика**:
  - В проекте реализована система типографики, которая позволяет использовать различные варианты текстов для улучшения визуального восприятия контента.
  - Типографика организована в виде объекта `typographyList`, который содержит ключи для различных заголовков и текстовых элементов, таких как `h1`, `h2`, `body1` и т.д.

- **Стилизация компонентов**:
  - Использование **@emotion/styled** для создания стилизованных компонентов с поддержкой CSS-in-JS.
  - Возможность динамического изменения стилей в зависимости от состояния приложения.

- **Гибкость и расширяемость**:
  - Легкое управление темизацией.
  - Идеально подходит как для обучения, так и для создания коммерческих приложений.

---

## 🏗️ Архитектура (Feature-Sliced Design)

```
src/
  app/        # Точка входа, layouts, глобальные провайдеры, маршрутизация
  entities/   # Доменные сущности (User, Project и т.д.)
  features/   # Фичи (NavBar, ThemeSwitcher, Auth и т.д.)
  shared/     # Переиспользуемые компоненты, утилиты, темы, api, конфиги
  widgets/    # Комплексные UI-блоки (NavBar, SideBarWidget)
  pages/      # Страницы (main, users, team, projects, invites)
```

---

## 🎨 Темизация и типографика

- Темы лежат в `src/shared/theme/model/data/`
- Типографика централизована, компонент Typography поддерживает все варианты
- ThemeProvider: @emotion/styled, поддержка light/dark, переключение через Redux + localStorage

**Добавить новую тему:**
1. Создай файл с объектом темы в `src/shared/theme/model/data/`
2. Добавь обработку в ThemeProvider (`App.tsx`)

---

## ⚡ Скрипты

- `npm run dev` — запуск dev-сервера
- `npm run build` — сборка production
- `npm run lint` — линтинг кода
- `npm run preview` — предпросмотр сборки
- `npm run test` — запуск тестов (Vitest)
- `npm run prettier:format` — автоформатирование

---

## 🔗 Алиасы

- Используются алиасы для импортов: `@/shared`, `@/features`, `@/entities`, `@/widgets`, `@/app`
- Настроены в `tsconfig.json` и `vite.config.ts`

---

## 🧪 Тесты

- Используется **Vitest** для unit-тестов
- Пример теста для Typography:
  ```tsx
  import { render } from '@testing-library/react';
  import { Typography } from '@/shared';

  test('renders h1', () => {
    const { getByText } = render(<Typography variant="h1">Hello</Typography>);
    expect(getByText('Hello').tagName).toBe('H1');
  });
  ```

---

## 🏃 CI/CD

В проекте используется GitLab CI для автоматической сборки, деплоя и healthcheck.  
Пример `.gitlab-ci.yml` (адаптирован под frontend, аналогично backend):

```yaml
stages:
  - build
  - deploy
  - healthcheck
  - notify

variables:
  REGISTRY: registry.gitlab.com
  IMAGE_NAME: gybernatytech/gyberplan-web-app-frontend
  NAMESPACE: develop-gprod
  KUSTOMIZE_OVERLAY: k8s/overlays/develop-gprod
  DEPLOYMENT_NAME: gyberplan-frontend
  SERVICE_NAME: gyberplan-frontend
  INGRESS_NAME: gyberplan-frontend-ingress
  HOST: frontend.dev.gprod.build.infra.gyber.org
  IMAGE_TAG: dev

build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
    - docker build -t $REGISTRY/$IMAGE_NAME:$IMAGE_TAG .
    - echo $CI_JOB_TOKEN | docker login -u $CI_REGISTRY_USER --password-stdin $REGISTRY
    - docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG
  only:
    - main
    - develop

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - mkdir -p $HOME/.kube
    - echo "$KUBE_CONFIG" | base64 -d > $HOME/.kube/config
    - chmod 600 $HOME/.kube/config
    - kubectl apply -k $KUSTOMIZE_OVERLAY
    - kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=300s
  only:
    - main
    - develop

healthcheck:
  stage: healthcheck
  image: curlimages/curl:latest
  script:
    - |
      RESPONSE=$(curl -s -w "\n%{http_code}" https://$HOST/ || true)
      BODY=$(echo "$RESPONSE" | head -n -1)
      STATUS=$(echo "$RESPONSE" | tail -n1)
      echo "$BODY" > healthcheck_response.txt
      echo "Healthcheck status: $STATUS"
      if [ "$STATUS" != "200" ]; then exit 1; fi
  only:
    - main
    - develop

notify:
  stage: notify
  image: curlimages/curl:latest
  script:
    - |
      if [ "$CI_JOB_STATUS" == "success" ]; then
        curl -s -X POST "https://api.telegram.org/bot$TG_TOKEN/sendMessage" \
          -d chat_id="$TG_CHAT" \
          -d text="✅ GyberPlan Frontend deploy succeeded: $CI_COMMIT_SHA by $GITLAB_USER_LOGIN"
      else
        curl -s -X POST "https://api.telegram.org/bot$TG_TOKEN/sendMessage" \
          -d chat_id="$TG_CHAT" \
          -d text="❌ GyberPlan Frontend deploy FAILED: $CI_COMMIT_SHA. Check GitLab CI logs."
      fi
  only:
    - main
    - develop
```

**Все переменные (KUBE_CONFIG, TG_TOKEN, TG_CHAT) должны быть заданы в GitLab CI/CD Settings.**

---

## 🛡️ Линтинг и форматирование

- ESLint и Prettier настроены по умолчанию
- Используются pre-commit хуки (husky/simple-git-hooks) для автопроверки кода перед коммитом
- Рекомендуется придерживаться [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/)

---

## 📦 Асинхронные данные

- Используй **TanStack Query** для всех API-запросов (кеширование, автоматическое обновление, отмена запросов)
- Пример:
  ```ts
  import { useQuery } from '@tanstack/react-query';
  const { data, isLoading } = useQuery(['users'], fetchUsers);
  ```

---

## 🔒 Безопасность

- Все секреты и приватные данные должны храниться в `.env` (не коммитить в репозиторий)
- Проверяй, что нет чувствительных данных в исходниках
- Используй npm audit и Snyk для проверки зависимостей

---

## 📝 Рекомендации по расширению

- Добавь README в каждую крупную папку с кратким описанием слоя
- Добавь примеры защищённых маршрутов (auth guard)
- Добавь примеры сложных фич и бизнес-логики (processes)
- Добавь тесты для компонентов и утилит
- Добавь pre-commit хуки
- Добавь скриншоты/демо в README
- Используй OpenAPI/Swagger для описания API (если есть бекенд)
- Добавь раздел FAQ и Troubleshooting

---

## 📖 FAQ

**Q:** Как добавить новую тему?  
**A:** См. секцию "Темизация и типографика".

**Q:** Как добавить новый вариант типографики?  
**A:** См. секцию "Темизация и типографика".

**Q:** Как расширять FSD-структуру?  
**A:** Добавляй новые папки/модули по слоям: entities, features, widgets, shared, pages.

**Q:** Как запускать тесты?  
**A:** `npm run test`

**Q:** Как настроить pre-commit хуки?  
**A:** Установи husky или simple-git-hooks, настрой скрипты в package.json.

---

## 🗺️ Roadmap

- [ ] Добавить e2e-тесты (Playwright/Cypress)
- [ ] Добавить интеграцию с OpenAPI
- [ ] Расширить документацию по архитектуре и паттернам
- [ ] Добавить примеры сложных бизнес-процессов (processes)
- [ ] Улучшить покрытие тестами

---

## 🤝 Контрибьюция

- Ознакомься с CONTRIBUTING.md
- Оформляй коммиты по Conventional Commits
- Перед PR запускай линтер и тесты

---

## 📄 Лицензия

MIT



**Источники и актуальные best practices:**
- [feature-sliced.design](https://feature-sliced.design/ru/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)
- [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/)
- [Современные open-source шаблоны на GitHub](https://github.com/topics/react-template)

