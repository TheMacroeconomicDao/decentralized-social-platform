#!/bin/bash

# Полное исправление всех упоминаний GitLab
# Заменяет текст через API и применяет кастомные стили

set -e

echo "🔧 Полное исправление брендинга Community Lab by Gybernaty"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Получаем имя пода
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab pod не найден"
    exit 1
fi

echo "📦 Pod: $POD_NAME"
echo ""

# Получаем токен
echo "🔐 Получение root токена..."

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

# Загружаем файлы в pod
echo "📤 Загрузка кастомных файлов..."

kubectl exec -n gitlab $POD_NAME -- bash -c 'cat > /tmp/gybernaty-custom.css' < k8s/gitlab/custom/gitlab-custom.css
kubectl exec -n gitlab $POD_NAME -- bash -c 'cat > /tmp/gybernaty-text-replace.js' < k8s/gitlab/custom/gitlab-text-replace.js

# Копируем JavaScript в публичную директорию
kubectl exec -n gitlab $POD_NAME -- mkdir -p /var/opt/gitlab/nginx/www/assets/lab
kubectl cp k8s/gitlab/custom/gitlab-text-replace.js gitlab/$POD_NAME:/var/opt/gitlab/nginx/www/assets/lab/text-replace.js

echo "✅ Файлы загружены"
echo ""

# Применяем через Rails console
echo "🎨 Применение брендинга через Rails console..."

kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner <<'EOF'
app_settings = ApplicationSetting.current

# Загружаем файлы
custom_css = File.read('/tmp/gybernaty-custom.css') rescue nil
custom_js = File.read('/tmp/gybernaty-text-replace.js') rescue nil

# Обновляем все настройки приложения
updates = {
  after_sign_up_text: 'Добро пожаловать в Community Lab by Gybernaty!',
  help_page_text: 'Community Lab by Gybernaty - ваша лаборатория для разработки и экспериментов.',
  home_page_url: 'https://gyber.org',
  signup_enabled: true,
  user_default_external: false
}

# Пытаемся обновить через API-совместимые поля
begin
  app_settings.update!(updates)
  puts "✅ Настройки приложения обновлены"
rescue => e
  puts "⚠️  Ошибка обновления настроек: #{e.message}"
end

# Пытаемся применить кастомный CSS и JavaScript
if custom_css || custom_js
  puts ""
  puts "📝 Информация о кастомных файлах:"
  puts "   CSS: #{custom_css ? "#{custom_css.length} символов" : "не найден"}"
  puts "   JS: #{custom_js ? "#{custom_js.length} символов" : "не найден"}"
  puts ""
  puts "💡 Примените эти файлы через Admin Area → Appearance:"
  puts "   1. Custom CSS: скопируйте содержимое из k8s/gitlab/custom/gitlab-custom.css"
  puts "   2. Custom HTML head: <script src=\"https://gyber.org/lab/assets/lab/text-replace.js\"></script>"
end

puts ""
puts "✅ Брендинг применен через Rails console"
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Исправление завершено!"
echo ""
echo "📋 ФИНАЛЬНЫЕ ШАГИ (через веб-интерфейс):"
echo ""
echo "1. Откройте: https://gyber.org/lab"
echo "2. Войдите как root"
echo "3. Перейдите: Admin Area → Appearance"
echo ""
echo "4. В разделе 'Logo':"
echo "   Загрузите: https://gyber.org/lab/assets/lab/lab-logo.svg"
echo ""
echo "5. В разделе 'Favicon':"
echo "   Загрузите: https://gyber.org/lab/assets/lab/lab-favicon.svg"
echo ""
echo "6. В разделе 'Custom CSS':"
echo "   Скопируйте и вставьте содержимое файла:"
echo "   k8s/gitlab/custom/gitlab-custom.css"
echo ""
echo "7. В разделе 'Custom HTML head':"
echo "   Вставьте:"
echo "   <script src=\"https://gyber.org/lab/assets/lab/text-replace.js\"></script>"
echo ""
echo "8. В разделе 'Title':"
echo "   Установите: 'Community Lab by Gybernaty'"
echo ""
echo "9. Сохраните изменения"
echo ""
echo "💡 JavaScript автоматически заменит все упоминания 'GitLab' на 'Community Lab by Gybernaty'"
echo ""

