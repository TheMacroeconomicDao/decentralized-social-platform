#!/bin/bash

# Скрипт для загрузки ассетов в GitLab pod

set -e

POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab pod не найден"
    exit 1
fi

echo "📦 Загрузка ассетов в pod: $POD_NAME"
echo ""

# Создаем директорию для ассетов в поде
kubectl exec -n gitlab $POD_NAME -- mkdir -p /var/opt/gitlab/nginx/www/assets/lab

# Копируем ассеты
echo "📤 Копирование ассетов..."

kubectl cp k8s/gitlab/custom/assets/lab-logo.svg gitlab/$POD_NAME:/var/opt/gitlab/nginx/www/assets/lab/lab-logo.svg
kubectl cp k8s/gitlab/custom/assets/lab-favicon.svg gitlab/$POD_NAME:/var/opt/gitlab/nginx/www/assets/lab/lab-favicon.svg
kubectl cp k8s/gitlab/custom/assets/lab-icon-16.svg gitlab/$POD_NAME:/var/opt/gitlab/nginx/www/assets/lab/lab-icon-16.svg
kubectl cp k8s/gitlab/custom/assets/lab-header-logo.svg gitlab/$POD_NAME:/var/opt/gitlab/nginx/www/assets/lab/lab-header-logo.svg

echo "✅ Ассеты загружены"
echo ""
echo "📋 Ассеты доступны по адресам:"
echo "   - https://gyber.org/lab/assets/lab/lab-logo.svg"
echo "   - https://gyber.org/lab/assets/lab/lab-favicon.svg"
echo "   - https://gyber.org/lab/assets/lab/lab-icon-16.svg"
echo "   - https://gyber.org/lab/assets/lab/lab-header-logo.svg"
echo ""
echo "💡 Используйте эти URL в настройках GitLab Appearance"

