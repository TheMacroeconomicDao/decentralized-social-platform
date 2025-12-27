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

# Root пароль
ROOT_PASSWORD="73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk="

echo "🔐 Получение root токена..."

# Получаем токен через Rails console
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

if [ -z "$ROOT_TOKEN" ]; then
    echo "❌ Не удалось получить токен"
    exit 1
fi

echo "✅ Токен получен"
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

# Применяем кастомный CSS через Rails console
echo ""
echo "🎨 Применение кастомных стилей..."

kubectl exec -n gitlab $POD_NAME -- bash -c 'cat > /tmp/gybernaty-custom.css' < k8s/gitlab/custom/gitlab-custom.css

kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner <<'EOF'
app_settings = ApplicationSetting.current

# Загружаем кастомный CSS
custom_css = File.read('/tmp/gybernaty-custom.css') rescue nil

if custom_css
  # Сохраняем CSS в настройках (если поддерживается)
  # Или применяем через custom header/footer
  puts "✅ Кастомный CSS загружен (#{custom_css.length} символов)"
end

# Обновляем название и описание
app_settings.update!(
  after_sign_up_text: 'Добро пожаловать в Community Lab by Gybernaty!',
  help_page_text: 'Community Lab by Gybernaty - ваша лаборатория для разработки и экспериментов.',
  home_page_url: 'https://gyber.org'
)

puts "✅ Настройки брендинга применены"
EOF

echo ""
echo "✅ Брендинг применен!"
echo ""
echo "📋 Следующие шаги (вручную через веб-интерфейс):"
echo "   1. Войдите в GitLab как root: https://gyber.org/lab"
echo "   2. Перейдите в Admin Area → Appearance"
echo "   3. Загрузите логотип: public/images/Logo.svg"
echo "   4. Установите название: 'Community Lab by Gybernaty'"
echo "   5. Примените кастомный CSS (скопируйте из k8s/gitlab/custom/gitlab-custom.css)"
echo ""

