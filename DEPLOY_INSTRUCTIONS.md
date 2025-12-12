# 🚀 DSP - Полная инструкция по деплою

**Проект**: DSP (Decentralized Social Platform)  
**Репозиторий**: https://github.com/TheMacroeconomicDao/decentralized-social-platform  
**Stage**: https://stage.dsp.build.infra.gyber.org  
**Production**: https://gyber.org  
**Последнее обновление**: Январь 2025

---

## 📋 БЫСТРЫЙ СТАРТ (для AI ассистента в новом чате)

```bash
# 1. Переход в проект
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# 2. Проверка текущей ветки (для stage - stage, для prod - main)
git checkout stage
git pull origin stage

# Или для production:
# git checkout main
# git pull origin main

# 3. Сборка образа (только с хешем коммита)
COMMIT_HASH=$(git rev-parse --short HEAD)
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH \
  -f Dockerfile .

# 4. Push в registry
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH

# 5. Deploy в Kubernetes
kubectl apply -k k8s/overlays/stage/
kubectl set image deployment/dsp-stage-deployment dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -n default
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s

# 6. Проверка
kubectl get pods -l app=dsp-stage,environment=stage -n default
```

---

## 🏗️ АРХИТЕКТУРА ПРОЕКТА

### Основные компоненты:
- **Frontend**: Next.js 15.1.8 (App Router)
- **Backend**: Next.js API Routes
- **AI Chat**: OpenAI GPT-4 / Puter.js (Claude 3.7 Sonnet)
- **Web3**: RainbowKit + Wagmi (Ethereum, Polygon, Arbitrum, Base, Optimism)
- **Storage**: IPFS (Helia) для децентрализованного хранения
- **Infrastructure**: Kubernetes (k3s) на production

### Окружения:
1. **Stage** (testing) - namespace: `default`
   - URL: https://stage.dsp.build.infra.gyber.org
   - Image tag: `dsp-stage:latest`
   - Branch: `stage`
   
2. **Production** (main) - namespace: `default`
   - URL: https://gyber.org
   - Image tag: `dsp-prod:latest`
   - Branch: `main`
   - Canary deployment через Flagger

---

## 🔧 ПОДГОТОВКА К ДЕПЛОЮ

### 1. Проверка окружения

```bash
# Kubernetes доступен?
kubectl cluster-info

# Docker запущен?
docker info

# Правильная ветка?
git branch --show-current  # Для stage: stage, для prod: main

# Есть ли незакоммиченные изменения?
git status
```

### 2. Проверка конфигурации

```bash
# Secrets должны существовать
kubectl get secret ghcr-secret -n default
kubectl get secret openai-secret -n default

# Проверить deployment
kubectl get deployment dsp-stage-deployment -n default

# Проверить env переменные в deployment
kubectl get deployment dsp-stage-deployment -n default -o jsonpath='{.spec.template.spec.containers[0].env}' | jq .
```

---

## 📦 СБОРКА ОБРАЗА

### Стандартная сборка (с кешем):

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# Для stage
COMMIT_HASH=$(git rev-parse --short HEAD)
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH \
  -f Dockerfile .

# Для production
COMMIT_HASH=$(git rev-parse --short HEAD)
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile .
```

**Время**: ~10-15 минут (первый раз), ~5-7 минут (с кешем)  
**Размер**: ~400-500 MB

### Сборка без кеша (если проблемы):

```bash
docker build --no-cache \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:latest \
  -f Dockerfile .
```

**Время**: ~15-20 минут

### Проверка успешной сборки:

```bash
# Проверить что образ создался
docker images | grep "decentralized-social-platform" | head -3

# Должны увидеть:
# ghcr.io/.../dsp-stage   <commit-hash>   XXXXX   N seconds/minutes ago   400-500MB
```

---

## 📤 PUSH В REGISTRY

### Логин в GitHub Container Registry (если нужно):

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u TheMacroeconomicDao --password-stdin
```

### Push образа:

```bash
# Для stage
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:latest
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$(git rev-parse --short HEAD)

# Для production
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$(git rev-parse --short HEAD)
```

**Время**: ~3-5 минут

---

## 🚀 DEPLOYMENT В KUBERNETES

### Stage окружение:

```bash
# 1. Применить манифесты через kustomize
kubectl apply -k k8s/overlays/stage/

# 2. Обновить образ в deployment
COMMIT_HASH=$(git rev-parse --short HEAD)
kubectl set image deployment/dsp-stage-deployment \
  dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH \
  -n default

# 3. Дождаться завершения rollout
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s

# 4. Проверить поды
kubectl get pods -l app=dsp-stage,environment=stage -n default

# Должно быть: 2/2 Running
```

