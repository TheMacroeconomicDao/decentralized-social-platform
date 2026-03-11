#!/bin/bash

# ===================================================
# ud83dude80 GPROD Automation Script
# ===================================================
# u0413u043bu0430u0432u043du044bu0439 u0441u043au0440u043fu0442 u0434u043bu044f u0443u043fu0440u0430u0432u043bu0435u043du0438u044f u0430u0432u0442u043eu043cu0430u0442u0438u0437u0430u0446u0438u0435u0439 u043fu0440u043eu0435u043au0442u0430
#
# u0418u0441u043fu043eu043bu044cu0437u043eu0432u0430u043du0438u0435:
#   ./automation/run.sh <u043au043eu043cu0430u043du0434u0430> [u043au043eu043du0442u0443u0440]
#
# u041au043eu043cu0430u043du0434u044b:
#   env         - u043du0430u0441u0442u0440u043eu0439u043au0430 u043eu043au0440u0443u0436u0435u043du0438u044f
#   run         - u0437u0430u043fu0443u0441u043a u043eu043au0440u0443u0436u0435u043du0438u044f (u043du0430u0441u0442u0440u043eu0439u043au0430 + u0437u0430u043fu0443u0441u043a Docker)
#   stop        - u043eu0441u0442u0430u043du043eu0432u043au0430 u043eu043au0440u0443u0436u0435u043du0438u044f
#   logs        - u043fu0440u043eu0441u043cu043eu0442u0440 u043bu043eu0433u043eu0432
#   test        - u0437u0430u043fu0443u0441u043a u0442u0435u0441u0442u043eu0432
#   interactive - u0438u043du0442u0435u0440u0430u043au0442u0438u0432u043du044bu0439 u0440u0435u0436u0438u043c u0437u0430u043fu0443u0441u043au0430
#
# u041au043eu043du0442u0443u0440u044b:
#   dev, stage, prod, reference

# u041fu043eu043bu0443u0447u0435u043du0438u0435 u0434u0438u0440u0435u043au0442u043eu0440u0438u0439
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../" && pwd)"

# u041fu043eu0434u043au043bu044eu0447u0430u0435u043c u0431u0438u0431u043bu0438u043eu0442u0435u043au0438
source "$SCRIPT_DIR/lib/common-lib.sh"
source "$SCRIPT_DIR/lib/env-lib.sh"
source "$SCRIPT_DIR/lib/docker-lib.sh"
source "$SCRIPT_DIR/lib/menu-lib.sh"

# u0424u0430u0439u043b u0434u043bu044f u0445u0440u0430u043du0435u043du0438u044f u0438u0441u0442u043eu0440u0438u0438 u0437u0430u043fu0443u0441u043au043eu0432
HISTORY_FILE="$PROJECT_ROOT/.run_history"

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043eu0442u043eu0431u0440u0430u0436u0435u043du0438u044f u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430
show_progress() {
  local duration=$1
  local step=0.1
  local progress=0
  local width=40
  
  while [ $(echo "$progress < 1" | bc) -eq 1 ]; do
    local filled=$(echo "$progress * $width" | bc | awk '{printf("%d",$1)}')
    local empty=$(echo "$width - $filled" | bc)
    
    printf "\r["
    printf "%${filled}s" | tr ' ' '#'
    printf "%${empty}s" | tr ' ' ' '
    printf "] %.0f%%" "$(echo "$progress * 100" | bc)"
    
    progress=$(echo "$progress + $step" | bc)
    sleep $(echo "$duration * $step" | bc)
  done
  
  printf "\r[%${width}s] 100%%\n" | tr ' ' '#'
}

