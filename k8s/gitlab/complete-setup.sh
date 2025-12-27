#!/bin/bash
set -e

echo "🚀 Полная настройка GitLab репозитория и Kubernetes интеграции"
echo ""

# Получаем root пароль
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')
ROOT_PASS=$(kubectl exec -n gitlab $POD_NAME -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password 2>/dev/null | awk "{print \$2}"')

if [ -z "$ROOT_PASS" ]; then
    echo "❌ Не удалось получить root пароль"
    exit 1
fi

GITLAB_URL="https://gitlab.gyber.org"
PROJECT_NAME="decentralized-social-platform"
PROJECT_PATH="root/${PROJECT_NAME}"

echo "🌐 GitLab URL: $GITLAB_URL"
echo "📦 Проект: $PROJECT_NAME"
echo ""

# Создаем проект через API
echo "📦 Создаю проект в GitLab..."
CREATE_RESPONSE=$(curl -k -s -X POST \
  -u "root:${ROOT_PASS}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"${PROJECT_NAME}\",
    \"path\": \"${PROJECT_NAME}\",
    \"visibility\": \"private\",
    \"initialize_with_readme\": false
  }" \
  "${GITLAB_URL}/api/v4/projects")

if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    echo "✅ Проект создан"
    PROJECT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo "   ID проекта: $PROJECT_ID"
else
    if echo "$CREATE_RESPONSE" | grep -q "has already been taken"; then
        echo "✅ Проект уже существует"
        # Получаем ID существующего проекта
        PROJECT_INFO=$(curl -k -s -u "root:${ROOT_PASS}" "${GITLAB_URL}/api/v4/projects/${PROJECT_PATH}")
        PROJECT_ID=$(echo "$PROJECT_INFO" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    else
        echo "❌ Ошибка при создании проекта:"
        echo "$CREATE_RESPONSE"
        exit 1
    fi
fi

# Создаем Personal Access Token через API
echo ""
echo "🔑 Создаю Personal Access Token..."
TOKEN_RESPONSE=$(curl -k -s -X POST \
  -u "root:${ROOT_PASS}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"system-full-access-$(date +%Y%m%d-%H%M%S)\",
    \"scopes\": [\"api\", \"read_user\", \"read_repository\", \"write_repository\", \"read_registry\", \"write_registry\", \"sudo\", \"admin_mode\"],
    \"expires_at\": \"$(date -u -v+1y +%Y-%m-%d 2>/dev/null || date -u -d '+1 year' +%Y-%m-%d)\"
  }" \
  "${GITLAB_URL}/api/v4/user/personal_access_tokens")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "⚠️  Не удалось создать токен через API"
    echo "   Ответ: $TOKEN_RESPONSE"
    echo ""
    echo "💡 Создайте токен вручную:"
    echo "   1. Откройте ${GITLAB_URL}"
    echo "   2. Войдите как root (пароль: ${ROOT_PASS})"
    echo "   3. Settings → Access Tokens"
    echo "   4. Создайте токен с правами: api, read_user, read_repository, write_repository, sudo"
    echo ""
    read -p "Введите токен вручную (или нажмите Enter для пропуска): " TOKEN
fi

if [ -n "$TOKEN" ]; then
    echo "$TOKEN" > k8s/gitlab/.gitlab-token
    chmod 600 k8s/gitlab/.gitlab-token
    echo "✅ Токен сохранен в k8s/gitlab/.gitlab-token"
fi

# Настраиваем git remote
echo ""
echo "📋 Настраиваю git remote..."
git remote remove gitlab 2>/dev/null || true

if [ -n "$TOKEN" ]; then
    GITLAB_REMOTE_URL="https://oauth2:${TOKEN}@gitlab.gyber.org/${PROJECT_PATH}.git"
else
    GITLAB_REMOTE_URL="https://root:${ROOT_PASS}@gitlab.gyber.org/${PROJECT_PATH}.git"
fi

git remote add gitlab "$GITLAB_REMOTE_URL"
echo "✅ Remote 'gitlab' добавлен"
echo ""

# Создаем .gitlab-ci.yml если его нет
if [ ! -f ".gitlab-ci.yml" ]; then
    echo "📝 Создаю .gitlab-ci.yml..."
    ./k8s/gitlab/setup-k8s-integration.sh
fi

# Настраиваем Kubernetes секреты
echo ""
echo "☸️  Настраиваю Kubernetes секреты..."
kubectl create namespace gitlab-runner --dry-run=client -o yaml | kubectl apply -f - 2>/dev/null || true

if [ -n "$TOKEN" ]; then
    kubectl create secret generic gitlab-token \
      --from-literal=token="$TOKEN" \
      --from-literal=url="$GITLAB_URL" \
      --namespace=default \
      --dry-run=client -o yaml | kubectl apply -f -

    kubectl create secret generic gitlab-token \
      --from-literal=token="$TOKEN" \
      --from-literal=url="$GITLAB_URL" \
      --namespace=gitlab-runner \
      --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Kubernetes secrets созданы"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ НАСТРОЙКА ЗАВЕРШЕНА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Следующие шаги:"
echo ""
echo "1. Настройте CI/CD переменные в GitLab:"
echo "   ${GITLAB_URL}/${PROJECT_PATH}/-/settings/ci_cd"
echo ""
echo "2. См. инструкцию: k8s/gitlab/SECRETS_SETUP.md"
echo ""
echo "3. Запушьте код:"
echo "   git push gitlab main"
echo ""
echo "4. GitLab CI/CD автоматически соберет и задеплоит"
echo ""