### Production окружение:

```bash
# 1. Применить манифесты через kustomize
kubectl apply -k k8s/overlays/prod/

# 2. Обновить образ в deployment
COMMIT_HASH=$(git rev-parse --short HEAD)
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default

# 3. Дождаться завершения rollout (может быть canary)
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s

# 4. Проверить canary status (если используется Flagger)
kubectl get canary -n default
```

### Проверка используемого образа:

```bash
# Stage
kubectl describe deployment dsp-stage-deployment -n default | grep "Image:"

# Production
kubectl describe deployment dsp-prod-deployment -n default | grep "Image:"
```

---

## 🧪 ТЕСТИРОВАНИЕ ПОСЛЕ ДЕПЛОЯ

### 1. Проверка health

```bash
# Stage
curl -I https://stage.dsp.build.infra.gyber.org

# Production
curl -I https://gyber.org

# Должно быть: HTTP/2 200
```

### 2. Тест API endpoints

```bash
# Health check
curl https://stage.dsp.build.infra.gyber.org/api/health

# Должно вернуть:
# {"status":"healthy","timestamp":"...","services":{"openai":"configured"}}
```

### 3. Тест AI Chat (требует OPENAI_API_KEY)

```bash
curl -X POST https://stage.dsp.build.infra.gyber.org/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Привет! Расскажи о проекте Gybernaty",
    "stream": false
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Ожидаемый результат**:
```json
{
  "author": "Gybernaty AI",
  "text": "Привет! Gybernaty - это прогрессивное сообщество...",
  "timestamp": 1234567890,
  "avatarSrc": "/gybernaty-ai-avatar.png"
}
HTTP Status: 200
```

### 4. Проверка Web3 интеграции

Открыть в браузере:
- https://stage.dsp.build.infra.gyber.org/unit-dashboard
- Проверить подключение кошелька
- Проверить отображение Unit Profile

---

## 🔍 ДИАГНОСТИКА ПРОБЛЕМ

### Проверка логов:

```bash
# Последние 50 строк (stage)
kubectl logs -l app=dsp-stage,environment=stage -n default --tail=50

# Следить за логами в реальном времени
kubectl logs -l app=dsp-stage,environment=stage -n default -f

# Ошибки
kubectl logs -l app=dsp-stage,environment=stage -n default --tail=100 | grep -i "error\|failed\|exception"
```

### Проверка статуса подов:

```bash
# Статус подов
kubectl get pods -l app=dsp-stage,environment=stage -n default

# Детали пода
kubectl describe pod -l app=dsp-stage,environment=stage -n default

# События
kubectl get events -n default --sort-by='.lastTimestamp' | tail -20
```

### Если поды не запускаются:

```bash
# Проверить причину
kubectl get pods -l app=dsp-stage,environment=stage -n default -o jsonpath='{.items[*].status.containerStatuses[*].state}'

# Логи crashed пода
kubectl logs -l app=dsp-stage,environment=stage -n default --previous

# Проверить ImagePullBackOff
kubectl describe pod -l app=dsp-stage,environment=stage -n default | grep -A 5 "Events:"
```

---

## 🛠️ ЧАСТЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема 1: Build провалился

**Симптомы**: TypeScript errors, module not found, dependencies missing

**Решение**:
```bash
# Проверить что package.json актуален
cat package.json | grep -E "next|react|typescript"

# Проверить что нет проблемных импортов
grep -r "from.*\.\." src/ | head -10

# Пересобрать без кеша
docker build --no-cache -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:latest -f Dockerfile .
```

### Проблема 2: "ImagePullBackOff" в Kubernetes

**Причина**: Образ не существует в registry или проблемы с secrets

**Решение**:
```bash
# 1. Проверить что образ существует в registry
COMMIT_HASH=$(git rev-parse --short HEAD)
docker manifest inspect ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH

# 2. Проверить imagePullSecrets
kubectl get secret ghcr-secret -n default

# 3. Пересоздать secret если нужно
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=TheMacroeconomicDao \
  --docker-password=$GITHUB_TOKEN \
  --namespace=default

# 4. Перезапустить deployment
kubectl rollout restart deployment/dsp-stage-deployment -n default
```

### Проблема 3: Pods падают с CrashLoopBackOff

**Решение**:
```bash
# 1. Проверить логи
kubectl logs -l app=dsp-stage,environment=stage -n default --previous

