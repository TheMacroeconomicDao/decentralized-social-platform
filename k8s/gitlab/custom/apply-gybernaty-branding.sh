#!/bin/bash

# Скрипт для применения брендинга Community Lab by Gybernaty
# Применяет кастомные стили, логотип и настройки через GitLab API

set -e

echo "🎨 Применение брендинга Community Lab by Gybernaty..."
echo ""

# Получаем имя пода
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab pod не найден"
    exit 1
fi

echo "📦 Pod: $POD_NAME"
echo ""

# Получаем токен из переменной окружения или файла
echo "🔐 Получение токена..."

ROOT_TOKEN=""

# Проверяем переменную окружения
if [ -n "$GITLAB_TOKEN" ]; then
    ROOT_TOKEN="$GITLAB_TOKEN"
    echo "✅ Токен найден в переменной окружения GITLAB_TOKEN"
# Проверяем файл gitlab-token.env
elif [ -f "k8s/gitlab/gitlab-token.env" ]; then
    source k8s/gitlab/gitlab-token.env
    if [ -n "$GITLAB_TOKEN" ]; then
        ROOT_TOKEN="$GITLAB_TOKEN"
        echo "✅ Токен загружен из k8s/gitlab/gitlab-token.env"
    fi
# Проверяем файл .gitlab-token
elif [ -f "k8s/gitlab/.gitlab-token" ]; then
    ROOT_TOKEN=$(cat k8s/gitlab/.gitlab-token | tr -d '\n\r ')
    if [ -n "$ROOT_TOKEN" ]; then
        echo "✅ Токен загружен из k8s/gitlab/.gitlab-token"
    fi
fi

# Если токен не найден, пытаемся создать через Rails console
if [ -z "$ROOT_TOKEN" ]; then
    echo "⚠️  Токен не найден, пытаемся создать через Rails console..."
    ROOT_TOKEN=$(kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner <<EOF
user = User.find_by_username('root')
if user.personal_access_tokens.active.where(name: 'gybernaty-setup').exists?
  token = user.personal_access_tokens.active.where(name: 'gybernaty-setup').first
  puts token.token
else
  token = user.personal_access_tokens.create!(
    name: 'gybernaty-setup',
    scopes: ['api', 'read_user', 'write_repository', 'admin_mode'],
    expires_at: 1.year.from_now
  )
  puts token.token
end
EOF
)
fi

if [ -z "$ROOT_TOKEN" ]; then
    echo "❌ Не удалось получить токен"
    echo "💡 Установите токен: export GITLAB_TOKEN=\"ваш-токен\""
    echo "   Или сохраните в файл: echo 'токен' > k8s/gitlab/.gitlab-token"
    exit 1
fi

echo "✅ Токен готов к использованию"
echo ""

# GitLab URL
GITLAB_URL="https://gyber.org/lab"
API_URL="${GITLAB_URL}/api/v4"

echo "📝 Применение настроек через API..."

# Обновляем настройки приложения
curl -s --request PUT "${API_URL}/application/settings" \
  --header "PRIVATE-TOKEN: ${ROOT_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "after_sign_up_text": "Добро пожаловать в Community Lab by Gybernaty!",
    "help_page_text": "Community Lab by Gybernaty - ваша лаборатория для разработки и экспериментов.",
    "home_page_url": "https://gyber.org",
    "signup_enabled": true,
    "user_default_external": false
  }' > /dev/null

echo "✅ Настройки приложения обновлены"

# Загружаем кастомные файлы в pod
echo ""
echo "📤 Загрузка кастомных файлов в pod..."

# Загружаем CSS
kubectl exec -n gitlab $POD_NAME -- bash -c 'cat > /tmp/gybernaty-custom.css' < k8s/gitlab/custom/gitlab-custom.css

# Загружаем JavaScript
kubectl exec -n gitlab $POD_NAME -- bash -c 'cat > /tmp/gybernaty-text-replace.js' < k8s/gitlab/custom/gitlab-text-replace.js

# Копируем JavaScript в публичную директорию для доступа через веб
kubectl exec -n gitlab $POD_NAME -- mkdir -p /var/opt/gitlab/nginx/www/assets/lab
kubectl cp k8s/gitlab/custom/gitlab-text-replace.js gitlab/$POD_NAME:/var/opt/gitlab/nginx/www/assets/lab/text-replace.js

echo "✅ Файлы загружены"
echo ""

# Информация о загруженных файлах
echo "🎨 Информация о кастомных файлах:"
CSS_SIZE=$(wc -c < k8s/gitlab/custom/gitlab-custom.css | tr -d ' ')
JS_SIZE=$(wc -c < k8s/gitlab/custom/gitlab-text-replace.js | tr -d ' ')
echo "   ✅ CSS: ${CSS_SIZE} символов"
echo "   ✅ JavaScript: ${JS_SIZE} символов"
echo ""
echo "💡 Примените эти файлы через Admin Area → Appearance (см. инструкции ниже)"

echo ""
echo "✅ Брендинг применен!"
echo ""
echo "📋 Финальные шаги (через веб-интерфейс):"
echo ""
echo "1. Откройте: https://gyber.org/lab"
echo "2. Войдите как root (пароль: 73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=)"
echo "3. Перейдите: Admin Area → Appearance"
echo "4. Подготовьте файлы локально:"
echo "   ./k8s/gitlab/custom/download-assets-local.sh"
echo ""
echo "5. В разделе 'Logo' нажмите 'Choose file' и выберите:"
echo "   k8s/gitlab/custom/assets-for-upload/logo.svg"
echo ""
echo "6. В разделе 'Favicon' нажмите 'Choose file' и выберите:"
echo "   k8s/gitlab/custom/assets-for-upload/favicon.svg"
echo ""
echo "7. В разделе 'Custom HTML head' вставьте:"
echo "   <script src=\"https://gyber.org/lab/assets/lab/text-replace.js\"></script>"
echo ""
echo "8. В разделе 'Custom CSS' вставьте содержимое из: k8s/gitlab/custom/gitlab-custom.css"
echo ""
echo "9. В разделе 'Title' установите: 'Community Lab by Gybernaty'"
echo ""
echo "10. Сохраните все изменения"
echo ""
echo "💡 JavaScript автоматически заменит все упоминания 'GitLab' на 'Community Lab by Gybernaty'"
echo ""

