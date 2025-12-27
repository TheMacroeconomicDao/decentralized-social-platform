#!/bin/bash

# Полное применение брендинга Community Lab by Gybernaty
# Включает: загрузку ассетов, применение CSS, настройку через API

set -e

echo "🎨 Полное применение брендинга Community Lab by Gybernaty"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Загрузка ассетов
echo "📦 ШАГ 1: Загрузка ассетов..."
./k8s/gitlab/custom/upload-assets.sh
echo ""

# 2. Применение настроек через API
echo "⚙️  ШАГ 2: Применение настроек..."
./k8s/gitlab/custom/apply-gybernaty-branding.sh
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Брендинг применен!"
echo ""
echo "📋 Финальные шаги (через веб-интерфейс):"
echo ""
echo "1. Откройте: https://gyber.org/lab"
echo "2. Войдите как root (пароль: 73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=)"
echo "3. Перейдите: Admin Area → Appearance"
echo "4. Загрузите логотип: https://gyber.org/lab/assets/lab/lab-logo.svg"
echo "5. Загрузите favicon: https://gyber.org/lab/assets/lab/lab-favicon.svg"
echo "6. Вставьте кастомный CSS из: k8s/gitlab/custom/gitlab-custom.css"
echo "7. Установите название: 'Community Lab by Gybernaty'"
echo ""
echo "🎉 Готово! Community Lab настроен!"