# Функция для сохранения выбора в историю
save_to_history() {
  local env=$1
  local mode=$2
  local rebuild=$3
  
  echo "$env:$mode:$rebuild" > "$HISTORY_FILE"
  common_print_info "Выбор сохранен в историю"
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0437u0430u0433u0440u0443u0437u043au0438 u0438u0441u0442u043eu0440u0438u0438
load_from_history() {
  if [ -f "$HISTORY_FILE" ]; then
    local history=$(cat "$HISTORY_FILE")
    local env=$(echo "$history" | cut -d ':' -f 1)
    local mode=$(echo "$history" | cut -d ':' -f 2)
    local rebuild=$(echo "$history" | cut -d ':' -f 3)
    
    if [ -n "$env" ] && [ -n "$mode" ] && [ -n "$rebuild" ]; then
      common_print_info "u0417u0430u0433u0440u0443u0436u0435u043du043e u0438u0437 u0438u0441u0442u043eu0440u0438u0438: u043au043eu043du0442u0443u0440=$env, u0440u0435u0436u0438u043c=$mode, u043fu0435u0440u0435u0441u0431u043eu0440u043au0430=$rebuild"
      echo "$env:$mode:$rebuild"
      return 0
    fi
  fi
  
  echo "dev:run:false"
  return 1
}

# Функция для отображения меню выбора контура
show_env_menu() {
  local default_env="$1"
  
  common_print_header "🌍 Выбор контура"
  
  local options="dev:Окружение разработки;stage:Окружение тестирования;prod:Продакшн окружение;reference:Минимальное окружение"
  local selected=$(menu_show "$options" "$default_env")
  
  echo "$selected"
}

# Функция для отображения меню выбора режима запуска
show_mode_menu() {
  local default_mode="$1"
  
  common_print_header "🚀 Выбор режима запуска"
  
  local options="run:Запуск контейнеров;stop:Остановка контейнеров;restart:Перезапуск контейнеров;logs:Просмотр логов;status:Статус контейнеров"
  local selected=$(menu_show "$options" "$default_mode")
  
  echo "$selected"
}

# Функция для отображения меню выбора пересборки
show_rebuild_menu() {
  local default_rebuild="$1"
  
  common_print_header "🔄 Пересборка образов"
  
  local options="false:Без пересборки;true:С пересборкой образов"
  local selected=$(menu_show "$options" "$default_rebuild")
  
  echo "$selected"
}

# Функция для проверки готовности окружения
check_environment_ready() {
  local env="$1"
  local rebuild="$2"
  
  common_print_header "🔍 Проверка готовности окружения"
  
  # Проверка наличия Docker
  if ! common_check_docker; then
    return 1
  fi
  
  # Проверка наличия образов Docker
  local app_image="gprod-app"
  local app_tag="latest"
  
  # Если не требуется пересборка, проверяем наличие образов
  if [ "$rebuild" != "true" ]; then
    if ! docker_check_image "$app_image" "$app_tag"; then
      common_print_warning "Образ $app_image:$app_tag не найден, будет выполнена автоматическая сборка"
      rebuild="true"
    fi
  fi
  
  # Проверка наличия томов Docker
  local node_modules_volume=$(docker_get_volume_name "$env" "node_modules")
  local db_data_volume=$(docker_get_volume_name "$env" "db_data")
  
  # Создаем тома, если они не существуют
  docker_ensure_volume "$node_modules_volume"
  docker_ensure_volume "$db_data_volume"
  
  # Проверка наличия override файла
  docker_ensure_override_file "$env" "$PROJECT_ROOT"
  
  common_print_success "Окружение готово к запуску"
  return 0
}

# Функция для запуска проекта в интерактивном режиме
run_interactive() {
  # Загрузка последних настроек из истории
  local history=$(load_from_history)
  local default_env=$(echo "$history" | cut -d ':' -f 1)
  local default_mode=$(echo "$history" | cut -d ':' -f 2)
  local default_rebuild=$(echo "$history" | cut -d ':' -f 3)
  
  # Выбор контура
  local env=$(show_env_menu "$default_env")
  if [ -z "$env" ]; then
    common_print_error "Отменено пользователем"
    return 1
  fi
  
  # Выбор режима запуска
  local mode=$(show_mode_menu "$default_mode")
  if [ -z "$mode" ]; then
    common_print_error "Отменено пользователем"
    return 1
  fi
  
  # Выбор пересборки для режимов, которые это поддерживают
  local rebuild="false"
  if [ "$mode" = "run" ] || [ "$mode" = "restart" ]; then
    rebuild=$(show_rebuild_menu "$default_rebuild")
    if [ -z "$rebuild" ]; then
      common_print_error "Отменено пользователем"
      return 1
    fi
  fi
  
  # Сохранение выбора в историю
  save_to_history "$env" "$mode" "$rebuild"
  
  # Настройка окружения
  env_setup "$env" "$PROJECT_ROOT" "docker"
  
  # Проверка готовности окружения для режимов, которые запускают контейнеры
  if [ "$mode" = "run" ] || [ "$mode" = "restart" ]; then
    check_environment_ready "$env" "$rebuild"
  fi
  
  # Выполнение выбранного действия
  case "$mode" in
    run)
      common_print_header "🚀 Запуск контура $(env_get_full_name $env)"
      docker_compose_up "$env" "$PROJECT_ROOT" "$rebuild"
      ;;
    stop)
      common_print_header "📦 Остановка контура $(env_get_full_name $env)"
      docker_compose_down "$env" "$PROJECT_ROOT" false
      ;;
    restart)
      common_print_header "🔄 Перезапуск контура $(env_get_full_name $env)"
      docker_compose_down "$env" "$PROJECT_ROOT" false
      docker_compose_up "$env" "$PROJECT_ROOT" "$rebuild"
      ;;
    logs)
      common_print_header "📋 Просмотр логов контура $(env_get_full_name $env)"
      docker_compose_logs "$env" "$PROJECT_ROOT"
      ;;
    status)
      docker_compose_status "$env" "$PROJECT_ROOT"
      ;;
    *)
      common_print_error "Неизвестный режим: $mode"
      return 1
      ;;
  esac
  
  return 0
}
# Функция для отображения справки
show_help() {
  common_print_header "🚀 GPROD Automation Script - Справка"
  echo "Использование: ./automation/run.sh <команда> [контур] [опции]"
  echo ""
  echo "Команды:"
  echo "  env         - настройка окружения"
  echo "  run         - запуск окружения (настройка + запуск Docker)"
  echo "  stop        - остановка окружения"
  echo "  logs        - просмотр логов"
  echo "  test        - запуск тестов в Docker"
  echo "  interactive - интерактивный режим запуска"
  echo ""
  echo "Контуры:"
  echo "  dev        - окружение разработки"
  echo "  stage      - окружение тестирования"
  echo "  prod       - продакшн окружение"
  echo "  reference  - минимальное окружение"
  echo ""
  echo "Опции:"
  echo "  --build    - пересборка образов при запуске"
  echo "  --volumes  - удаление томов при остановке"
  echo ""
  echo "Опции для тестов:"
  echo "  unit       - запуск только unit-тестов"
  echo "  e2e        - запуск только e2e-тестов"
  echo ""
  echo "Примеры:"
  echo "  ./automation/run-new.sh run dev"
  echo "  ./automation/run-new.sh run prod --build"
  echo "  ./automation/run-new.sh stop stage --volumes"
  echo "  ./automation/run-new.sh test dev"
  echo "  ./automation/run-new.sh test dev unit"
  echo "  ./automation/run-new.sh interactive"
}

