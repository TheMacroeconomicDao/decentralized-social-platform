# ⏳ Ожидание запуска GitLab

## Текущий статус

GitLab перезапускается после изменения конфигурации. Это может занять **5-10 минут**.

### Что происходит

1. ✅ Конфигурация применена (`gitlab-ctl reconfigure`)
2. ✅ Сервисы перезапущены (`gitlab-ctl restart`)
3. ⏳ GitLab Rails (puma) загружается
4. ⏳ База данных инициализируется

### Текущая ошибка

**502 Bad Gateway: "Waiting for GitLab to boot"**

Это нормально - nginx работает, но Rails приложение еще загружается.

## Проверка статуса

```bash
# Проверить статус puma
kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- gitlab-ctl status puma

# Проверить доступность
kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- curl -I http://localhost:80/GitLab

# Проверить логи
kubectl logs -n gitlab -l app=gitlab --tail=50 | grep -i "puma\|ready"
```

## Когда будет готово

GitLab будет готов, когда:
- ✅ HTTP код будет 200 или 302 (вместо 502)
- ✅ Puma покажет статус "run" в `gitlab-ctl status`
- ✅ В логах не будет ошибок загрузки

## После готовности

1. Откройте https://gyber.org/GitLab
2. Войдите с root паролем: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`
3. Настройте GitLab

## Примечание

Первая загрузка GitLab после изменения конфигурации может занять до 10 минут. Это нормально для GitLab Omnibus.

