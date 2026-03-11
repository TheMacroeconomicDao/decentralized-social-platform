#!/bin/bash

# ===================================================
# 🌟 GPROD Environment Manager
# ===================================================
# Скрипт для переключения и настройки контуров окружения
# 
# Использование:
#   ./env-manager.sh <dev|stage|prod> [--silent] [--docker|--local]
#
# Примеры:
#   ./env-manager.sh dev         # Переключение на development
#   ./env-manager.sh stage       # Переключение на staging
#   ./env-manager.sh prod        # Переключение на production
#   ./env-manager.sh dev --silent # Тихий режим без запросов

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
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

# Получение директорий
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"
DOCKER_DIR="$PROJECT_ROOT/docker"

# Проверка параметров
if [ $# -lt 1 ]; then
  print_header "🌟 GPROD Environment Manager"
  print_error "Не указан контур окружения"
  print_info "Использование: ./env-manager.sh <dev|stage|prod>"
  exit 1
fi

ENV=$1
SILENT_MODE=false
USE_DOCKER=true

# Разбор дополнительных параметров
shift
while [ "$#" -gt 0 ]; do
  case "$1" in
    --silent)
      SILENT_MODE=true
      ;;
    --docker)
      USE_DOCKER=true
      ;;
    --local)
      USE_DOCKER=false
      ;;
    *)
      print_error "Неизвестный параметр: $1"
      ;;
  esac
  shift
done

# Проверка корректности контура
case $ENV in
  dev|development)
    ENV_NAME="development"
    ENV_SHORT="dev"
    COMPOSE_FILE="$DOCKER_DIR/docker-compose.dev.yml"
    PORT=3008
    ;;
  stage|staging)
    ENV_NAME="staging"
    ENV_SHORT="stage"
    COMPOSE_FILE="$DOCKER_DIR/docker-compose.stage.yml"
    PORT=3003
    ;;
  prod|production)
    ENV_NAME="production"
    ENV_SHORT="prod"
    COMPOSE_FILE="$DOCKER_DIR/docker-compose.prod.yml"
    PORT=3007
    ;;
  *)
    print_error "Некорректный контур: $ENV"
    print_info "Поддерживаемые контуры: dev, stage, prod"
    exit 1
    ;;
esac

# Файл окружения
ENV_FILE="$PROJECT_ROOT/.env.$ENV_NAME"

# Вывод информации о контуре
print_header "🌟 Настройка окружения $ENV_NAME"
print_info "Контур: $ENV_NAME"
print_info "Файл окружения: $ENV_FILE"
print_info "Docker Compose файл: $COMPOSE_FILE"

# Проверка наличия файла окружения
if [ ! -f "$ENV_FILE" ]; then
  print_warning "Файл окружения $ENV_FILE не найден"
  
  # Пытаемся создать файл из шаблона
  if [ -f "$PROJECT_ROOT/.env-templates/.env.$ENV_NAME" ]; then
    print_step "Создаем из шаблона..."
    cp "$PROJECT_ROOT/.env-templates/.env.$ENV_NAME" "$ENV_FILE"
    print_success "Создан файл $ENV_FILE из шаблона"
  else
    print_step "Создаем базовый файл окружения..."
    
    # Создаем минимальный файл окружения
    echo "NODE_ENV=$ENV_NAME" > "$ENV_FILE"
    echo "PORT=$PORT" >> "$ENV_FILE"
    echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_${ENV_SHORT}" >> "$ENV_FILE"
    echo "JWT_SECRET=${ENV_SHORT}_secret_key" >> "$ENV_FILE"
    echo "RUNNING_IN_DOCKER=true" >> "$ENV_FILE"
    
    print_success "Создан базовый файл $ENV_FILE"
  fi
fi

# Создание символической ссылки .env
print_step "Создание символической ссылки .env -> $ENV_FILE..."
ln -sf "$ENV_FILE" "$PROJECT_ROOT/.env"
print_success "Символическая ссылка .env создана"

# Запрос на запуск Docker
if [ "$SILENT_MODE" = false ]; then
  print_info "Запустить Docker контейнеры для $ENV_NAME? (y/n)"
  read -p "$(echo -e $YELLOW"Ваш выбор: "$NC)" should_start_docker
  
  if [[ "$should_start_docker" == "y" || "$should_start_docker" == "Y" ]]; then
    USE_DOCKER=true
  else
    USE_DOCKER=false
  fi
fi

# Запуск/остановка Docker контейнеров
if [ "$USE_DOCKER" = true ]; then
  # Проверка наличия Docker
  if ! command -v docker &> /dev/null; then
    print_error "Docker не установлен"
    exit 1
  fi
  
  if ! docker info &> /dev/null; then
    print_error "Docker демон не запущен"
    exit 1
  fi
  
  # Проверка наличия файла docker-compose
  if [ ! -f "$COMPOSE_FILE" ]; then
    print_warning "Файл $COMPOSE_FILE не найден"
    
    # Ищем альтернативные файлы
    if [ -f "$DOCKER_DIR/docker-compose.reference.yml" ]; then
      COMPOSE_FILE="$DOCKER_DIR/docker-compose.reference.yml"
      print_info "Используем $COMPOSE_FILE"
    else
      print_error "Не найден подходящий docker-compose файл"
      exit 1
    fi
  fi
  
  # Остановка контейнеров перед запуском
  print_step "Останавливаем запущенные контейнеры..."
  cd "$PROJECT_ROOT"
  docker compose -f "$COMPOSE_FILE" down &> /dev/null
  
  # Запуск контейнеров
  print_step "Запускаем контейнеры с $COMPOSE_FILE..."
  docker compose -f "$COMPOSE_FILE" up -d
  
  # Проверка результата
  if [ $? -eq 0 ]; then
    print_success "Контейнеры успешно запущены"
    
    # Вывод информации о сервисах
    print_header "🔗 Доступные сервисы"
    case $ENV_NAME in
      development)
        print_info "API: http://localhost:$PORT/api/v1"
        print_info "Swagger: http://localhost:$PORT/api/v1/docs"
        ;;
      staging)
        print_info "API: http://localhost:$PORT/api/v1"
        print_info "Swagger: http://localhost:$PORT/api/v1/docs"
        print_info "Prometheus: http://localhost:9090"
        print_info "Grafana: http://localhost:3100"
        ;;
      production)
        print_info "API: http://localhost:$PORT/api/v1"
        print_info "Swagger: http://localhost:$PORT/api/v1/docs"
        print_info "Grafana: http://localhost:3500"
        ;;
    esac
    
    # Вывод запущенных контейнеров
    print_step "Запущенные контейнеры:"
    docker ps --filter "name=gprod-*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  else
    print_error "Ошибка запуска контейнеров"
  fi
else
  print_info "Запуск Docker контейнеров пропущен"
  print_info "Для запуска используйте: pnpm run auto:run:$ENV_SHORT"
fi

print_success "Окружение $ENV_NAME успешно настроено!"
exit 0 