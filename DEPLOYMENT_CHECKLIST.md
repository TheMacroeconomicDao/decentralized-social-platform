# 📋 ЧЕКЛИСТ ДЕПЛОЯ НА STAGE

## ✅ Предварительные проверки

- [x] Kubernetes кластер доступен
- [x] kubectl настроен и работает
- [x] Deployment манифесты готовы
- [x] Dockerfile настроен
- [x] deploy-stage.sh скрипт исправлен

## 🔧 Текущее состояние

**Ветка:** `unit-profile`  
**Целевая ветка для stage:** `stage`  
**Kubernetes кластер:** ✅ Доступен  
**Существующий deployment:** `dsp-stage-deployment` (0/2 pods ready)

## 📝 Шаги для деплоя

### Вариант 1: Деплой с текущей ветки (если нужно протестировать изменения)

```bash
# 1. Закоммитить изменения
git add .
git commit -m "Fix: All critical issues resolved, project ready for stage"

# 2. Переключиться на stage или смержить изменения
git checkout stage
git merge unit-profile
# ИЛИ
git checkout stage
git cherry-pick <commit-hash>

# 3. Запустить деплой
./deploy-stage.sh
```

### Вариант 2: Деплой с ветки stage (если там уже есть нужные изменения)

```bash
# 1. Переключиться на stage
git checkout stage

# 2. Запустить деплой
./deploy-stage.sh
```

## 🚀 Что делает deploy-stage.sh

1. ✅ Проверяет доступность Kubernetes кластера
2. 📦 Собирает Docker образ
3. 📤 Пушит образ в GHCR
4. ☸️ Применяет Kubernetes манифесты через kustomize
5. 🔄 Обновляет deployment с новым образом
6. ⏳ Ожидает готовности deployment
7. 📊 Показывает статус

## ⚠️ Требования перед деплоем

1. **Docker должен быть запущен**
2. **Доступ к GHCR** (авторизация через docker login)
3. **Secrets в Kubernetes:**
   - `ghcr-secret` - для pull образов из GHCR
   - `openai-secret` - для OPENAI_API_KEY

## 🔍 Проверка после деплоя

```bash
# Проверить pods
kubectl get pods -l app=dsp-stage,environment=stage -n default

# Проверить deployment
kubectl get deployment dsp-stage-deployment -n default

# Проверить service
kubectl get service dsp-stage-service -n default

# Проверить ingress
kubectl get ingress dsp-stage-ingress -n default

# Логи pods
kubectl logs -l app=dsp-stage,environment=stage -n default --tail=50
```

## 🌐 URL после успешного деплоя

**Stage URL:** https://stage.dsp.build.infra.gyber.org

## 📝 Заметки

- Deployment использует образ: `ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:latest`
- Реплики: 2
- Namespace: `default`
- Порт: 3000

