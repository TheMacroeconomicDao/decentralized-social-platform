# ⚡ Быстрая настройка GitLab токена в переменных окружения

## ⚠️ ВАЖНО: Проверка доступности GitLab

Перед созданием токена убедитесь, что GitLab доступен:

```bash
# Полная диагностика
./k8s/gitlab/check-gitlab-domain.sh
```

**Если домен недоступен:**
- GitLab работает, но DNS не настроен
- Настройте DNS запись: `gitlab.gyber.org -> 65.108.15.30`
- Или используйте временное решение: `./k8s/gitlab/fix-dns-temporary.sh`
- Подробнее: `k8s/gitlab/DNS_SETUP.md`

## Вариант 1: Автоматическое создание токена (рекомендуется)

```bash
./k8s/gitlab/create-access-token.sh
```

Скрипт автоматически:
- Получит root пароль из GitLab
- Создаст токен через API
- Сохранит токен в `k8s/gitlab/.gitlab-token`
- Предложит настроить переменные окружения

После создания токена запустите:
```bash
./k8s/gitlab/setup-env-now.sh
```

## Вариант 2: Ручное создание токена

### Шаг 1: Создайте токен в GitLab

1. **Откройте**: https://gitlab.gyber.org
2. **Войдите**:
   - Логин: `root`
   - Пароль: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`
3. **Создайте токен**:
   - Нажмите на аватар (правый верхний угол) → **Settings**
   - В левом меню: **Access Tokens**
   - Или: https://gitlab.gyber.org/-/user_settings/personal_access_tokens
4. **Настройте**:
   - **Token name**: `system-full-access`
   - **Expiration date**: через 1 год
   - **Select scopes**: выберите все:
     - ✅ `api`
     - ✅ `read_user`
     - ✅ `read_repository`
     - ✅ `write_repository`
     - ✅ `read_registry`
     - ✅ `write_registry`
     - ✅ `sudo`
     - ✅ `admin_mode`
5. **Создайте**: нажмите **Create personal access token**
6. **СОХРАНИТЕ ТОКЕН!** (показывается только один раз)

### Шаг 2: Сохраните токен в файл

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
echo "ваш-токен-здесь" > k8s/gitlab/.gitlab-token
chmod 600 k8s/gitlab/.gitlab-token
```

### Шаг 3: Добавьте в переменные окружения

```bash
./k8s/gitlab/setup-env-now.sh
```

Или вручную:

```bash
# Загрузить переменные в текущую сессию
source k8s/gitlab/.env

# Или добавить в ~/.zshrc
echo 'source /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP/k8s/gitlab/.env' >> ~/.zshrc
source ~/.zshrc
```

## Альтернатива: Ручная настройка через шаблон

Если хотите настроить вручную, используйте шаблон:

```bash
cp k8s/gitlab/.env.template k8s/gitlab/.env
# Отредактируйте k8s/gitlab/.env и вставьте ваш токен
source k8s/gitlab/.env
```

## Проверка

```bash
echo $GITLAB_URL
echo $GITLAB_TOKEN
echo $GITLAB_USER
```

## Использование

После настройки переменные доступны во всех новых терминалах:

```bash
# Использование в git
git remote add gitlab https://oauth2:${GITLAB_TOKEN}@gitlab.gyber.org/root/project.git

# Использование в curl/API
curl -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" ${GITLAB_URL}/api/v4/projects

# Использование в скриптах
export GITLAB_URL
export GITLAB_TOKEN
```

