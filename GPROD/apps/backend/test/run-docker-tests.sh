#!/bin/bash

# Запуск тестов в Docker с корректными параметрами
# Этот скрипт запускает тесты в Docker и правильно передает параметры Jest

echo "Запускаем тесты в Docker..."

# Запуск unit-тестов
echo "🔍 Запускаем unit-тесты..."
docker compose run --rm app node --unhandled-rejections=strict node_modules/.bin/jest

# Запуск e2e-тестов с обнаружением незакрытых хендлеров
echo "🔍 Запускаем e2e-тесты..."
docker compose run --rm app node --unhandled-rejections=strict node_modules/.bin/jest --config ./test/jest-e2e.json --detectOpenHandles --forceExit

echo "✅ Тесты завершены!"
