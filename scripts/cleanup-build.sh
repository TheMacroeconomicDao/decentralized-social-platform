#!/bin/bash

# Скрипт для очистки процессов сборки и кеша

echo "🧹 Очистка процессов сборки Next.js..."

# Находим и останавливаем все процессы next build
BUILD_PIDS=$(ps aux | grep "next build" | grep -v grep | awk '{print $2}')

if [ -z "$BUILD_PIDS" ]; then
    echo "✅ Процессы сборки не найдены"
else
    echo "🛑 Останавливаем процессы сборки: $BUILD_PIDS"
    echo "$BUILD_PIDS" | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Процессы остановлены"
fi

# Очищаем кеш Next.js
echo ""
echo "🧹 Очистка кеша Next.js..."

if [ -d ".next" ]; then
    echo "📁 Удаляем папку .next..."
    rm -rf .next
    echo "✅ Кеш очищен"
else
    echo "✅ Папка .next не существует"
fi

# Очищаем node_modules/.cache если есть
if [ -d "node_modules/.cache" ]; then
    echo "📁 Очищаем node_modules/.cache..."
    rm -rf node_modules/.cache
    echo "✅ Кеш node_modules очищен"
fi

echo ""
echo "✅ Очистка завершена!"
echo ""
echo "💡 Теперь можно запустить dev сервер: npm run dev"
