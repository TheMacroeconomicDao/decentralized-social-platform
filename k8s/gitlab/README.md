# GitLab Self-Hosted Deployment

## Статус установки

GitLab развернут в Kubernetes кластере в namespace `gitlab`.

## Доступ

- **URL**: https://gitlab.gyber.org
- **Namespace**: `gitlab`

## Получение root пароля

После запуска пода (может занять 5-10 минут), выполните:

```bash
# Получить root пароль
kubectl exec -n gitlab -it $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- grep 'Password:' /etc/gitlab/initial_root_password

# Или через файл
kubectl exec -n gitlab -it $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- cat /etc/gitlab/initial_root_password
```

## Проверка статуса

```bash
# Проверить статус подов
kubectl get pods -n gitlab

# Проверить логи
kubectl logs -n gitlab -l app=gitlab --tail=50

# Проверить ingress
kubectl get ingress -n gitlab
```

## Клонирование проекта

После настройки GitLab:

1. Создайте новый проект в GitLab через веб-интерфейс
2. Добавьте remote:

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
git remote add gitlab https://gitlab.gyber.org/your-username/your-project.git
# Или через SSH:
git remote add gitlab git@gitlab.gyber.org:your-username/your-project.git
```

3. Запушьте код:

```bash
git push gitlab main
```

## Управление

```bash
# Перезапустить GitLab
kubectl rollout restart deployment/gitlab -n gitlab

# Масштабировать (если нужно)
kubectl scale deployment/gitlab --replicas=2 -n gitlab

# Удалить (если нужно)
kubectl delete -f k8s/gitlab/gitlab-deployment.yaml
```

## Ресурсы

- **CPU**: 1-2 cores
- **Memory**: 2-4 Gi
- **Storage**: 50 Gi (PVC)

## Примечания

- Первый запуск может занять 5-10 минут
- Root пароль хранится в `/etc/gitlab/initial_root_password` внутри пода
- Рекомендуется изменить root пароль после первого входа
- Для SSH доступа нужно настроить port forwarding или использовать ingress

