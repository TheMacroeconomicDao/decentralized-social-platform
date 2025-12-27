# 🔧 Ручная настройка GitLab и Kubernetes интеграции

## Текущий статус

- ✅ GitLab развернут: https://gitlab.gyber.org
- ✅ Root пароль получен
- ⏳ Требуется ручная настройка проекта и токена

## Шаг 1: Вход в GitLab и создание токена

1. Откройте https://gitlab.gyber.org
2. Войдите:
   - **Логин**: `root`
   - **Пароль**: (получите командой ниже)

```bash
kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password | awk "{print \$2}"'
```

3. Создайте Personal Access Token:
   - Settings → Access Tokens
   - Имя: `system-full-access`
   - Scopes: выберите все (`api`, `read_user`, `read_repository`, `write_repository`, `read_registry`, `write_registry`, `sudo`, `admin_mode`)
   - Expiration date: через 1 год
   - Нажмите "Create personal access token"
   - **СОХРАНИТЕ ТОКЕН!** Он показывается только один раз

4. Сохраните токен в файл:
```bash
echo "ваш-токен" > k8s/gitlab/.gitlab-token
chmod 600 k8s/gitlab/.gitlab-token
```

## Шаг 2: Создание проекта

1. В GitLab нажмите "New project" или "+" → "New project"
2. Выберите "Create blank project"
3. Укажите:
   - **Project name**: `decentralized-social-platform`
   - **Project slug**: `decentralized-social-platform`
   - **Visibility**: Private
4. Нажмите "Create project"

## Шаг 3: Настройка git remote

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# Загрузите токен
export GITLAB_TOKEN=$(cat k8s/gitlab/.gitlab-token)

# Удалите старый remote если есть
git remote remove gitlab 2>/dev/null || true

# Добавьте новый remote
git remote add gitlab https://oauth2:${GITLAB_TOKEN}@gitlab.gyber.org/root/decentralized-social-platform.git

# Проверьте
git remote -v
```

## Шаг 4: Push кода в GitLab

```bash
# Push main ветки
git push gitlab main

# Push всех веток
git push gitlab --all

# Push тегов
git push gitlab --tags
```

## Шаг 5: Настройка CI/CD переменных

1. Откройте: https://gitlab.gyber.org/root/decentralized-social-platform/-/settings/ci_cd
2. Раскройте "Variables"
3. Добавьте следующие переменные:

### Обязательные:

- **GHCR_USERNAME**
  - Value: `TheMacroeconomicDao`
  - Type: Variable
  - Protected: ✅
  - Masked: ❌

- **GHCR_TOKEN**
  - Value: (ваш GitHub Personal Access Token)
  - Type: Variable
  - Protected: ✅
  - Masked: ✅

- **KUBE_CONFIG**
  - Value: (base64 encoded kubeconfig)
  - Получить: `cat ~/.kube/config | base64 | tr -d '\n'`
  - Type: Variable
  - Protected: ✅
  - Masked: ✅

- **KUBE_CONTEXT**
  - Value: `default` (или ваш контекст)
  - Type: Variable
  - Protected: ✅
  - Masked: ❌

### Опциональные:

- **OPENAI_API_KEY** (если используется)
  - Value: (ваш OpenAI API ключ)
  - Type: Variable
  - Protected: ✅
  - Masked: ✅

## Шаг 6: Настройка Kubernetes секретов

```bash
# Создать namespace для GitLab Runner
kubectl create namespace gitlab-runner

# Создать secret с GitLab токеном
export GITLAB_TOKEN=$(cat k8s/gitlab/.gitlab-token)
kubectl create secret generic gitlab-token \
  --from-literal=token="$GITLAB_TOKEN" \
  --from-literal=url="https://gitlab.gyber.org" \
  --namespace=default

kubectl create secret generic gitlab-token \
  --from-literal=token="$GITLAB_TOKEN" \
  --from-literal=url="https://gitlab.gyber.org" \
  --namespace=gitlab-runner
```

## Шаг 7: Проверка .gitlab-ci.yml

Убедитесь что файл `.gitlab-ci.yml` существует и настроен правильно:

```bash
cat .gitlab-ci.yml
```

Если файла нет, создайте его:
```bash
./k8s/gitlab/setup-k8s-integration.sh
```

## Шаг 8: Тестирование CI/CD

После push кода в GitLab:

1. Откройте: https://gitlab.gyber.org/root/decentralized-social-platform/-/pipelines
2. Должен запуститься pipeline
3. Проверьте логи выполнения

## Использование секретов в Kubernetes

Секреты из GitLab CI/CD Variables доступны в пайплайнах через переменные окружения.

Для создания Kubernetes secrets из GitLab переменных в CI/CD:

```yaml
# В .gitlab-ci.yml
deploy:
  script:
    - |
      kubectl create secret generic ghcr-secret \
        --from-literal=username=$GHCR_USERNAME \
        --from-literal=password=$GHCR_TOKEN \
        --namespace=default \
        --dry-run=client -o yaml | kubectl apply -f -
```

## Полезные команды

```bash
# Получить root пароль
kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password | awk "{print \$2}"'

# Проверить статус GitLab
kubectl get pods -n gitlab

# Логи GitLab
kubectl logs -n gitlab -l app=gitlab --tail=50

# Проверить remote
git remote -v

# Проверить токен
cat k8s/gitlab/.gitlab-token
```

