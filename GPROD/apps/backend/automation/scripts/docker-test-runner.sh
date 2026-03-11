#!/bin/bash
# automation/scripts/docker-test-runner.sh

set -e

echo "🚀 Запуск тестов в Docker-контейнере"

# Ждем доступности базы данных
until pg_isready -h ${POSTGRES_HOST:-db} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-postgres}; do
  echo "⏳ Ожидание PostgreSQL..."
  sleep 2
done

# Применяем миграции
echo "🔄 Применение миграций"
npx prisma migrate deploy

# Запуск unit-тестов
echo "🧪 Запуск unit-тестов"
NODE_OPTIONS="--unhandled-rejections=strict" pnpm run test

# Запуск e2e-тестов с правильными флагами для решения проблем
echo "🧪 Запуск e2e-тестов"
NODE_OPTIONS="--unhandled-rejections=strict" \
  npx jest \
  --config ./test/jest-e2e.json \
  --forceExit \
  --detectOpenHandles \
  --runInBand

exit 0
