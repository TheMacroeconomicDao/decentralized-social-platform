# ✅ GitLab настроен на gyber.org/GitLab

## Выполненные изменения

### 1. Изменен external_url
- **Было**: `https://gitlab.gyber.org`
- **Стало**: `https://gyber.org/GitLab`

### 2. Настроен relative_url_root
- Добавлено: `gitlab_rails['relative_url_root'] = '/GitLab'`
- Это позволяет GitLab работать с подпутем `/GitLab`

### 3. Обновлен Ingress
- **Host**: `gyber.org` (вместо `gitlab.gyber.org`)
- **Path**: `/GitLab`
- **TLS**: Использует существующий сертификат для `gyber.org`

### 4. SSL сертификат
- ✅ Certificate готов (READY: True)
- Использует существующий сертификат для `gyber.org`

## Доступ к GitLab

**URL**: https://gyber.org/GitLab

**Root пароль**: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`

## Проверка доступности

```bash
# Проверка через curl
curl -I https://gyber.org/GitLab

# Должен вернуть HTTP 200 или 302
```

## Текущая конфигурация

### Deployment
- **Image**: `gitlab/gitlab-ce:latest`
- **Resources**: requests: 3Gi, limits: 6Gi
- **External URL**: `https://gyber.org/GitLab`
- **Relative URL Root**: `/GitLab`

### Ingress
- **Host**: `gyber.org`
- **Path**: `/GitLab`
- **Class**: `traefik`
- **TLS**: `gitlab-tls` (использует сертификат для gyber.org)

### Service
- **Type**: ClusterIP
- **Ports**: 80, 443, 22

## Преимущества этого подхода

✅ **Не требуется настройка DNS** - используем существующий домен `gyber.org`  
✅ **SSL сертификат уже есть** - используем существующий сертификат  
✅ **Простота настройки** - не нужно создавать поддомен  

## Примечания

- GitLab будет доступен по пути `/GitLab` на основном домене
- Все ссылки в GitLab будут автоматически использовать префикс `/GitLab`
- SSH доступ будет работать через `git@gyber.org` (порт 22)

## Следующие шаги

1. Откройте https://gyber.org/GitLab в браузере
2. Войдите с root паролем
3. Создайте Personal Access Token для интеграции
4. Настройте проекты и репозитории

