#!/bin/bash

# ===================================================
# 🚀 GPROD Automation Script
# ===================================================
# Главный скрипт для управления автоматизацией проекта
#
# Использование:
#   ./automation/run.sh <команда> [контур]
#
# Команды:
#   env         - настройка окружения
#   run         - запуск окружения (настройка + запуск Docker)
#   stop        - остановка окружения
#   logs        - просмотр логов
#   test        - запуск тестов
#   interactive - интерактивный режим запуска
#
# Контуры:
#   dev, stage, prod, reference

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

# Функция для отображения прогресс-бара
show_progress() {
  local progress=$1
  local total=$2
  local width=40
  local percentage=$((progress * 100 / total))
  local completed=$((progress * width / total))
  local remaining=$((width - completed))
  
  printf "[${GREEN}"
  printf "%${completed}s" | tr ' ' '█'
  printf "${NC}%${remaining}s] %d%%" | tr ' ' '░' "$percentage"
  echo -ne "\r"
}

# Проверка наличия необходимых утилит для интерактивного режима
check_interactive_deps() {
  if ! command -v tput &> /dev/null; then
    print_error "Утилита 'tput' не найдена. Установите пакет 'ncurses'."
    return 1
  fi
  return 0
}

# Файл для хранения истории запусков
HISTORY_FILE="$PROJECT_ROOT/.run_history"

# Функция для сохранения выбора в историю
save_to_history() {
  local env=$1
  local rebuild=$2
  echo "ENV=$env" > "$HISTORY_FILE"
  echo "REBUILD=$rebuild" >> "$HISTORY_FILE"
  echo "TIMESTAMP=$(date +%s)" >> "$HISTORY_FILE"
}

# Функция для загрузки истории
load_from_history() {
  if [ -f "$HISTORY_FILE" ]; then
    source "$HISTORY_FILE"
    # Возвращаем значения через глобальные переменные
    LAST_ENV=$ENV
    LAST_REBUILD=$REBUILD
    LAST_TIMESTAMP=$TIMESTAMP
  else
    LAST_ENV="dev"
    LAST_REBUILD="false"
    LAST_TIMESTAMP=0
  fi
}

# Функция для отображения меню выбора контура
show_env_menu() {
  print_header "🚀 GPROD Интерактивный запуск"
  echo -e "${CYAN}Выберите контур:${NC}"
  echo -e "  ${YELLOW}1)${NC} Development (dev) - для локальной разработки"
  echo -e "  ${YELLOW}2)${NC} Staging (stage) - для тестирования"
  echo -e "  ${YELLOW}3)${NC} Production (prod) - для продакшена"
  echo -e "  ${YELLOW}4)${NC} Reference - минимальная конфигурация"
  echo -e "\n${CYAN}Дополнительные опции:${NC}"
  echo -e "  ${YELLOW}q)${NC} Выход"
  echo -e "\n${CYAN}Введите номер контура (1-4) или q для выхода:${NC} "
}

# Функция для отображения меню выбора режима запуска
show_mode_menu() {
  local has_images=$1
  
  print_header "🚀 Выбор режима запуска"
  
  if [ "$has_images" = true ]; then
    echo -e "${CYAN}Режим запуска:${NC}"
    echo -e "  ${YELLOW}a)${NC} Обычный запуск (использовать существующие образы)"
    echo -e "  ${YELLOW}b)${NC} С пересборкой (принудительная пересборка образов)"
    echo -e "\n${CYAN}Введите ваш выбор (a/b):${NC} "
  else
    print_info "Готовые образы Docker не найдены. Будет выполнена сборка."
    echo -e "\n${CYAN}Нажмите Enter для продолжения...${NC}"
    read -r
    return 1  # Возвращаем 1, что означает пересборку
  fi
}