# 2. Проверить env переменные
kubectl get deployment dsp-stage-deployment -n default -o jsonpath='{.spec.template.spec.containers[0].env}'

# 3. Проверить что OPENAI_API_KEY установлен
kubectl get secret openai-secret -n default

# 4. Если секрет отсутствует, создать:
kubectl create secret generic openai-secret \
  --from-literal=api-key=$OPENAI_API_KEY \
  -n default
```

### Проблема 4: Docker не запускается

**Решение**:
```bash
# Перезапустить Docker Desktop
killall Docker
sleep 3
open -a Docker

# Подождать 30-60 секунд
sleep 60

# Проверить готовность
docker info
```

### Проблема 5: "Cannot connect to Kubernetes cluster"

**Решение**:
```bash
# Проверить kubeconfig
kubectl config current-context

# Проверить доступность кластера
kubectl cluster-info

# Проверить права доступа
kubectl auth can-i get pods -n default
```

---

## 📊 ПРОВЕРКА КОНФИГУРАЦИИ

### Критичные env переменные:

```bash
# Проверить env в deployment
kubectl get deployment dsp-stage-deployment -n default -o yaml | grep -A 5 "env:"
```

Должны быть:
- `OPENAI_API_KEY` - из secret `openai-secret`
- `NODE_ENV=production`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

### Secrets (обязательные):

```bash
# Проверить существование secrets
kubectl get secrets -n default | grep -E "ghcr-secret|openai-secret"

# Должны быть:
# ghcr-secret (для pull образов из GHCR)
# openai-secret (для OPENAI_API_KEY)
```

---

## 🔄 ПОЛНЫЙ ЦИКЛ ДЕПЛОЯ (copy-paste ready)

### Для Stage:

```bash
#!/bin/bash
set -e

echo "🚀 DSP - Полный деплой в Stage"
echo ""

# 1. Переход в проект
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
echo "✅ В директории проекта"

# 2. Переключение на stage и pull
git checkout stage
git pull origin stage
echo "✅ Stage ветка обновлена"

# 3. Проверка Docker
docker info >/dev/null 2>&1 || { echo "❌ Docker не запущен!"; exit 1; }
echo "✅ Docker работает"

# 4. Сборка образа
echo "🔨 Собираю образ (10-15 минут)..."
COMMIT_HASH=$(git rev-parse --short HEAD)
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH \
  -f Dockerfile .

echo "✅ Образ собран"

# 5. Push в registry
echo "📤 Пушу в registry..."
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH
echo "✅ Образ запушен"

# 6. Deploy в Kubernetes
echo "🚀 Деплою в Kubernetes..."
kubectl apply -k k8s/overlays/stage/
kubectl set image deployment/dsp-stage-deployment \
  dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH \
  -n default
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s
echo "✅ Deployment завершен"

# 7. Проверка статуса
echo ""
echo "📊 Статус подов:"
kubectl get pods -l app=dsp-stage,environment=stage -n default

echo ""
echo "📦 Используемый образ:"
kubectl describe deployment dsp-stage-deployment -n default | grep "Image:"

echo ""
echo "🧪 Тест Health API:"
curl -s https://stage.dsp.build.infra.gyber.org/api/health | jq .

echo ""
echo "🎉 Деплой завершен успешно!"
echo "🌐 Stage URL: https://stage.dsp.build.infra.gyber.org"
```

### Для Production:

```bash
#!/bin/bash
set -e

echo "🚀 DSP - Полный деплой в Production"
echo ""

# 1. Переход в проект
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
echo "✅ В директории проекта"

# 2. Переключение на main и pull
git checkout main
git pull origin main
echo "✅ Main ветка обновлена"

# 3. Проверка Docker
docker info >/dev/null 2>&1 || { echo "❌ Docker не запущен!"; exit 1; }
echo "✅ Docker работает"

# 4. Сборка образа
echo "🔨 Собираю образ (10-15 минут)..."
COMMIT_HASH=$(git rev-parse --short HEAD)
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile .

echo "✅ Образ собран"

# 5. Push в registry
echo "📤 Пушу в registry..."
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH
echo "✅ Образ запушен"

# 6. Deploy в Kubernetes
echo "🚀 Деплою в Kubernetes..."
kubectl apply -k k8s/overlays/prod/
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s
echo "✅ Deployment завершен"

# 7. Проверка canary (если используется)
echo ""
echo "📊 Canary статус:"
kubectl get canary -n default

echo ""
echo "📊 Статус подов:"
kubectl get pods -l app=dsp-prod -n default

