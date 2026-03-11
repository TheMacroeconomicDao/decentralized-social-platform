#!/bin/bash

# Скрипт для запуска тестов с правильным окружением

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Определяем операционную систему
OS=$(uname)

# Функция для проверки наличия .env.test файла
check_env_file() {
  if [ ! -f ".env.test" ]; then
    echo -e "${YELLOW}Файл .env.test не найден. Создаем его из шаблона...${NC}"
    
    if [ -f ".env-templates/.env.test" ]; then
      cp .env-templates/.env.test .env.test
      echo -e "${GREEN}Файл .env.test создан из шаблона.${NC}"
    else
      echo -e "${RED}Шаблон .env.test не найден. Запустите сначала scripts/setup-env-files.sh${NC}"
      exit 1
    fi
  fi
}

# Функция для определения режима запуска
# local - локальный запуск на хост-машине
# docker - запуск в контейнере
check_mode() {
  MODE="local"
  
  # Проверяем наличие Docker
  if [ -f "/.dockerenv" ]; then
    MODE="docker"
  fi
  
  echo -e "${GREEN}Обнаружен режим запуска: ${MODE}${NC}"
  
  # Обновляем .env.test с правильным значением RUNNING_IN_DOCKER
  if [ "$MODE" = "docker" ]; then
    if [ "$OS" = "Darwin" ]; then
      # macOS использует BSD версию sed
      sed -i '' 's/RUNNING_IN_DOCKER=false/RUNNING_IN_DOCKER=true/g' .env.test
    else
      # Linux использует GNU версию sed
      sed -i 's/RUNNING_IN_DOCKER=false/RUNNING_IN_DOCKER=true/g' .env.test
    fi
  else
    if [ "$OS" = "Darwin" ]; then
      # macOS использует BSD версию sed
      sed -i '' 's/RUNNING_IN_DOCKER=true/RUNNING_IN_DOCKER=false/g' .env.test
    else
      # Linux использует GNU версию sed
      sed -i 's/RUNNING_IN_DOCKER=true/RUNNING_IN_DOCKER=false/g' .env.test
    fi
  fi
}

# Функция для запуска unit тестов
run_unit_tests() {
  echo -e "${GREEN}Запуск юнит-тестов...${NC}"
  NODE_ENV=test pnpm run test $@
}

# Функция для запуска e2e тестов
run_e2e_tests() {
  echo -e "${GREEN}Запуск e2e тестов...${NC}"
  
  if [ "$MODE" = "docker" ]; then
    # В Docker контейнере
    echo -e "${YELLOW}Запуск e2e тестов в Docker контейнере${NC}"
    NODE_ENV=test pnpm run test:e2e $@
  else
    # На локальной машине
    echo -e "${YELLOW}Запуск e2e тестов на локальной машине${NC}"
    
    # Проверяем наличие PostgreSQL
    if [ "$OS" = "Darwin" ]; then
      # macOS - проверяем через brew services
      pg_running=$(brew services list | grep postgresql | grep started || echo "")
    else
      # Linux - проверяем через ps
      pg_running=$(ps aux | grep postgres | grep -v grep || echo "")
    fi
    
    if [ -z "$pg_running" ]; then
      echo -e "${YELLOW}PostgreSQL не обнаружен как системный сервис.${NC}"
      echo -e "${YELLOW}Проверяем Docker контейнеры с PostgreSQL...${NC}"
      
      # Проверяем, запущен ли Docker контейнер с PostgreSQL
      docker_pg=$(docker ps | grep postgres || echo "")
      if [ -z "$docker_pg" ]; then
        echo -e "${RED}PostgreSQL не запущен ни как сервис, ни в Docker.${NC}"
        echo -e "${RED}Запустите PostgreSQL перед выполнением тестов.${NC}"
        exit 1
      else
        echo -e "${GREEN}Обнаружен PostgreSQL в Docker. Продолжаем...${NC}"
      fi
    fi
    
    # Проверяем существование тестовой БД
    if command -v psql &> /dev/null; then
      # Если psql доступен - проверяем БД
      if [ "$OS" = "Darwin" ]; then
        # Для macOS
        db_exists=$(psql -lqt -U postgres 2>/dev/null | cut -d \| -f 1 | grep -w gprod_test || echo "")
      else
        # Для Linux
        db_exists=$(PGPASSWORD=postgres psql -h localhost -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -w gprod_test || echo "")
      fi
      
      if [ -z "$db_exists" ]; then
        echo -e "${YELLOW}База данных gprod_test не существует. Создаем...${NC}"
        if [ "$OS" = "Darwin" ]; then
          createdb -U postgres gprod_test || { echo -e "${RED}Не удалось создать БД${NC}"; exit 1; }
        else
          PGPASSWORD=postgres createdb -h localhost -U postgres gprod_test || { echo -e "${RED}Не удалось создать БД${NC}"; exit 1; }
        fi
      fi
    else
      echo -e "${YELLOW}Команда psql недоступна. Пропускаем проверку существования БД.${NC}"
      echo -e "${YELLOW}Предполагаем, что БД уже существует или будет создана автоматически.${NC}"
    fi
    
    # Запускаем миграции
    echo -e "${GREEN}Применяем миграции к тестовой базе данных...${NC}"
    NODE_ENV=test DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gprod_test npx prisma migrate deploy
    
    # Запуск тестов
    NODE_ENV=test pnpm run test:e2e:local $@
  fi
}

# Основная логика
check_env_file
check_mode

# Парсим аргументы
TEST_TYPE="all"
TEST_ARGS=""

if [ "$1" = "unit" ]; then
  TEST_TYPE="unit"
  shift
  TEST_ARGS="$@"
elif [ "$1" = "e2e" ]; then
  TEST_TYPE="e2e"
  shift
  TEST_ARGS="$@"
fi

# Запускаем тесты
if [ "$TEST_TYPE" = "unit" ]; then
  run_unit_tests $TEST_ARGS
elif [ "$TEST_TYPE" = "e2e" ]; then
  run_e2e_tests $TEST_ARGS
else
  run_unit_tests $TEST_ARGS
  run_e2e_tests $TEST_ARGS
fi 