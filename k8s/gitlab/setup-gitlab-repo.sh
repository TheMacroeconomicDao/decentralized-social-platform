#!/bin/bash
set -e

echo "🚀 Настройка репозитория в GitLab и интеграция с Kubernetes"
echo ""

# Загрузка токена
if [ -f "k8s/gitlab/.gitlab-token" ]; then
    GITLAB_TOKEN=$(cat k8s/gitlab/.gitlab-token)
    echo "✅ Токен загружен из файла"
elif [ -n "$GITLAB_TOKEN" ]; then
    echo "✅ Токен загружен из переменной окружения"
else
    echo "❌ Токен не найден! Создайте его сначала:"
    echo "   ./k8s/gitlab/wait-and-create-token.sh"
    exit 1
fi

GITLAB_URL="https://gitlab.gyber.org"
PROJECT_NAME="decentralized-social-platform"
PROJECT_PATH="root/${PROJECT_NAME}"

echo "🌐 GitLab URL: $GITLAB_URL"
echo "📦 Имя проекта: $PROJECT_NAME"
echo ""

# Проверка существования проекта
echo "🔍 Проверяю существование проекта..."
PROJECT_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "${GITLAB_URL}/api/v4/projects/${PROJECT_PATH}")

if [ "$PROJECT_EXISTS" = "200" ]; then
    echo "✅ Проект уже существует"
else
    echo "📦 Создаю новый проект..."
    CREATE_RESPONSE=$(curl -s -X POST \
      -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
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
    else
        echo "❌ Ошибка при создании проекта:"
        echo "$CREATE_RESPONSE"
        exit 1
    fi
fi

# Получаем URL проекта
PROJECT_URL="${GITLAB_URL}/${PROJECT_PATH}.git"
GITLAB_REMOTE_URL="https://oauth2:${GITLAB_TOKEN}@gitlab.gyber.org/${PROJECT_PATH}.git"

echo ""
echo "📋 Настройка git remote..."

# Удаляем старый gitlab remote если есть
git remote remove gitlab 2>/dev/null || true

# Добавляем новый remote
git remote add gitlab "$GITLAB_REMOTE_URL"
echo "✅ Remote 'gitlab' добавлен"

# Показываем все remotes
echo ""
echo "📋 Текущие remotes:"
git remote -v
echo ""

# Запрос на push
echo "🚀 Готово к push!"
echo ""
echo "Для пуша выполните:"
echo "   git push gitlab main"
echo ""
echo "Или для всех веток:"
echo "   git push gitlab --all"
echo ""

