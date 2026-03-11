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
  echo "  test        - запуск тестов"
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
  echo "Примеры:"
  echo "  ./automation/run.sh run dev"
  echo "  ./automation/run.sh run prod --build"
  echo "  ./automation/run.sh stop stage --volumes"
  echo "  ./automation/run.sh interactive"
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
    common_print_step "Запуск тестов..."
    cd "$PROJECT_ROOT" && docker compose -f "$(env_get_compose_file $ENV $PROJECT_ROOT)" exec app npm test
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
