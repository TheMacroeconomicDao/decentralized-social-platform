# 🚀 Деплой Production - Быстрый старт

## Текущий статус:
- ✅ Ветка: `main`
- ✅ Коммит: `c638f27c` (feat: add ecosystem status page)
- ✅ Файлы закоммичены
- ⚠️  Docker: требуется запуск

## Шаги для деплоя:

### 1. Запустить Docker Desktop
```bash
open -a Docker
# Подождать 30-60 секунд пока Docker запустится
```

### 2. Проверить что Docker работает
```bash
docker info
```

### 3. Выполнить деплой
```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
./deploy-prod.sh
```

Или вручную:

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# Получить хеш коммита
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "Хеш коммита: $COMMIT_HASH"

# Собрать образ
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile .

# Запушить в registry
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH

# Деплой в Kubernetes
kubectl apply -k k8s/overlays/prod/
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s

# Проверка
kubectl get pods -l app=dsp-prod -n default
```

## Ожидаемый результат:

- Образ собран с тегом: `dsp-prod:c638f27c`
- Deployment обновлен в Kubernetes
- 3 пода в статусе Running
- Доступно на: https://gyber.org

## Время выполнения:
- Сборка образа: ~10-15 минут
- Push в registry: ~3-5 минут
- Deployment: ~2-3 минуты
- **Итого: ~15-23 минуты**
