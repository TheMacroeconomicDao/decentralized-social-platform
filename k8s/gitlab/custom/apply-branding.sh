#!/bin/bash

# Скрипт для применения кастомного брендинга Community Lab by Gybernaty
# Запускается внутри GitLab pod

set -e

echo "🎨 Применение кастомного брендинга Community Lab by Gybernaty..."

# Получаем имя пода
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab pod не найден"
    exit 1
fi

echo "📦 Pod: $POD_NAME"

# Применяем настройки через Rails console
kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner <<'EOF'
# Обновляем настройки приложения
app_settings = ApplicationSetting.current

# Название и описание
app_settings.update!(
  # Основная информация
  signup_enabled: true,
  user_default_external: false,
  
  # Email настройки (если нужно)
  # email_from: 'lab@gyber.org',
  # email_display_name: 'Community Lab by Gybernaty',
  
  # Дополнительные настройки
  after_sign_up_text: 'Добро пожаловать в Community Lab by Gybernaty!',
  help_page_text: 'Community Lab by Gybernaty - ваша лаборатория для разработки и экспериментов.',
  home_page_url: 'https://gyber.org',
  
  # Настройки внешнего вида
  default_theme: 1, # Indigo theme
  default_project_visibility: 'private',
  restricted_visibility_levels: []
)

# Обновляем информацию о системе (если возможно через API)
puts "✅ Настройки приложения обновлены"

# Выводим текущие настройки
puts "\n📋 Текущие настройки:"
puts "  Signup enabled: #{app_settings.signup_enabled}"
puts "  Default theme: #{app_settings.default_theme}"
puts "  Home page URL: #{app_settings.home_page_url}"
EOF

echo ""
echo "✅ Брендинг применен!"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Войдите в GitLab как root"
echo "   2. Перейдите в Admin Area → Appearance"
echo "   3. Загрузите кастомный логотип и настройте цвета"
echo "   4. Измените название на 'Community Lab by Gybernaty'"
echo ""

