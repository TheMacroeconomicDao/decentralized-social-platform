#!/bin/bash

# ===================================================
# 🚀 GPROD Environment Runner
# ===================================================
# Универсальный скрипт для запуска разных контуров окружения
# 
# Использование:
#   ./run-env.sh <dev|stage|prod> [--build] [--logs] [--stop]
#
# Примеры:
#   ./run-env.sh dev         # Запускает development окружение
#   ./run-env.sh stage       # Запускает staging окружение
#   ./run-env.sh prod        # Запускает production окружение
#   ./run-env.sh dev --build # Пересобирает и запускает development
#   ./run-env.sh dev --logs  # Показывает логи development окружения
#   ./run-env.sh dev --stop  # Останавливает development окружение

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Функции для вывода
print_header() {
  echo -e "\n${WHITE}${BOLD}$1${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

print_step() {
  echo -e "${PURPLE}→ $1${NC}"
}

# Получение каталога скрипта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"
DOCKER_DIR="$PROJECT_ROOT/automation/docker"
ENV_DIR="$PROJECT_ROOT/automation/env"

# Проверка параметров
if [ $# -lt 1 ]; then
  print_header "🚀 GPROD Environment Runner"
  print_error "Не указан контур окружения"
  print_info "Использование: ./run-env.sh <dev|stage|prod> [--build] [--logs] [--stop]"
  print_info "Примеры:"
  print_info "  ./run-env.sh dev         # Запускает development окружение"
  print_info "  ./run-env.sh stage       # Запускает staging окружение"
  print_info "  ./run-env.sh prod        # Запускает production окружение"
  print_info "  ./run-env.sh dev --build # Пересобирает и запускает development"
  exit 1
fi

ENV=$1
BUILD=false
LOGS=false
STOP=false

# Обработка дополнительных параметров
for param in "${@:2}"; do
  case $param in
    --build)
      BUILD=true
      ;;
    --logs)
      LOGS=true
      ;;
    --stop)
      STOP=true
      ;;
  esac
done

# Определение контура
case $ENV in
  dev|development)
    ENV_NAME="development"
    COMPOSE_FILE="$DOCKER_DIR/docker-compose.dev.yml"
    ENV_FILE="$PROJECT_ROOT/.env.development"
    PORT=3008
    ;;
  stage|staging)
    ENV_NAME="staging"
    COMPOSE_FILE="$DOCKER_DIR/docker-compose.stage.yml"
    ENV_FILE="$PROJECT_ROOT/.env.staging"
    PORT=3003
    ;;
  prod|production)
    ENV_NAME="production"
    COMPOSE_FILE="$DOCKER_DIR/docker-compose.prod.yml"
    ENV_FILE="$PROJECT_ROOT/.env.production"
    PORT=3007
    ;;
  *)
    print_error "Неизвестный контур: $ENV"
    print_info "Поддерживаемые контуры: dev, stage, prod"
    exit 1
    ;;
esac

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
  print_error "Docker не установлен"
  exit 1
fi

if ! docker info &> /dev/null; then
  print_error "Docker не запущен или нет прав на его использование"
  exit 1
fi

# Проверка наличия docker-compose файла
if [ ! -f "$COMPOSE_FILE" ]; then
  print_error "Не найден docker-compose файл: $COMPOSE_FILE"
  print_step "Пробуем создать из шаблона..."
  
  # Копируем из имеющегося шаблона и адаптируем
  if [ -f "$DOCKER_DIR/docker-compose.dev.yml" ]; then
    cp "$DOCKER_DIR/docker-compose.dev.yml" "$COMPOSE_FILE"
    print_success "Создан файл $COMPOSE_FILE из шаблона"
    
    # Адаптация для нужного контура
    sed -i.bak "s/gprod-db-dev/gprod-db-$ENV/g" "$COMPOSE_FILE"
    sed -i.bak "s/gprod-app-dev/gprod-app-$ENV/g" "$COMPOSE_FILE"
    sed -i.bak "s/gprod_dev/gprod_$ENV/g" "$COMPOSE_FILE"
    sed -i.bak "s/'3008:3000'/'$PORT:3000'/g" "$COMPOSE_FILE"
    sed -i.bak "s/development/$ENV_NAME/g" "$COMPOSE_FILE"
    rm -f "$COMPOSE_FILE.bak"
  else
    print_error "Не найден шаблон docker-compose файла"
    exit 1
  fi
fi

# Проверка наличия .env файла
if [ ! -f "$ENV_FILE" ]; then
  print_error "Не найден файл окружения: $ENV_FILE"
  print_info "Используйте скрипт автоматизации/env/setup-env.sh для создания файлов окружения"
  exit 1
fi

# Создание символической ссылки .env
ln -sf "$ENV_FILE" "$PROJECT_ROOT/.env"
print_success "Символическая ссылка .env -> $ENV_FILE создана"

# Определение команды запуска
if [ "$STOP" = true ]; then
  COMMAND="down"
  ACTION="Остановка"
elif [ "$LOGS" = true ]; then
  COMMAND="logs -f"
  ACTION="Просмотр логов"
elif [ "$BUILD" = true ]; then
  COMMAND="up -d --build"
  ACTION="Запуск с пересборкой"
else
  COMMAND="up -d"
  ACTION="Запуск"
fi

# Запуск docker-compose
print_header "🚀 $ACTION контура $ENV_NAME"
print_step "Команда: docker compose -f $COMPOSE_FILE $COMMAND"

cd "$PROJECT_ROOT"
docker compose -f "$COMPOSE_FILE" $COMMAND

# Проверка результата
if [ $? -eq 0 ]; then
  if [ "$STOP" != true ] && [ "$LOGS" != true ]; then
    print_success "Контур $ENV_NAME успешно запущен"
    print_info "API доступен по адресу: http://localhost:$PORT/api/v1"
    print_info "Swagger: http://localhost:$PORT/api/v1/docs"
    
    # Вывод списка запущенных контейнеров для этого контура
    print_step "Запущенные контейнеры:"
    docker ps --filter "name=gprod-*-$ENV" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  elif [ "$STOP" = true ]; then
    print_success "Контур $ENV_NAME успешно остановлен"
  fi
else
  print_error "Ошибка выполнения команды docker compose"
fi

exit 0 