echo ""
echo "🎉 Деплой завершен успешно!"
echo "🌐 Production URL: https://gyber.org"
```

---

## 📝 ЧТО НУЖНО ЗНАТЬ О ПРОЕКТЕ

### Критичные файлы:

1. **src/app/layout.tsx** - основной layout
   - Использует `layoutId="bow"` для уникальной анимации Navbar
   - Включает GlobalAnimatedBackground, Navbar, Footer
   - **Service Worker** активирован через `ServiceWorkerScript` компонент

2. **src/widgets/Navbar/ui/Navbar/Navbar-Enhanced.tsx** - навигация
   - **ВАЖНО**: Должен использовать `layoutId="bow"` для анимации

3. **src/app/api/chat/route.ts** - AI Chat API
   - Использует OPENAI_API_KEY из secrets
   - Fallback на Puter.js если сервер недоступен
   - **In-memory кеширование** ответов (TTL 5 минут, max 100 записей)
   - **Cache-Control headers** для CDN кеширования

4. **src/shared/config/web3.ts** - Web3 конфигурация
   - Поддерживает Ethereum, Polygon, Arbitrum, Base, Optimism, Sepolia
   - Требует NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

5. **src/app/providers/Web3Provider.tsx** - Web3 провайдер
   - SSR disabled для предотвращения hydration issues

### Особенности архитектуры:

- **Feature-Sliced Design (FSD)** - структура проекта
- **Next.js 15.1.8** с App Router
- **Standalone output** для Docker (next.config.js)
- **Kustomize** для управления Kubernetes манифестами
- **Canary deployment** для production (через Flagger)

### Оптимизации производительности (Январь 2025):

- **Service Worker** - активирован в `layout.tsx` для offline-поддержки и кеширования
- **Code Splitting** - lazy loading для тяжелых компонентов (Chat, ParticleSystem, DynamicLighting)
- **API Кеширование** - in-memory кеш для `/api/chat` (TTL 5 минут, max 100 записей)
- **Production Logging** - условное логирование (только ошибки в production)
- **Image Optimization** - автоматический выбор AVIF/WebP форматов, responsive images
- **Bundle Optimization** - webpack code splitting, vendor chunks, runtime optimization

---

## 🔐 СЕКРЕТЫ И ПЕРЕМЕННЫЕ

### Env переменные (обязательные):

```bash
# В Kubernetes deployment (из secrets):
- OPENAI_API_KEY - из secret openai-secret
- NODE_ENV=production
- PORT=3000
- HOSTNAME=0.0.0.0

# Публичные (в .env.local для разработки):
- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID - для Web3 подключения
```

### Секреты (НЕ коммитить!):

```bash
# Kubernetes secrets (уже должны быть созданы):
- ghcr-secret - для pull образов из GHCR
- openai-secret - содержит OPENAI_API_KEY

# Создание secrets:
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=TheMacroeconomicDao \
  --docker-password=$GITHUB_TOKEN \
  -n default

kubectl create secret generic openai-secret \
  --from-literal=api-key=$OPENAI_API_KEY \
  -n default
```

---

## 📋 CHECKLIST ПЕРЕД ДЕПЛОЕМ

- [ ] Git: правильная ветка (stage или main), pull завершен
- [ ] Docker: запущен и отвечает
- [ ] Линтер: нет критичных ошибок
- [ ] Build: образ собрался успешно
- [ ] Push: образ в registry
- [ ] Secrets: ghcr-secret и openai-secret существуют
- [ ] Deployment: pods 2/2 Running
- [ ] Health API: HTTP 200
- [ ] Stage URL: доступен и работает
- [ ] AI Chat: отвечает (если OPENAI_API_KEY настроен)

---

## 🆘 ROLLBACK (если что-то пошло не так)

### Откат к предыдущей версии:

```bash
# 1. Найти предыдущий рабочий коммит
git log --oneline -10

# 2. Откатить ветку
git reset --hard <PREVIOUS_COMMIT_HASH>
git push origin stage --force  # или main

# 3. Пересобрать и задеплоить
COMMIT_HASH=$(git rev-parse --short HEAD)
docker build -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -f Dockerfile .
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH
kubectl set image deployment/dsp-stage-deployment dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -n default
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s
```

### Откат deployment без изменения кода:

```bash
# Использовать старый образ по тегу
kubectl set image deployment/dsp-stage-deployment \
  dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:<OLD_COMMIT_HASH> \
  -n default

