#!/bin/bash

# Загрузка логотипа и favicon в GitLab через API
# Файлы будут доступны для выбора в веб-интерфейсе

set -e

echo "📤 Загрузка логотипа и favicon в GitLab..."
echo ""

# Получаем имя пода
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab pod не найден"
    exit 1
fi

# Получаем токен
ROOT_TOKEN=""
if [ -n "$GITLAB_TOKEN" ]; then
    ROOT_TOKEN="$GITLAB_TOKEN"
elif [ -f "k8s/gitlab/gitlab-token.env" ]; then
    source k8s/gitlab/gitlab-token.env
    ROOT_TOKEN="$GITLAB_TOKEN"
elif [ -f "k8s/gitlab/.gitlab-token" ]; then
    ROOT_TOKEN=$(cat k8s/gitlab/.gitlab-token | tr -d '\n\r ')
fi

if [ -z "$ROOT_TOKEN" ]; then
    echo "❌ Токен не найден"
    exit 1
fi

GITLAB_URL="https://gyber.org/lab"
API_URL="${GITLAB_URL}/api/v4"

# Копируем файлы в публичную директорию GitLab для доступа через веб
echo "📦 Копирование файлов в публичную директорию GitLab..."

# Создаем директорию для загрузок
kubectl exec -n gitlab $POD_NAME -- mkdir -p /var/opt/gitlab/gitlab-rails/public/uploads/appearance

# Копируем логотип
kubectl cp k8s/gitlab/custom/assets/lab-logo.svg gitlab/$POD_NAME:/var/opt/gitlab/gitlab-rails/public/uploads/appearance/logo.svg

# Копируем favicon
kubectl cp k8s/gitlab/custom/assets/lab-favicon.svg gitlab/$POD_NAME:/var/opt/gitlab/gitlab-rails/public/uploads/appearance/favicon.svg

echo "✅ Файлы скопированы в публичную директорию"
echo ""

# Пытаемся загрузить через API (если поддерживается)
echo "🔄 Попытка загрузки через API..."

# Загружаем логотип
LOGO_RESPONSE=$(curl -s --request PUT "${API_URL}/application/appearance" \
  --header "PRIVATE-TOKEN: ${ROOT_TOKEN}" \
  --form "logo=@k8s/gitlab/custom/assets/lab-logo.svg" 2>&1) || true

# Загружаем favicon
FAVICON_RESPONSE=$(curl -s --request PUT "${API_URL}/application/appearance" \
  --header "PRIVATE-TOKEN: ${ROOT_TOKEN}" \
  --form "favicon=@k8s/gitlab/custom/assets/lab-favicon.svg" 2>&1) || true

echo ""
echo "✅ Файлы подготовлены для загрузки"
echo ""
echo "📋 Теперь в веб-интерфейсе:"
echo "   1. Откройте: Admin Area → Appearance"
echo "   2. В разделе 'Logo' выберите файл из:"
echo "      /var/opt/gitlab/gitlab-rails/public/uploads/appearance/logo.svg"
echo "   3. В разделе 'Favicon' выберите файл из:"
echo "      /var/opt/gitlab/gitlab-rails/public/uploads/appearance/favicon.svg"
echo ""
echo "💡 Или используйте прямые пути:"
echo "   Logo: /uploads/appearance/logo.svg"
echo "   Favicon: /uploads/appearance/favicon.svg"
echo ""

