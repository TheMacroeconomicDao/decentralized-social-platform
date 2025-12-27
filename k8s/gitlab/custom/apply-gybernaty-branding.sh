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

# Применяем кастомный CSS и JavaScript через Rails console
echo "🎨 Применение кастомных стилей и скриптов..."

kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner <<'EOF'
app_settings = ApplicationSetting.current

# Загружаем кастомный CSS
custom_css = File.read('/tmp/gybernaty-custom.css') rescue nil
custom_js = File.read('/tmp/gybernaty-text-replace.js') rescue nil

# Создаем кастомный HTML с CSS и JavaScript
custom_html_head = ''
custom_html_footer = ''

if custom_css
  custom_html_head += "<style>\n#{custom_css}\n</style>\n"
  puts "✅ Кастомный CSS загружен (#{custom_css.length} символов)"
end

if custom_js
  # Добавляем JavaScript в footer для замены текста
  custom_html_footer += "<script>\n#{custom_js}\n</script>\n"
  puts "✅ JavaScript для замены текста загружен (#{custom_js.length} символов)"
end

# Обновляем настройки приложения
app_settings.update!(
  after_sign_up_text: 'Добро пожаловать в Community Lab by Gybernaty!',
  help_page_text: 'Community Lab by Gybernaty - ваша лаборатория для разработки и экспериментов.',
  home_page_url: 'https://gyber.org',
  # Применяем кастомный HTML (если поддерживается)
  header_message: 'Community Lab by Gybernaty',
  footer_message: 'Community Lab by Gybernaty'
)

# Пытаемся применить через custom HTML (если доступно)
begin
  if app_settings.respond_to?(:custom_appearance_html_head=)
    app_settings.custom_appearance_html_head = custom_html_head
  end
  if app_settings.respond_to?(:custom_appearance_html_footer=)
    app_settings.custom_appearance_html_footer = custom_html_footer
  end
  app_settings.save!
rescue => e
  puts "⚠️  Не удалось применить кастомный HTML напрямую: #{e.message}"
  puts "💡 Примените вручную через Admin Area → Appearance"
end

puts "✅ Настройки брендинга применены"
EOF

echo ""
echo "✅ Брендинг применен!"
echo ""
echo "📋 Финальные шаги (через веб-интерфейс):"
echo ""
echo "1. Откройте: https://gyber.org/lab"
echo "2. Войдите как root (пароль: 73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=)"
echo "3. Перейдите: Admin Area → Appearance"
echo "4. Загрузите логотип: https://gyber.org/lab/assets/lab/lab-logo.svg"
echo "5. Загрузите favicon: https://gyber.org/lab/assets/lab/lab-favicon.svg"
echo "6. В разделе 'Custom HTML head' вставьте:"
echo "   <link rel=\"stylesheet\" href=\"https://gyber.org/lab/assets/lab/text-replace.js\">"
echo "   <script src=\"https://gyber.org/lab/assets/lab/text-replace.js\"></script>"
echo "7. В разделе 'Custom CSS' вставьте содержимое из: k8s/gitlab/custom/gitlab-custom.css"
echo "8. Установите название: 'Community Lab by Gybernaty'"
echo ""
echo "💡 JavaScript автоматически заменит все упоминания 'GitLab' на 'Community Lab by Gybernaty'"
echo ""