# Функция для проверки наличия образов Docker
check_docker_images() {
  local env=$1
  local image_name="gprod-new-backend-app"
  local image_tag="latest"
  
  # Проверяем наличие образа
  print_step "Проверка наличия образов Docker..."
  
  # Используем docker image ls с фильтрацией для более точной проверки
  if docker image ls "$image_name:$image_tag" --format "{{.Repository}}:{{.Tag}}" | grep -q "$image_name:$image_tag"; then
    print_success "Найден существующий образ $image_name:$image_tag"
    return 0  # Образ найден
  else
    # Дополнительная проверка через docker image inspect для надежности
    if docker image inspect "$image_name:$image_tag" &>/dev/null; then
      print_success "Найден существующий образ $image_name:$image_tag"
      return 0  # Образ найден
    else
      print_info "Образ $image_name:$image_tag не найден"
      return 1  # Образ не найден
    fi
  fi
}

# Функция для проверки наличия контейнеров и зависимостей
check_docker_volumes() {
  local env=$1
  local container_name="gprod-app-${env}"
  local db_volume_name="gprod-new-backend_pgdata_${env}"
  
  # Проверяем наличие тома для PostgreSQL
  print_step "Проверка наличия томов и контейнеров Docker..."
  
  # Проверяем наличие тома для базы данных
  if docker volume ls | grep -q "$db_volume_name"; then
    print_success "Найден существующий том для базы данных"
    
    # Проверяем наличие контейнера приложения
    if docker ps -a | grep -q "$container_name"; then
      print_success "Найден существующий контейнер $container_name"
      
      # Проверяем наличие установленных зависимостей в контейнере
      # Проверяем, запущен ли контейнер
      if docker ps | grep -q "$container_name"; then
        print_success "Контейнер $container_name запущен"
        return 0  # Контейнер запущен, значит зависимости установлены
      else
        print_info "Контейнер $container_name существует, но не запущен"
        # Пробуем запустить существующий контейнер
        print_step "Попытка запуска существующего контейнера..."
        docker start "$container_name" &>/dev/null
        if [ $? -eq 0 ]; then
          print_success "Контейнер $container_name успешно запущен"
          return 0  # Контейнер запущен
        else
          print_error "Не удалось запустить контейнер $container_name"
          return 1  # Не удалось запустить контейнер
        fi
      fi
    else
      print_info "Контейнер $container_name не найден"
      return 1  # Контейнер не найден
    fi
  else
    print_info "Том для базы данных не найден"
    return 1  # Том не найден
  fi
}

# Функция для проверки готовности окружения
check_environment_ready() {
  local env=$1
  local images_ready=false
  local volumes_ready=false
  
  # Проверяем наличие образов
  if check_docker_images "$env"; then
    images_ready=true
  fi
  
  # Проверяем наличие томов и зависимостей
  if check_docker_volumes "$env"; then
    volumes_ready=true
  fi
  
  # Если и образы, и томы готовы, то окружение готово
  if [ "$images_ready" = true ] && [ "$volumes_ready" = true ]; then
    print_success "Окружение полностью готово"
    return 0  # Окружение готово
  else
    print_info "Окружение не полностью готово"
    return 1  # Окружение не готово
  fi
}

