#!/bin/bash

# Скрипт для запуска тестов в Docker-контейнере
# Автоматически настраивает окружение для тестов

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверяем, запущены ли мы в Docker
if [ ! -f "/.dockerenv" ]; then
  echo -e "${RED}Этот скрипт предназначен для запуска только внутри Docker-контейнера${NC}"
  exit 1
fi

# Настраиваем переменные окружения для тестов
export NODE_ENV=test
export RUNNING_IN_DOCKER=true

# Проверяем подключение к базе данных
echo -e "${YELLOW}Проверяем подключение к базе данных...${NC}"
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Ожидание PostgreSQL..."
  sleep 2
done

# Применяем миграции
echo -e "${GREEN}Применяем миграции к тестовой базе данных...${NC}"
npx prisma migrate deploy

# Запускаем тесты в зависимости от переданного параметра
if [ "$1" = "unit" ]; then
  echo -e "${GREEN}Запуск юнит-тестов...${NC}"
  pnpm run test
elif [ "$1" = "e2e" ]; then
  echo -e "${GREEN}Запуск e2e тестов...${NC}"
  pnpm run test:e2e
else
  echo -e "${GREEN}Запуск всех тестов...${NC}"
  pnpm run test
  pnpm run test:e2e
fi 