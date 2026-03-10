# Промпт для исправления сайта gyber.org

## Контекст проблемы

Сайт **gyber.org** возвращает HTTP 500 ошибку. Маршрутизация исправлена (была проблема с endpoints), но приложение Next.js падает с ошибкой.

## Текущая конфигурация

### Kubernetes ресурсы

**Namespace:** `default`

**Deployment:**
- `dsp-prod-deployment-primary` - 3 пода в статусе Running
- Поды имеют лейблы: `app=dsp-prod-primary, environment=production`
- Образ: `ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest`
- Порт контейнера: `3000`

**Service:**
- `dsp-prod-deployment-primary` (ClusterIP)
- Селектор: `app=dsp-prod-primary`
- Endpoints: `10.42.0.205:3000, 10.42.1.41:3000, 10.42.2.85:3000` ✅
- Порт: 80 → 3000

**Ingress:**
- `dsp-prod-ingress` (Traefik)
- Класс: `istio` (аннотация `kubernetes.io/ingress.class: istio`)
- Хосты: `gyber.org`, `www.gyber.org`
- Backend: `dsp-prod-deployment-primary:80` ✅ (исправлено)
- TLS: `dsp-prod-tls` (cert-manager)

**Istio Gateway:**
- `dsp-prod-gateway`
- Селектор: `istio: ingressgateway`
- Порты: 80 (HTTP redirect), 443 (HTTPS)
- TLS сертификат: `dsp-prod-istio-tls` (в namespace default) ✅ (скопирован)

**Istio VirtualService:**
- `dsp-prod-virtualservice`
- Gateway: `dsp-prod-gateway`
- Хосты: `gyber.org`, `www.gyber.org`
- Destination: `dsp-prod-deployment-primary:80` ✅ (исправлено)

### Текущий статус

**Маршрутизация:** ✅ Работает
- Запросы доходят до подов
- Сервис имеет endpoints
- Ingress и VirtualService настроены правильно

**Приложение:** ❌ Падает с ошибкой
- HTTP статус: 500
- Ошибка в логах: `TypeError: Cannot read properties of undefined (reading 'ssr')`
- Next.js версия: 15.5.7
- Приложение запускается, но падает при обработке запросов

## Ошибка в логах

```
⨯ TypeError: Cannot read properties of undefined (reading 'ssr')
    at f (.next/server/chunks/3425.js:1545:5638)
```

Эта ошибка повторяется многократно в логах подов.

## Что было исправлено

1. ✅ VirtualService обновлен: `dsp-prod-service` → `dsp-prod-deployment-primary`
2. ✅ Ingress обновлен: `dsp-prod-service` → `dsp-prod-deployment-primary`
3. ✅ TLS сертификат скопирован из `istio-system` в `default`
4. ✅ Перезапущен istiod для применения конфигурации

## Что нужно исправить

### Основная проблема: Next.js ошибка SSR

Ошибка `Cannot read properties of undefined (reading 'ssr')` указывает на проблему в Next.js серверном рендеринге. Возможные причины:

1. **Отсутствуют переменные окружения** - приложение может требовать env переменные для работы
2. **Проблема с конфигурацией Next.js** - возможно неправильная настройка SSR
3. **Проблема с зависимостями** - возможно отсутствуют или неправильно установлены зависимости
4. **Проблема с базой данных/API** - приложение может пытаться подключиться к недоступным сервисам

### Задачи для решения

1. **Проверить переменные окружения:**
   ```bash
   kubectl get deployment dsp-prod-deployment-primary -n default -o yaml | grep -A 50 "env:"
   kubectl describe pod <pod-name> -n default | grep -A 20 "Environment:"
   ```

2. **Проверить логи приложения детально:**
   ```bash
   kubectl logs dsp-prod-deployment-primary-<pod-id> -n default --tail=200
   ```

3. **Проверить конфигурацию Next.js:**
   - Найти `next.config.js` или `next.config.mjs` в репозитории
   - Проверить настройки SSR
   - Проверить наличие необходимых env переменных

4. **Проверить доступность зависимостей:**
   - База данных
   - API endpoints
   - Внешние сервисы

5. **Проверить health checks:**
   ```bash
   kubectl exec -n default dsp-prod-deployment-primary-<pod-id> -- curl http://localhost:3000/api/health
   ```

## Команды для диагностики

```bash
# Проверить статус подов
kubectl get pods -n default | grep dsp-prod

# Проверить логи
kubectl logs dsp-prod-deployment-primary-7f9bbb8f87-78vzr -n default --tail=100

# Проверить переменные окружения
kubectl get deployment dsp-prod-deployment-primary -n default -o jsonpath='{.spec.template.spec.containers[0].env}'

# Проверить endpoints
kubectl get endpoints dsp-prod-deployment-primary -n default

# Проверить конфигурацию
kubectl get virtualservice dsp-prod-virtualservice -n default -o yaml
kubectl get ingress dsp-prod-ingress -n default -o yaml

# Тест доступности
curl -I https://gyber.org
curl -v https://gyber.org 2>&1 | head -30
```

## Дополнительная информация

### Структура проекта
- Проект находится в: `/Users/Gyber/GYBERNATY-ECOSYSTEM/DSP`
- Это Next.js приложение (версия 15.5.7)
- Используется Kubernetes с Istio для маршрутизации

### Связанные проблемы в кластере

Есть другие проблемные поды, но они не связаны с gyber.org:
- `auradomus-deployment-6c4d9b7db9-*` - CrashLoopBackOff
- `canton-node/canton-participant-*` - CrashLoopBackOff
- `supabase-stage/*` - несколько подов в CrashLoopBackOff

## Цель

Исправить ошибку Next.js и запустить сайт gyber.org так, чтобы он возвращал HTTP 200 вместо 500.

## Важные замечания

1. **Не ломать рабочую маршрутизацию** - Ingress и VirtualService настроены правильно
2. **Проверить реальные файлы проекта** перед изменениями
3. **Использовать best practices** - не временные решения
4. **Анализировать каждое предупреждение** с точки зрения архитектуры

## Следующие шаги

1. Прочитать конфигурацию deployment и проверить env переменные
2. Изучить логи приложения детально
3. Найти и прочитать `next.config.js` в репозитории
4. Проверить зависимости и подключения к внешним сервисам
5. Исправить проблему с SSR в Next.js
6. Протестировать сайт после исправления