kubectl rollout status deployment/dsp-stage-deployment --timeout=300s
```

### Откат через kubectl rollout:

```bash
# Просмотреть историю rollout
kubectl rollout history deployment/dsp-stage-deployment -n default

# Откатить к предыдущей ревизии
kubectl rollout undo deployment/dsp-stage-deployment -n default

# Или к конкретной ревизии
kubectl rollout undo deployment/dsp-stage-deployment --to-revision=2 -n default
```

---

## 📚 ДОКУМЕНТАЦИЯ

- `README.md` - общее описание проекта
- `PROJECT_FIXES_REPORT.md` - отчет об исправлениях
- `FINAL_CHECK_SUMMARY.md` - итоговая сводка готовности
- `DEPLOYMENT_CHECKLIST.md` - чеклист деплоя
- `STAGE_DEPLOY_READY.md` - готовность к stage деплою

---

## 💡 ВАЖНЫЕ КОМАНДЫ

```bash
# Быстрая пересборка и деплой (stage)
COMMIT_HASH=$(git rev-parse --short HEAD) && \
docker build -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -f Dockerfile . && \
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH && \
kubectl set image deployment/dsp-stage-deployment dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -n default && \
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s

# Посмотреть логи ошибок
kubectl logs -l app=dsp-stage,environment=stage -n default --tail=100 | grep -i error

# Проверить env в работающем поде
kubectl exec -it deployment/dsp-stage-deployment -n default -- env | grep -E "OPENAI|NODE_ENV|PORT"

# Использовать deploy скрипт
./deploy-stage.sh

# Проверить ingress
kubectl get ingress dsp-stage-ingress -n default

# Проверить сертификат (TLS)
kubectl get certificate -n default
```

---

## 🎯 ДЛЯ AI АССИСТЕНТА

**Когда пользователь просит "собери и задеплой на stage":**

1. `cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP`
2. `git checkout stage && git pull origin stage`
3. `COMMIT_HASH=$(git rev-parse --short HEAD) && docker build -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -f Dockerfile .`
4. `docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH`
5. `kubectl apply -k k8s/overlays/stage/`
6. `kubectl set image deployment/dsp-stage-deployment dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:$COMMIT_HASH -n default`
7. `kubectl rollout status deployment/dsp-stage-deployment --timeout=300s`
8. Проверить через `kubectl get pods -l app=dsp-stage,environment=stage -n default`

**НЕ запускать build в фоне** - пользователь хочет видеть вывод!

**Помнить**:
- Для stage: ветка **stage**, namespace **default**, deployment **dsp-stage-deployment**
- Для prod: ветка **main**, namespace **default**, deployment **dsp-prod-deployment**
- Stage URL: **https://stage.dsp.build.infra.gyber.org**
- Production URL: **https://gyber.org**
- Используем **kustomize** для манифестов (`kubectl apply -k`)
- Образы: **dsp-stage:latest** и **dsp-prod:latest**
- Secrets: **ghcr-secret** (для GHCR), **openai-secret** (для OPENAI_API_KEY)

---

## 🔄 CI/CD (GitHub Actions)

### Автоматический деплой:

**Stage CD** (автоматический при push в `stage`):
1. Build image `dsp-stage:<commit-hash>` (только с хешем коммита)
2. Deploy overlay `k8s/overlays/stage`
3. Telegram notify success / failure

**Prod CD** (требует approval при push в `main`):
1. Build image `dsp-prod:<commit-hash>` (только с хешем коммита)
2. Deploy overlay `k8s/overlays/prod` (includes Canary)
3. Wait Flagger promotion (<=30 min)
4. Telegram notify

### Secrets required in GitHub repo:

```
GHCR_USERNAME          # ghcr.io user/org
GHCR_TOKEN             # PAT (packages:write)
KUBE_CONFIG            # base64-encoded kubeconfig
TELEGRAM_BOT_TOKEN     # bot API token
TELEGRAM_CHAT_ID       # chat / group id
```

---

## 🌐 ДОСТУП К ПРИЛОЖЕНИЮ

### Stage:
- **URL**: https://stage.dsp.build.infra.gyber.org
- **Ingress**: Traefik
- **TLS**: Let's Encrypt (cert-manager)
- **Service**: `dsp-stage-service` (ClusterIP, port 80 → 3000)

### Production:
- **URL**: https://gyber.org
- **Gateway**: Istio Gateway
- **TLS**: Istio Certificate
- **Canary**: Flagger для постепенного rollout

---

**Автор**: AI Assistant  
**Дата**: Январь 2025  
**Версия**: 1.0


