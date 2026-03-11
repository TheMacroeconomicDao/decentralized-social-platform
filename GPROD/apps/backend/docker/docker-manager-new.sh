#!/bin/bash

# ===================================================
# 🚀 GPROD Docker Manager
# ===================================================
# Скрипт для управления Docker контейнерами проекта
#
# Использование:
#   ./docker/docker-manager.sh <env> <command> [options]
#
# Команды:
#   up        - Запустить контейнеры
#   down      - Остановить контейнеры
#   restart   - Перезапустить контейнеры
#   logs      - Просмотреть логи контейнеров
#   status    - Проверить статус контейнеров
#
# Опции:
#   --build   - Пересобрать образы при запуске
#   --volumes - Удалить тома при остановке
#
# Примеры:
#   ./docker/docker-manager.sh dev up
#   ./docker/docker-manager.sh prod up --build
#   ./docker/docker-manager.sh stage down --volumes

# Определяем корневую директорию проекта
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

# Подключаем библиотеки
source "$PROJECT_ROOT/automation/lib/common-lib.sh"
source "$PROJECT_ROOT/automation/lib/env-lib.sh"
source "$PROJECT_ROOT/automation/lib/docker-lib.sh"

# Функция для вывода справки
show_help() {
  common_print_header "🐳 GPROD Docker Manager - Справка"
  echo "Использование: ./docker/docker-manager.sh <env> <command> [options]"
  echo ""
  echo "Окружения:"
  echo "  dev        - Окружение разработки"
  echo "  stage      - Окружение тестирования"
  echo "  prod       - Продакшн окружение"
  echo "  reference  - Минимальное окружение"
  echo ""
  echo "Команды:"
  echo "  up        - Запустить контейнеры"
  echo "  down      - Остановить контейнеры"
  echo "  restart   - Перезапустить контейнеры"
  echo "  logs      - Просмотреть логи контейнеров"
  echo "  status    - Проверить статус контейнеров"
  echo ""
  echo "Опции:"
  echo "  --build   - Пересобрать образы при запуске"
  echo "  --volumes - Удалить тома при остановке"
  echo "  --service=<name> - Указать сервис для логов (по умолчанию: app)"
  echo ""
  echo "Примеры:"
  echo "  ./docker/docker-manager.sh dev up"
  echo "  ./docker/docker-manager.sh prod up --build"
  echo "  ./docker/docker-manager.sh stage down --volumes"
  echo "  ./docker/docker-manager.sh dev logs --service=db"
}

# Проверка наличия аргументов
if [ $# -lt 2 ]; then
  show_help
  exit 1
fi

# Парсинг аргументов
ENV=$1
COMMAND=$2
shift 2

# Проверка и нормализация окружения
ENV=$(env_validate_env "$ENV")
if [ $? -ne 0 ]; then
  exit 1
fi

# Настройка окружения
env_setup "$ENV" "$PROJECT_ROOT" "docker" true

# Парсинг дополнительных опций
BUILD=false
REMOVE_VOLUMES=false
SERVICE="app"
ADDITIONAL_PARAMS=""

for arg in "$@"; do
  case $arg in
    --build)
      BUILD=true
      ;;
    --volumes)
      REMOVE_VOLUMES=true
      ;;
    --service=*)
      SERVICE="${arg#*=}"
      ;;
    *)
      ADDITIONAL_PARAMS="$ADDITIONAL_PARAMS $arg"
      ;;
  esac
shift
done

# Выполнение команды
case $COMMAND in
  up)
    docker_compose_up "$ENV" "$PROJECT_ROOT" "$BUILD" "$ADDITIONAL_PARAMS"
    ;;
  down)
    docker_compose_down "$ENV" "$PROJECT_ROOT" "$REMOVE_VOLUMES" "$ADDITIONAL_PARAMS"
    ;;
  restart)
    common_print_header "🔄 Перезапуск контура $(env_get_full_name $ENV)"
    docker_compose_down "$ENV" "$PROJECT_ROOT" false "$ADDITIONAL_PARAMS"
    docker_compose_up "$ENV" "$PROJECT_ROOT" "$BUILD" "$ADDITIONAL_PARAMS"
    ;;
  logs)
    docker_compose_logs "$ENV" "$PROJECT_ROOT" "$SERVICE" true "$ADDITIONAL_PARAMS"
    ;;
  status)
    docker_compose_status "$ENV" "$PROJECT_ROOT" "$ADDITIONAL_PARAMS"
    ;;
  *)
    common_print_error "Неизвестная команда: $COMMAND"
    show_help
    exit 1
    ;;
esac

exit 0