# Основная логика скрипта
# Проверка наличия аргументов
if [ $# -eq 0 ]; then
  show_help
  exit 1
fi

# Парсинг аргументов
COMMAND=$1
shift

# Обработка команды interactive отдельно, так как она не требует контура
if [ "$COMMAND" = "interactive" ]; then
  run_interactive
  exit $?
fi

# Проверка наличия аргумента контура для остальных команд
if [ $# -eq 0 ]; then
  common_print_error "Не указан контур"
  show_help
  exit 1
fi

# Получение контура и проверка его корректности
ENV=$1
shift
ENV=$(env_validate_env "$ENV")
if [ $? -ne 0 ]; then
  exit 1
fi

# Парсинг дополнительных опций
BUILD=false
REMOVE_VOLUMES=false
ADDITIONAL_PARAMS=""

for arg in "$@"; do
  case $arg in
    --build)
      BUILD=true
      ;;
    --volumes)
      REMOVE_VOLUMES=true
      ;;
    *)
      ADDITIONAL_PARAMS="$ADDITIONAL_PARAMS $arg"
      ;;
  esac
shift
done

# Выполнение команды
case $COMMAND in
  env)
    common_print_header "🌍 Настройка окружения $(env_get_full_name $ENV)"
    env_setup "$ENV" "$PROJECT_ROOT" "docker"
    ;;
  run)
    common_print_header "🚀 Запуск контура $(env_get_full_name $ENV)"
    env_setup "$ENV" "$PROJECT_ROOT" "docker"
    check_environment_ready "$ENV" "$BUILD"
    docker_compose_up "$ENV" "$PROJECT_ROOT" "$BUILD" "$ADDITIONAL_PARAMS"
    ;;
  stop)
    common_print_header "📦 Остановка контура $(env_get_full_name $ENV)"
    docker_compose_down "$ENV" "$PROJECT_ROOT" "$REMOVE_VOLUMES" "$ADDITIONAL_PARAMS"
    ;;
  logs)
    common_print_header "📋 Просмотр логов контура $(env_get_full_name $ENV)"
    docker_compose_logs "$ENV" "$PROJECT_ROOT" "app" true "$ADDITIONAL_PARAMS"
    ;;
  test)
    common_print_header "🧪 Запуск тестов для контура $(env_get_full_name $ENV)"
    env_setup "$ENV" "$PROJECT_ROOT" "docker"
    
    # Определяем тип тестов из параметров
    test_type="all"
    
    for param in $ADDITIONAL_PARAMS; do
      case $param in
        "unit"|"e2e")
          test_type="$param"
          ;;
      esac
    done
    
    # Проверяем статус контейнера app
    common_print_step "Проверка статуса контейнера app..."
    compose_file=$(env_get_compose_file "$ENV" "$PROJECT_ROOT")
    app_status=$(docker compose -f "$compose_file" ps app --format "table" 2>/dev/null | grep "running" || echo "")
    
    if [ -z "$app_status" ]; then
      common_print_warning "Контейнер app не запущен. Запускаем автоматически..."
      docker_compose_up "$ENV" "$PROJECT_ROOT" false
      
      # Ждём готовности контейнера
      retries=30
      while [ $retries -gt 0 ]; do
        app_status=$(docker compose -f "$compose_file" ps app --format "table" 2>/dev/null | grep "running" || echo "")
        if [ -n "$app_status" ]; then
          break
        fi
        common_print_step "Ожидание запуска контейнера app... ($retries)"
        sleep 2
        retries=$((retries - 1))
      done
      
      if [ $retries -eq 0 ]; then
        common_print_error "Не удалось запустить контейнер app"
        common_print_step "Логи контейнера app:"
        docker compose -f "$compose_file" logs app --tail=50
        exit 1
      fi
    fi
    
    # Запуск тестов в Docker контейнере
    common_print_step "Запуск тестов в Docker контейнере..."
    if [ "$test_type" = "unit" ]; then
      cd "$PROJECT_ROOT" && docker compose -f "$compose_file" exec app pnpm run test
    elif [ "$test_type" = "e2e" ]; then
      cd "$PROJECT_ROOT" && docker compose -f "$compose_file" exec app pnpm run test:e2e
    else
      # Запускаем все тесты
      cd "$PROJECT_ROOT" && docker compose -f "$compose_file" exec app pnpm run test
      if [ $? -eq 0 ]; then
        cd "$PROJECT_ROOT" && docker compose -f "$compose_file" exec app pnpm run test:e2e
      fi
    fi
    
    if [ $? -eq 0 ]; then
      common_print_success "Тесты успешно пройдены"
    else
      common_print_error "Тесты завершились с ошибками"
      exit 1
    fi
    ;;
  *)
    common_print_error "Неизвестная команда: $COMMAND"
    show_help
    exit 1
    ;;
esac

exit 0