# Функция для запуска проекта в интерактивном режиме
run_interactive() {
  # Проверяем наличие зависимостей
  check_interactive_deps || return 1
  
  # Загружаем историю запусков
  load_from_history
  
  # Шаг 1: Выбор контура
  show_env_menu
  read -r env_choice
  
  # Определение контура
  env=""
  case $env_choice in
    1)
      env="dev"
      ;;
    2)
      env="stage"
      ;;
    3)
      env="prod"
      ;;
    4)
      env="reference"
      ;;
    q)
      print_info "Выход из программы"
      return 0
      ;;
    *)
      print_error "Неверный выбор контура"
      return 1
      ;;
  esac
  
  # Шаг 2: Проверка готовности окружения (образы, томы, зависимости)
  print_header "Проверка готовности окружения"
  environment_ready=false
  if check_environment_ready "$env"; then
    environment_ready=true
  fi
  
  # Шаг 3: Выбор режима запуска (только если окружение готово)
  rebuild=false
  
  if [ "$environment_ready" = true ]; then
    show_mode_menu "$environment_ready"
    read -r mode_choice
    
    case $mode_choice in
      a)
        rebuild=false
        ;;
      b)
        rebuild=true
        ;;
      *)
        print_error "Неверный выбор режима запуска"
        return 1
        ;;
    esac
  else
    # Если окружение не готово, то нужна сборка
    rebuild=true
    print_info "Окружение не полностью готово. Будет выполнена полная настройка."
    echo -e "\n${CYAN}Нажмите Enter для продолжения...${NC}"
    read -r
  fi
  
  # Сохраняем выбор в историю
  save_to_history "$env" "$rebuild"
  
  # Запускаем проект
  print_header "🚀 Запуск окружения: $env"
  print_step "Настройка окружения..."
  bash "$ENV_MANAGER" "$env" --silent --docker
  
  print_step "Запуск Docker контейнеров..."
  
  # Создаем переменную для хранения дополнительных параметров Docker
  docker_args=""
  
  # Если окружение готово и не нужна пересборка, используем override файл
  if [ "$environment_ready" = true ] && [ "$rebuild" = false ]; then
    print_info "Используем готовое окружение без переустановки зависимостей"
    docker_args="-f docker/docker-compose.$env.yml -f docker/docker-compose.$env.override.yml"
  elif [ "$rebuild" = true ]; then
    print_info "Режим принудительной пересборки активирован"
    docker_args="--build"
  fi
  
  # Запускаем Docker с нужными параметрами
  if [ -n "$docker_args" ]; then
    bash "$DOCKER_MANAGER" "$env" up $docker_args
  else
    bash "$DOCKER_MANAGER" "$env" up
  fi
  
  return 0
}

# Получение директорий
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../" && pwd)"
ENV_MANAGER="$SCRIPT_DIR/env/env-manager.sh"
DOCKER_MANAGER="$PROJECT_ROOT/docker/docker-manager.sh"
TEST_SCRIPT="$SCRIPT_DIR/scripts/run-tests.sh"

# Проверка наличия параметров
if [ $# -lt 1 ]; then
  print_header "🚀 GPROD Automation Script"
  print_error "Не указана команда"
  print_info "Использование: ./automation/run.sh <команда> [контур]"
  print_info "Команды: env, run, stop, logs, test"
  print_info "Контуры: dev, stage, prod, reference"
  exit 1
fi

COMMAND=$1
ENV=${2:-dev}  # По умолчанию используем dev

# Проверка наличия флага --rebuild
REBUILD=false
for arg in "$@"; do
  if [ "$arg" = "--rebuild" ]; then
    REBUILD=true
    break
  fi
done

# Выполнение команды
case $COMMAND in
  env)
    print_header "🌟 Настройка окружения: $ENV"
    bash "$ENV_MANAGER" "$ENV" "$3" "$4"
    ;;
  run)
    print_header "🚀 Запуск окружения: $ENV"
    print_step "Настройка окружения..."
    bash "$ENV_MANAGER" "$ENV" --silent --docker
    
    print_step "Запуск Docker контейнеров..."
    
    # Проверка флага --rebuild
    if [ "$REBUILD" = true ]; then
      print_info "Режим принудительной пересборки активирован"
      bash "$DOCKER_MANAGER" "$ENV" up --build
    else
      bash "$DOCKER_MANAGER" "$ENV" up
    fi
    ;;
  stop)
    print_header "🛑 Остановка окружения: $ENV"
    bash "$DOCKER_MANAGER" "$ENV" down
    ;;
  logs)
    print_header "📋 Просмотр логов: $ENV"
    bash "$DOCKER_MANAGER" "$ENV" logs
    ;;
  test)
    print_header "🧪 Запуск тестов"
    if [ "$ENV" = "unit" ] || [ "$ENV" = "e2e" ]; then
      # Если второй параметр - тип теста
      bash "$TEST_SCRIPT" "$ENV" "${@:3}"
    else
      # Запуск всех тестов
      bash "$TEST_SCRIPT" "${@:2}"
    fi
    ;;
  interactive)
    # Запуск в интерактивном режиме
    run_interactive
    ;;
  *)
    print_error "Неизвестная команда: $COMMAND"
    print_info "Доступные команды: env, run, stop, logs, test, interactive"
    exit 1
    ;;
esac

exit 0