#!/bin/bash

# Скачивание ассетов для локальной загрузки в GitLab

set -e

echo "📥 Подготовка файлов для локальной загрузки..."
echo ""

# Создаем директорию для скачанных файлов
DOWNLOAD_DIR="k8s/gitlab/custom/assets-for-upload"
mkdir -p "$DOWNLOAD_DIR"

# Копируем файлы
cp k8s/gitlab/custom/assets/lab-logo.svg "$DOWNLOAD_DIR/logo.svg"
cp k8s/gitlab/custom/assets/lab-favicon.svg "$DOWNLOAD_DIR/favicon.svg"

echo "✅ Файлы скопированы в: $DOWNLOAD_DIR"
echo ""
echo "📋 Файлы для загрузки:"
echo "   - $DOWNLOAD_DIR/logo.svg (логотип)"
echo "   - $DOWNLOAD_DIR/favicon.svg (favicon)"
echo ""
echo "💡 Теперь вы можете:"
echo "   1. Открыть GitLab: https://gyber.org/lab"
echo "   2. Перейти: Admin Area → Appearance"
echo "   3. В разделе 'Logo' нажать 'Choose file' и выбрать:"
echo "      $DOWNLOAD_DIR/logo.svg"
echo "   4. В разделе 'Favicon' нажать 'Choose file' и выбрать:"
echo "      $DOWNLOAD_DIR/favicon.svg"
echo ""

