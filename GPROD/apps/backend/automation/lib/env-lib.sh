#!/bin/bash

# ===================================================
# 🌟 GPROD Environment Library
# ===================================================
# Библиотека функций для работы с окружением проекта
#
# Использование:
#   source ./automation/lib/env-lib.sh

# Подключаем общую библиотеку, если она еще не подключена
if [ -z "$COMMON_NC" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "$SCRIPT_DIR/common-lib.sh"
fi

# Константы для контуров окружения
ENV_DEV="dev"
ENV_STAGE="stage"
ENV_PROD="prod"
ENV_REFERENCE="reference"

# Функция для проверки корректности контура
env_validate_env() {
  local env=$1
  
  case $env in
    $ENV_DEV|development)
      echo "$ENV_DEV"
      return 0
      ;;
    $ENV_STAGE|staging)
      echo "$ENV_STAGE"
      return 0
      ;;
    $ENV_PROD|production)
      echo "$ENV_PROD"
      return 0
      ;;
    $ENV_REFERENCE)
      echo "$ENV_REFERENCE"
      return 0
      ;;
    *)
      common_print_error "Некорректный контур: $env"
      common_print_info "Поддерживаемые контуры: $ENV_DEV, $ENV_STAGE, $ENV_PROD, $ENV_REFERENCE"
      return 1
      ;;
  esac
}

# Функция для получения полного имени контура
env_get_full_name() {
  local env=$1
  
  case $env in
    $ENV_DEV)
      echo "development"
      ;;
    $ENV_STAGE)
      echo "staging"
      ;;
    $ENV_PROD)
      echo "production"
      ;;
    $ENV_REFERENCE)
      echo "reference"
      ;;
    *)
      echo "unknown"
      ;;
  esac
}

# Функция для получения порта по умолчанию для контура
env_get_default_port() {
  local env=$1
  
  case $env in
    $ENV_DEV)
      echo "3008"
      ;;
    $ENV_STAGE)
      echo "3003"
      ;;
    $ENV_PROD)
      echo "3007"
      ;;
    $ENV_REFERENCE)
      echo "3000"
      ;;
    *)
      echo "3000"
      ;;
  esac
}

# Функция для получения пути к файлу docker-compose для контура
env_get_compose_file() {
  local env=$1
  local project_root=$2
  
  case $env in
    $ENV_DEV)
      echo "$project_root/docker/docker-compose.dev.yml"
      ;;
    $ENV_STAGE)
      echo "$project_root/docker/docker-compose.stage.yml"
      ;;
    $ENV_PROD)
      echo "$project_root/docker/docker-compose.prod.yml"
      ;;
    $ENV_REFERENCE)
      echo "$project_root/docker/docker-compose.reference.yml"
      ;;
    *)
      echo ""
      ;;
  esac
}

# Функция для получения пути к файлу окружения
env_get_env_file() {
  local env=$1
  local project_root=$2
  local env_full=$(env_get_full_name "$env")
  
  echo "$project_root/.env.$env_full"
}

# Функция для проверки и создания файла окружения
env_ensure_env_file() {
  local env=$1
  local project_root=$2
  local env_file=$(env_get_env_file "$env" "$project_root")
  local env_full=$(env_get_full_name "$env")
  local port=$(env_get_default_port "$env")
  
  # Проверка наличия файла окружения
  if [ ! -f "$env_file" ]; then
    common_print_warning "Файл окружения $env_file не найден"
    
    # Пытаемся создать файл из шаблона
    if [ -f "$project_root/.env-templates/.env.$env_full" ]; then
      common_print_step "Создаем из шаблона..."
      cp "$project_root/.env-templates/.env.$env_full" "$env_file"
      common_print_success "Создан файл $env_file из шаблона"
    else
      common_print_step "Создаем базовый файл окружения..."
      
      # Создаем минимальный файл окружения
      echo "NODE_ENV=$env_full" > "$env_file"
      echo "PORT=$port" >> "$env_file"
      echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_${env}" >> "$env_file"
      echo "JWT_SECRET=${env}_secret_key" >> "$env_file"
      echo "RUNNING_IN_DOCKER=true" >> "$env_file"
      
      common_print_success "Создан базовый файл $env_file"
    fi
  fi
  
  return 0
}

# Функция для создания символической ссылки .env
env_create_symlink() {
  local env=$1
  local project_root=$2
  local env_file=$(env_get_env_file "$env" "$project_root")
  
  common_print_step "Создание символической ссылки .env -> $env_file..."
  ln -sf "$env_file" "$project_root/.env"
  common_print_success "Символическая ссылка .env создана"
  
  return 0
}

# Функция для адаптации переменных окружения для Docker или локального запуска
env_adapt_for_mode() {
  local env=$1
  local project_root=$2
  local mode=$3 # docker или local
  local env_file=$(env_get_env_file "$env" "$project_root")
  
  if [ ! -f "$env_file" ]; then
    common_print_error "Файл окружения $env_file не найден"
    return 1
  fi
  
  common_print_step "Адаптация переменных окружения для режима $mode..."
  
  # Определяем систему для правильного использования sed
  local system=$(common_detect_system)
  local sed_inplace=()
  
  if [ "$system" = "macos" ]; then
    sed_inplace=(sed -i "")
  else
    sed_inplace=(sed -i)
  fi
  
  if [ "$mode" = "docker" ]; then
    # Адаптация для Docker
    "${sed_inplace[@]}" 's/RUNNING_IN_DOCKER=.*/RUNNING_IN_DOCKER=true/' "$env_file"
    "${sed_inplace[@]}" 's|DATABASE_URL=.*|DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_'"$env"'|' "$env_file"
  else
    # Адаптация для локального запуска
    "${sed_inplace[@]}" 's/RUNNING_IN_DOCKER=.*/RUNNING_IN_DOCKER=false/' "$env_file"
    "${sed_inplace[@]}" 's|DATABASE_URL=.*|DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gprod_'"$env"'|' "$env_file"
  fi
  
  common_print_success "Переменные окружения адаптированы для режима $mode"
  return 0
}

# Функция для настройки окружения
env_setup() {
  local env=$1
  local project_root=$2
  local mode=${3:-docker} # docker или local
  local silent=${4:-false}
  
  # Валидация контура
  env=$(env_validate_env "$env")
  if [ $? -ne 0 ]; then
    return 1
  fi
  
  # Вывод информации о контуре
  if [ "$silent" != "true" ]; then
    common_print_header "🌟 Настройка окружения $(env_get_full_name $env)"
    common_print_info "Контур: $(env_get_full_name $env)"
    common_print_info "Режим: $mode"
  fi
  
  # Проверка и создание файла окружения
  env_ensure_env_file "$env" "$project_root"
  
  # Создание символической ссылки
  env_create_symlink "$env" "$project_root"
  
  # Адаптация переменных окружения
  env_adapt_for_mode "$env" "$project_root" "$mode"
  
  if [ "$silent" != "true" ]; then
    common_print_success "Окружение $(env_get_full_name $env) настроено для режима $mode"
  fi
  
  return 0
}

# Экспортируем функции для использования в других скриптах
export -f env_validate_env env_get_full_name env_get_default_port env_get_compose_file
export -f env_get_env_file env_ensure_env_file env_create_symlink env_adapt_for_mode env_setup
