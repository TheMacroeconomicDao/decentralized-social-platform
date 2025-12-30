# 🚀 ПРОМПТ: Развертывание в Production (main окружение)

## Задача
Развернуть последнюю версию кода из ветки `main` в production окружение Kubernetes. Действовать основательно, проверить все перед развертыванием, ничего не сломать.

## Контекст проекта
- **Проект**: DSP (Decentralized Social Platform)
- **Репозиторий**: `/Users/Gyber/GYBERNATY-ECOSYSTEM/DSP`
- **Production URL**: https://gyber.org
- **Deployment**: `dsp-prod-deployment` в namespace `default`
- **Registry**: `ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod`
- **Ветка**: `main`

## Инструкция для AI ассистента

Выполни следующие шаги **последовательно и основательно**:

### ШАГ 1: Подготовка и проверка окружения

```bash
# 1.1 Переход в проект
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# 1.2 Проверка текущей ветки (должна быть main)
git branch --show-current
# Если не main, переключиться: git checkout main

# 1.3 Получить последние изменения
git pull origin main

# 1.4 Проверить статус (не должно быть незакоммиченных критичных изменений)
git status

# 1.5 Получить хеш текущего коммита
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "Текущий коммит: $COMMIT_HASH"
```

### ШАГ 2: Проверка инфраструктуры

```bash
# 2.1 Проверка доступа к Kubernetes
kubectl cluster-info
kubectl get nodes

# 2.2 Проверка текущего состояния production deployment
kubectl get deployment dsp-prod-deployment -n default
kubectl get pods -l app=dsp-prod,environment=production -n default

# 2.3 Проверка используемого образа
kubectl describe deployment dsp-prod-deployment -n default | grep "Image:"

# 2.4 Проверка secrets (критично!)
kubectl get secret ghcr-secret -n default
kubectl get secret openai-secret -n default

# 2.5 Проверка сервиса и ingress
kubectl get service dsp-prod-service -n default
kubectl get ingress -n default | grep dsp-prod
```

### ШАГ 3: Проверка Docker

```bash
# 3.1 Проверка что Docker запущен
docker info

# 3.2 Проверка авторизации в GHCR (если нужно)
docker login ghcr.io -u TheMacroeconomicDao --password-stdin <<< "$GITHUB_TOKEN"
# Или проверить существующую авторизацию
```

### ШАГ 4: Сборка образа

```bash
# 4.1 Сборка образа с хешем коммита
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "🔨 Сборка образа для коммита: $COMMIT_HASH"

docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest \
  -f Dockerfile .

# 4.2 Проверка что образ собрался
docker images | grep "dsp-prod" | grep "$COMMIT_HASH"
```

**Важно**: Сборка может занять 10-15 минут. Не прерывать процесс!

### ШАГ 5: Push образа в registry

```bash
# 5.1 Push образа с хешем
COMMIT_HASH=$(git rev-parse --short HEAD)
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH

# 5.2 Push latest тега
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest

# 5.3 Проверка что образ доступен в registry
docker manifest inspect ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH
```

### ШАГ 6: Развертывание в Kubernetes

```bash
# 6.1 Применить манифесты через kustomize
kubectl apply -k k8s/overlays/prod/

# 6.2 Обновить образ в deployment
COMMIT_HASH=$(git rev-parse --short HEAD)
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default

# 6.3 Проверить что образ обновился
kubectl describe deployment dsp-prod-deployment -n default | grep "Image:"

# 6.4 Дождаться завершения rollout (максимум 10 минут)
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s -n default
```

### ШАГ 7: Проверка развертывания

```bash
# 7.1 Проверка статуса подов (должно быть 3/3 Running)
kubectl get pods -l app=dsp-prod,environment=production -n default

# 7.2 Проверка логов (первые 50 строк, искать ошибки)
kubectl logs -l app=dsp-prod,environment=production -n default --tail=50 | grep -i "error\|failed\|exception" || echo "Ошибок не найдено"

# 7.3 Проверка событий
kubectl get events -n default --sort-by='.lastTimestamp' | tail -10

# 7.4 Проверка health endpoint
curl -I https://gyber.org/api/health
# Должно быть: HTTP/2 200

# 7.5 Проверка основного URL
curl -I https://gyber.org
# Должно быть: HTTP/2 200
```

### ШАГ 8: Финальная проверка

```bash
# 8.1 Проверка что все поды работают
kubectl get pods -l app=dsp-prod,environment=production -n default
# Все должны быть: READY 1/1, STATUS Running

# 8.2 Проверка используемого образа
kubectl get deployment dsp-prod-deployment -n default -o jsonpath='{.spec.template.spec.containers[0].image}'
# Должен совпадать с $COMMIT_HASH

# 8.3 Проверка доступности приложения
echo "🌐 Production URL: https://gyber.org"
echo "✅ Проверь в браузере что приложение работает"
```

## Критичные проверки перед развертыванием

1. ✅ **Ветка**: Должна быть `main`
2. ✅ **Secrets**: `ghcr-secret` и `openai-secret` должны существовать
3. ✅ **Текущий deployment**: Проверить что production работает стабильно
4. ✅ **Образ**: Убедиться что образ собрался без ошибок
5. ✅ **Registry**: Образ должен быть доступен в GHCR

## Что делать если что-то пошло не так

### Если поды не запускаются (CrashLoopBackOff):
```bash
# Проверить логи
kubectl logs -l app=dsp-prod,environment=production -n default --previous

# Проверить env переменные
kubectl get deployment dsp-prod-deployment -n default -o jsonpath='{.spec.template.spec.containers[0].env}'
```

### Если ImagePullBackOff:
```bash
# Проверить что образ существует
docker manifest inspect ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH

# Проверить secret
kubectl get secret ghcr-secret -n default
```

### Откат (если нужно):
```bash
# Откатить к предыдущей ревизии
kubectl rollout undo deployment/dsp-prod-deployment -n default

# Или использовать старый образ
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:<OLD_COMMIT_HASH> \
  -n default
```

## Ожидаемый результат

После успешного развертывания:
- ✅ Все 3 пода в статусе `Running`
- ✅ Health API возвращает HTTP 200
- ✅ https://gyber.org доступен и работает
- ✅ Используется новый образ с хешем коммита
- ✅ Нет ошибок в логах

## Важные замечания

1. **НЕ прерывать** процесс сборки образа (10-15 минут)
2. **НЕ пропускать** проверки secrets и инфраструктуры
3. **НЕ деплоить** если текущий production нестабилен
4. **Проверять** логи после развертывания
5. **Тестировать** приложение в браузере после деплоя

---

**Выполни все шаги последовательно, проверяя результат каждого шага перед переходом к следующему.**



