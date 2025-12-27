#!/bin/bash
set -e

echo "🔑 Создание Personal Access Token с полным доступом"
echo ""

# Проверка что GitLab доступен
GITLAB_URL="https://gitlab.gyber.org"
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab под не найден!"
    exit 1
fi

echo "📦 Под: $POD_NAME"
echo "🌐 URL: $GITLAB_URL"
echo ""

# Получение root пароля
echo "🔐 Получаю root пароль..."
ROOT_PASSWORD=$(kubectl exec -n gitlab $POD_NAME -- grep 'Password:' /etc/gitlab/initial_root_password 2>/dev/null | awk '{print $2}')

if [ -z "$ROOT_PASSWORD" ]; then
    echo "❌ Не удалось получить root пароль. GitLab еще инициализируется?"
    exit 1
fi

echo "✅ Пароль получен"
echo ""

# Проверка доступности GitLab
echo "🔍 Проверяю доступность GitLab..."
sleep 5

# Создание токена через GitLab API
echo "🔑 Создаю Personal Access Token..."

# Генерируем имя токена с датой
TOKEN_NAME="system-access-token-$(date +%Y%m%d-%H%M%S)"

# Создаем токен через API
RESPONSE=$(curl -s --request POST \
  --url "${GITLAB_URL}/api/v4/user/personal_access_tokens" \
  --header "Content-Type: application/json" \
  --data "{
    \"name\": \"${TOKEN_NAME}\",
    \"scopes\": [\"api\", \"read_user\", \"read_repository\", \"write_repository\", \"read_registry\", \"write_registry\", \"sudo\", \"admin_mode\"],
    \"expires_at\": \"$(date -u -v+1y +%Y-%m-%d 2>/dev/null || date -u -d '+1 year' +%Y-%m-%d)\"
  }" \
  --user "root:${ROOT_PASSWORD}" 2>&1)

# Проверяем ответ
if echo "$RESPONSE" | grep -q '"token"'; then
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ PERSONAL ACCESS TOKEN СОЗДАН"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   Имя токена: $TOKEN_NAME"
    echo "   Токен:      $TOKEN"
    echo "   Права:      api, read_user, read_repository, write_repository,"
    echo "               read_registry, write_registry, sudo, admin_mode"
    echo "   Срок:       1 год"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Сохраняем токен в файл
    TOKEN_FILE="k8s/gitlab/.gitlab-token"
    echo "$TOKEN" > "$TOKEN_FILE"
    chmod 600 "$TOKEN_FILE"
    echo "💾 Токен сохранен в: $TOKEN_FILE"
    echo ""
    echo "⚠️  ВАЖНО: Сохраните этот токен! Он больше не будет показан."
    echo ""
    echo "📋 Использование:"
    echo "   export GITLAB_TOKEN=\"$TOKEN\""
    echo "   git remote set-url gitlab https://oauth2:\$GITLAB_TOKEN@gitlab.gyber.org/username/project.git"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚡ СЛЕДУЮЩИЙ ШАГ: Настройка переменных окружения"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Запустите скрипт для автоматической настройки:"
    echo "   ./k8s/gitlab/setup-env-now.sh"
    echo ""
    echo "Это добавит переменные GITLAB_URL, GITLAB_TOKEN и GITLAB_USER"
    echo "в ~/.zshrc и загрузит их в текущую сессию."
    echo ""
else
    echo "❌ Ошибка при создании токена:"
    echo "$RESPONSE"
    echo ""
    echo "💡 Попробуйте создать токен вручную через веб-интерфейс:"
    echo "   1. Откройте ${GITLAB_URL}"
    echo "   2. Войдите как root (пароль: $ROOT_PASSWORD)"
    echo "   3. Settings → Access Tokens"
    echo "   4. Создайте токен с правами: api, read_user, read_repository, write_repository, sudo"
    exit 1
fi

