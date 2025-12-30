# ✅ GitLab Token сохранен

## Токен успешно сохранен в системе

**Токен**: `glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH.01.0w1hvf5ve`

## Где сохранен

1. ✅ **Переменная окружения**: `GITLAB_TOKEN` (текущая сессия)
2. ✅ **~/.zshrc**: Постоянно для всех новых сессий zsh
3. ✅ **k8s/gitlab/gitlab-token.env**: Файл проекта (в .gitignore)

## Использование

### В текущей сессии:
```bash
echo $GITLAB_TOKEN
```

### В новой сессии:
```bash
source ~/.zshrc
# или
export GITLAB_TOKEN="glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH.01.0w1hvf5ve"
```

### Проверка токена:
```bash
curl -H "PRIVATE-TOKEN: $GITLAB_TOKEN" https://gyber.org/lab/api/v4/user
```

### В скриптах:
```bash
#!/bin/bash
source ~/.zshrc  # или экспортируйте напрямую
curl -H "PRIVATE-TOKEN: $GITLAB_TOKEN" https://gyber.org/lab/api/v4/projects
```

## Безопасность

⚠️ **ВАЖНО**:
- ✅ Файл `gitlab-token.env` добавлен в `.gitignore`
- ❌ НЕ коммитьте токен в репозиторий
- ✅ Токен доступен только в вашей системе

## Статус

✅ Токен проверен и работает
✅ Пользователь: root
✅ Доступ: полный (api, read_user, write_repository и др.)



