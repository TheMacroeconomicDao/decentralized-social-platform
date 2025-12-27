# 🚀 Быстрый старт с GitLab

## ✅ Что уже сделано

1. ✅ GitLab развернут в Kubernetes кластере
2. ✅ Создан namespace `gitlab`
3. ✅ Настроен Ingress для доступа через https://gitlab.gyber.org
4. ✅ Создан PVC для данных (50 Gi)

## ⏳ Текущий статус

GitLab под создается и загружается. Это может занять **5-10 минут**.

Проверить статус:
```bash
kubectl get pods -n gitlab
```

Когда под будет в статусе `Running`, можно продолжить.

## 📋 Следующие шаги

### 1. Получить root пароль

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
./k8s/gitlab/get-root-password.sh
```

Или вручную:
```bash
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n gitlab $POD_NAME -- grep 'Password:' /etc/gitlab/initial_root_password
```

### 2. Войти в GitLab

1. Откройте https://gitlab.gyber.org
2. Войдите с:
   - **Логин**: `root`
   - **Пароль**: (из шага 1)

### 3. Создать проект

1. В GitLab нажмите "New project" или "+" → "New project"
2. Выберите "Create blank project"
3. Укажите:
   - **Project name**: `decentralized-social-platform` (или другое)
   - **Visibility**: Private (или Public)
4. Нажмите "Create project"

### 4. Настроить remote и запушить код

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# Используйте скрипт для настройки
./k8s/gitlab/setup-project.sh

# Или вручную (замените URL на ваш):
git remote add gitlab https://gitlab.gyber.org/root/decentralized-social-platform.git

# Запушить код
git push gitlab main
```

## 🔧 Полезные команды

### Проверка статуса
```bash
# Статус подов
kubectl get pods -n gitlab

# Логи
kubectl logs -n gitlab -l app=gitlab --tail=50

# Ingress
kubectl get ingress -n gitlab
```

### Управление
```bash
# Перезапуск
kubectl rollout restart deployment/gitlab -n gitlab

# Масштабирование
kubectl scale deployment/gitlab --replicas=2 -n gitlab
```

## ⚠️ Важные замечания

1. **Первый запуск**: GitLab может занять 5-10 минут для полной инициализации
2. **Root пароль**: Сохраните пароль! Он нужен для первого входа
3. **Изменение пароля**: После входа измените root пароль в настройках
4. **SSH доступ**: Для SSH нужно настроить port-forward или использовать HTTPS

## 🆘 Решение проблем

### Под не запускается
```bash
# Проверить события
kubectl describe pod -n gitlab -l app=gitlab

# Проверить ресурсы
kubectl top nodes
```

### Не могу получить пароль
```bash
# Проверить что под готов
kubectl get pods -n gitlab

# Проверить логи
kubectl logs -n gitlab -l app=gitlab --tail=100
```

### Не могу зайти в GitLab
```bash
# Проверить ingress
kubectl get ingress -n gitlab

# Проверить сертификат
kubectl describe ingress gitlab-ingress -n gitlab
```

## 📚 Дополнительная информация

См. `k8s/gitlab/README.md` для полной документации.

