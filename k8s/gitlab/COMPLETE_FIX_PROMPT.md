# 🔧 Полный промпт для диагностики и исправления DSP + Community Lab

## Контекст проблемы

1. **404 ошибка на gyber.org/lab** - GitLab недоступен
2. **Белый экран на gyber.org** - основная платформа не работает
3. **Ошибки в консоли** - проблемы с ресурсами и preload
4. **Требуется обновление** - все компоненты до последней версии

## Задачи

### 1. Полная диагностика кластера

Выполнить следующие команды для сбора полной информации:

```bash
# Общее состояние кластера
kubectl get nodes
kubectl get namespaces

# DSP Production
kubectl get all -n default -l app=dsp-prod
kubectl describe deployment dsp-prod-deployment -n default
kubectl get pods -n default -l app=dsp-prod -o wide
kubectl logs -n default -l app=dsp-prod --tail=50
kubectl describe ingress dsp-prod-ingress -n default
kubectl get service dsp-prod-service -n default
kubectl get endpoints dsp-prod-service -n default

# Community Lab (GitLab)
kubectl get all -n gitlab
kubectl describe deployment gitlab -n gitlab
kubectl get pods -n gitlab -o wide
kubectl logs -n gitlab -l app=gitlab --tail=50
kubectl describe ingress gitlab-ingress -n gitlab
kubectl get service gitlab -n gitlab
kubectl get endpoints gitlab -n gitlab

# События и ошибки
kubectl get events -n default --sort-by='.lastTimestamp' | tail -30
kubectl get events -n gitlab --sort-by='.lastTimestamp' | tail -30

# Проверка ресурсов
kubectl top nodes
kubectl top pods -n default
kubectl top pods -n gitlab

# Проверка Ingress и Traefik
kubectl get ingress -A | grep -E "gyber.org|lab"
kubectl get pods -n kube-system | grep traefik
kubectl logs -n kube-system -l app.kubernetes.io/name=traefik --tail=50 | grep -i error

# Проверка доступности изнутри кластера
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl -v -H "Host: gyber.org" http://10.43.212.31 2>&1 | head -30

kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl -v -H "Host: gyber.org" http://10.43.60.199/lab 2>&1 | head -30
```

### 2. Диагностика проблем

Исследовать следующие аспекты:

1. **DSP Production (gyber.org)**:
   - Проверить статус подов (Running/Error/CrashLoopBackOff)
   - Проверить логи на наличие ошибок
   - Проверить использование ресурсов (CPU/Memory)
   - Проверить доступность изнутри кластера
   - Проверить конфигурацию Ingress и Service
   - Проверить endpoints Service

2. **Community Lab (gyber.org/lab)**:
   - Проверить статус GitLab pod
   - Проверить конфигурацию external_url и relative_url_root
   - Проверить логи GitLab на ошибки
   - Проверить доступность GitLab изнутри пода
   - Проверить Ingress конфигурацию для пути /lab
   - Проверить, применена ли конфигурация (gitlab-ctl reconfigure)

3. **Ingress и маршрутизация**:
   - Проверить Traefik логи на ошибки
   - Проверить правильность маршрутизации
   - Проверить конфликты между Ingress'ами
   - Проверить SSL сертификаты

4. **Ресурсы и производительность**:
   - Проверить использование CPU/Memory
   - Проверить лимиты и requests
   - Проверить на наличие OOMKilled

### 3. Сборка и развертывание

После диагностики выполнить:

```bash
# 1. Получить последний коммит
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "📦 Коммит: $COMMIT_HASH"

# 2. Собрать образ DSP Production
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile .

# 3. Авторизация в GHCR (если нужно)
# echo $GITHUB_TOKEN | docker login ghcr.io -u TheMacroeconomicDao --password-stdin

# 4. Push образа
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH
docker tag ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest

# 5. Обновить DSP Production
kubectl apply -k k8s/overlays/prod/
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s -n default

# 6. Проверить GitLab конфигурацию и применить если нужно
kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- \
  gitlab-ctl reconfigure

kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- \
  gitlab-ctl restart

# 7. Проверить доступность
sleep 30
curl -I https://gyber.org
curl -I https://gyber.org/lab
```

### 4. Исправление проблем

В зависимости от найденных проблем:

1. **Если поды не запускаются**:
   - Проверить лимиты ресурсов
   - Увеличить лимиты если необходимо
   - Проверить образы в registry
   - Проверить ImagePullSecrets

2. **Если GitLab возвращает 404**:
   - Проверить конфигурацию external_url
   - Проверить relative_url_root
   - Применить конфигурацию (gitlab-ctl reconfigure)
   - Перезапустить GitLab

3. **Если Ingress не работает**:
   - Проверить Traefik логи
   - Проверить правильность путей
   - Проверить конфликты между Ingress'ами
   - Пересоздать Ingress если нужно

4. **Если белый экран на основном сайте**:
   - Проверить логи подов DSP
   - Проверить доступность изнутри кластера
   - Проверить конфигурацию Next.js
   - Проверить переменные окружения

### 5. Финальная проверка

После исправлений убедиться что:

- ✅ Все поды в статусе Running
- ✅ DSP доступен на https://gyber.org
- ✅ Community Lab доступен на https://gyber.org/lab
- ✅ Нет ошибок в логах
- ✅ Ресурсы используются нормально
- ✅ Ingress правильно маршрутизирует запросы

## Ожидаемый результат

После выполнения всех шагов:
1. DSP Production работает на https://gyber.org
2. Community Lab работает на https://gyber.org/lab
3. Все компоненты обновлены до последней версии
4. Нет ошибок в консоли браузера
5. Все поды стабильно работают

---

**Начните с полной диагностики, затем последовательно исправляйте найденные проблемы.**

