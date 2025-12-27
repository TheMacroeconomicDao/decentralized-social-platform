# 🔐 Данные для входа в Community Lab

## Входные данные

**URL**: https://gyber.org/lab

**Логин**: `root`

**Пароль**: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`

## Получение Personal Access Token

### Способ 1: Через веб-интерфейс

1. Войдите в GitLab: https://gyber.org/lab
2. Перейдите: **User Settings** (правый верхний угол) → **Access Tokens**
3. Создайте новый токен:
   - **Token name**: `gitlab-ci-token` (или любое другое имя)
   - **Expiration date**: Установите срок действия (или оставьте пустым)
   - **Select scopes**: Выберите:
     - ✅ `api` - Полный доступ к API
     - ✅ `read_user` - Чтение информации о пользователе
     - ✅ `write_repository` - Запись в репозитории
     - ✅ `read_registry` - Чтение из registry (если используется)
4. Нажмите **Create personal access token**
5. **ВАЖНО**: Скопируйте токен сразу! Он показывается только один раз.

### Способ 2: Через Rails console (автоматически)

```bash
# Получить токен через скрипт
./k8s/gitlab/create-access-token.sh

# Или вручную через kubectl
kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- gitlab-rails runner "
user = User.find_by_username('root')
token = user.personal_access_tokens.create!(
  name: 'gitlab-ci-token',
  scopes: ['api', 'read_user', 'write_repository'],
  expires_at: 1.year.from_now
)
puts token.token
"
```

## Использование токена

### В GitLab CI/CD

```yaml
variables:
  GITLAB_TOKEN: $CI_JOB_TOKEN  # Автоматический токен для CI/CD
  # Или используйте переменную окружения:
  # GITLAB_TOKEN: $GITLAB_PERSONAL_ACCESS_TOKEN
```

### В скриптах

```bash
export GITLAB_TOKEN="ваш-токен-здесь"
curl -H "PRIVATE-TOKEN: $GITLAB_TOKEN" https://gyber.org/lab/api/v4/user
```

## Инструкции

📖 **Полная инструкция**: `k8s/gitlab/COMMUNITY_LAB_SETUP.md`
📖 **Настройка CI/CD**: `k8s/gitlab/setup-k8s-integration.sh`
📖 **Создание токена**: `k8s/gitlab/create-access-token.sh`

## Безопасность

⚠️ **ВАЖНО**: 
- Храните токен в секретах (GitLab CI/CD Variables)
- Не коммитьте токен в репозиторий
- Используйте минимально необходимые права (scopes)
- Устанавливайте срок действия токена

