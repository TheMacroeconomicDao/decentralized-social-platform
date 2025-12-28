#!/bin/bash

# Полное применение брендинга Community Lab by Gybernaty
# Включает: загрузку ассетов, применение CSS, настройку через API, замену текста

set -e

echo "🎨 Полное применение брендинга Community Lab by Gybernaty"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Загружаем токен из файла, если он есть
if [ -f "k8s/gitlab/gitlab-token.env" ]; then
    source k8s/gitlab/gitlab-token.env
    echo "✅ Токен загружен из k8s/gitlab/gitlab-token.env"
elif [ -f "k8s/gitlab/.gitlab-token" ]; then
    export GITLAB_TOKEN=$(cat k8s/gitlab/.gitlab-token | tr -d '\n\r ')
    echo "✅ Токен загружен из k8s/gitlab/.gitlab-token"
fi

if [ -z "$GITLAB_TOKEN" ]; then
    echo "⚠️  Токен не найден, скрипты попытаются создать его автоматически"
fi

echo ""

# 1. Загрузка ассетов
echo "📦 ШАГ 1: Загрузка ассетов..."
./k8s/gitlab/custom/upload-assets.sh
echo ""

# 2. Применение настроек через API
echo "⚙️  ШАГ 2: Применение настроек..."
./k8s/gitlab/custom/apply-gybernaty-branding.sh
echo ""

# 3. Полное исправление текста GitLab
echo "🔧 ШАГ 3: Исправление всех упоминаний GitLab..."
./k8s/gitlab/custom/fix-all-gitlab-text.sh
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Брендинг применен!"
echo ""
echo "📋 ФИНАЛЬНЫЕ ШАГИ (через веб-интерфейс):"
echo ""
echo "1. Подготовьте файлы локально:"
echo "   ./k8s/gitlab/custom/download-assets-local.sh"
echo ""
echo "2. Откройте: https://gyber.org/lab"
echo "3. Войдите как root (пароль: 73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=)"
echo "4. Перейдите: Admin Area → Appearance"
echo ""
echo "5. В разделе 'Logo':"
echo "   Нажмите 'Choose file' и выберите:"
echo "   k8s/gitlab/custom/assets-for-upload/logo.svg"
echo ""
echo "6. В разделе 'Favicon':"
echo "   Нажмите 'Choose file' и выберите:"
echo "   k8s/gitlab/custom/assets-for-upload/favicon.svg"
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
echo "🎉 Готово! Community Lab настроен!"

