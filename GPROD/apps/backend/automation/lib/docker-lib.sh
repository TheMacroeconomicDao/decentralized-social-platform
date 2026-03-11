#!/bin/bash

# ===================================================
# 🚀 GPROD Docker Library
# ===================================================
# Библиотека функций для работы с Docker и Docker Compose
#
# Использование:
#   source ./automation/lib/docker-lib.sh

# Подключаем общую библиотеку, если она еще не подключена
if [ -z "$COMMON_NC" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "$SCRIPT_DIR/common-lib.sh"
fi

# Подключаем библиотеку окружения, если она еще не подключена
if [ -z "$ENV_DEV" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "$SCRIPT_DIR/env-lib.sh"
fi

# Константы для именования томов и контейнеров
DOCKER_VOLUME_PREFIX="gprod"
DOCKER_CONTAINER_PREFIX="gprod"
DOCKER_NETWORK_PREFIX="gprod"

# Функция для проверки наличия образа Docker
docker_check_image() {
  local image_name=$1
  local image_tag=$2
  
  common_print_step "Проверка наличия образа $image_name:$image_tag..."
  
  # Используем docker image ls с фильтрацией для более точной проверки
  if docker image ls "$image_name:$image_tag" --format "{{.Repository}}:{{.Tag}}" | grep -q "$image_name:$image_tag"; then
    common_print_success "Найден существующий образ $image_name:$image_tag"
    return 0  # Образ найден
  else
    # Дополнительная проверка через docker image inspect для надежности
    if docker image inspect "$image_name:$image_tag" &>/dev/null; then
      common_print_success "Найден существующий образ $image_name:$image_tag"
      return 0  # Образ найден
    else
      common_print_info "Образ $image_name:$image_tag не найден"
      return 1  # Образ не найден
    fi
  fi
}

# Функция для проверки наличия контейнера Docker
docker_check_container() {
  local container_name=$1
  local running_only=${2:-false}
  
  common_print_step "Проверка наличия контейнера $container_name..."
  
  if [ "$running_only" = "true" ]; then
    # Проверка только запущенных контейнеров
    if docker ps | grep -q "$container_name"; then
      common_print_success "Контейнер $container_name запущен"
      return 0  # Контейнер запущен
    else
      common_print_info "Контейнер $container_name не запущен"
      return 1  # Контейнер не запущен
    fi
  else
    # Проверка всех контейнеров (запущенных и остановленных)
    if docker ps -a | grep -q "$container_name"; then
      common_print_success "Контейнер $container_name существует"
      return 0  # Контейнер существует
    else
      common_print_info "Контейнер $container_name не найден"
      return 1  # Контейнер не найден
    fi
  fi
}

# Функция для получения стандартизированного имени тома
docker_get_volume_name() {
  local env=$1
  local purpose=$2
  
  echo "${DOCKER_VOLUME_PREFIX}_${env}_${purpose}"
}

# Функция для получения стандартизированного имени контейнера
docker_get_container_name() {
  local env=$1
  local service=$2
  
  echo "${DOCKER_CONTAINER_PREFIX}_${env}_${service}"
}

# Функция для получения стандартизированного имени сети
docker_get_network_name() {
  local env=$1
  
  echo "${DOCKER_NETWORK_PREFIX}_${env}"
}

# Функция для проверки наличия тома Docker
docker_check_volume() {
  local volume_name=$1
  
  common_print_step "Проверка наличия тома $volume_name..."
  
  if docker volume ls | grep -q "$volume_name"; then
    common_print_success "Найден существующий том $volume_name"
    return 0  # Том найден
  else
    common_print_info "Том $volume_name не найден"
    return 1  # Том не найден
  fi
}

# Функция для создания тома Docker, если он не существует
docker_ensure_volume() {
  local volume_name=$1
  
  if ! docker_check_volume "$volume_name"; then
    common_print_step "Создание тома $volume_name..."
    
    if docker volume create "$volume_name" > /dev/null; then
      common_print_success "Том $volume_name создан"
      return 0
    else
      common_print_error "Не удалось создать том $volume_name"
      return 1
    fi
  fi
  
  return 0
}

# Функция для получения пути к файлу docker-compose.override.yml
docker_get_override_file() {
  local env=$1
  local project_root=$2
  
  echo "$project_root/docker/docker-compose.$env.override.yml"
}

# Функция для проверки наличия файла docker-compose.override.yml
docker_check_override_file() {
  local env=$1
  local project_root=$2
  local override_file=$(docker_get_override_file "$env" "$project_root")
  
  if [ -f "$override_file" ]; then
    common_print_success "Найден файл $override_file"
    return 0
  else
    common_print_info "Файл $override_file не найден"
    return 1
  fi
}

# Функция для создания файла docker-compose.override.yml, если он не существует
docker_ensure_override_file() {
  local env=$1
  local project_root=$2
  local override_file=$(docker_get_override_file "$env" "$project_root")
  
  if ! docker_check_override_file "$env" "$project_root"; then
    common_print_step "Создание файла $override_file..."
    
    # Создаем директорию, если она не существует
    mkdir -p "$(dirname "$override_file")"
    
    # Создаем базовый файл override
    cat > "$override_file" << EOF
version: '3.8'

services:
  app:
    volumes:
      - node_modules:/app/node_modules

volumes:
  node_modules:
    name: $(docker_get_volume_name "$env" "node_modules")
    external: false
EOF
    
    common_print_success "Файл $override_file создан"
  fi
  
  return 0
}

# Функция для запуска контейнеров с помощью docker-compose
docker_compose_up() {
  local env=$1
  local project_root=$2
  local rebuild=${3:-false}
  local additional_params=${4:-""}
  
  # Получаем имя файла docker-compose для указанного окружения
  local compose_file=$(env_get_compose_file "$env" "$project_root")
  local override_file=$(docker_get_override_file "$env" "$project_root")
  
  # Проверяем наличие файлов
  if [ ! -f "$compose_file" ]; then
    common_print_error "Файл $compose_file не найден"
    return 1
  fi
  
  # Создаем override файл, если его нет
  docker_ensure_override_file "$env" "$project_root"
  
  # Создаем именованные тома для данного окружения
  docker_ensure_volume "$(docker_get_volume_name "$env" "node_modules")"
  docker_ensure_volume "$(docker_get_volume_name "$env" "db_data")"
  
  # Формируем команду docker-compose
  local cmd="docker compose -f \"$compose_file\" -f \"$override_file\" $additional_params"
  
  # Запускаем контейнеры
  common_print_header "🚀 Запуск контура $(env_get_full_name $env)"
  
  if [ "$rebuild" = "true" ]; then
    common_print_step "Пересборка и запуск контейнеров..."
    cd "$project_root" && eval "$cmd up -d --build"
  else
    common_print_step "Запуск контейнеров..."
    cd "$project_root" && eval "$cmd up -d"
  fi
  
  if [ $? -eq 0 ]; then
    common_print_success "Контейнеры успешно запущены"
    return 0
  else
    common_print_error "Не удалось запустить контейнеры"
    return 1
  fi
}

# Функция для остановки контейнеров с помощью docker-compose
docker_compose_down() {
  local env=$1
  local project_root=$2
  local remove_volumes=${3:-false}
  local additional_params=${4:-""}
  
  # Получаем имя файла docker-compose для указанного окружения
  local compose_file=$(env_get_compose_file "$env" "$project_root")
  local override_file=$(docker_get_override_file "$env" "$project_root")
  
  # Проверяем наличие файлов
  if [ ! -f "$compose_file" ]; then
    common_print_error "Файл $compose_file не найден"
    return 1
  fi
  
  # Формируем команду docker-compose
  local cmd="docker compose -f \"$compose_file\" -f \"$override_file\" $additional_params"
  
  # Останавливаем контейнеры
  common_print_header "📦 Остановка контура $(env_get_full_name $env)"
  
  if [ "$remove_volumes" = "true" ]; then
    common_print_step "Остановка контейнеров и удаление томов..."
    cd "$project_root" && eval "$cmd down -v"
  else
    common_print_step "Остановка контейнеров..."
    cd "$project_root" && eval "$cmd down"
  fi
  
  if [ $? -eq 0 ]; then
    common_print_success "Контейнеры успешно остановлены"
    return 0
  else
    common_print_error "Не удалось остановить контейнеры"
    return 1
  fi
}

# Функция для просмотра логов контейнеров
docker_compose_logs() {
  local env=$1
  local project_root=$2
  local service=${3:-"app"}
  local follow=${4:-true}
  local additional_params=${5:-""}
  
  # Получаем имя файла docker-compose для указанного окружения
  local compose_file=$(env_get_compose_file "$env" "$project_root")
  local override_file=$(docker_get_override_file "$env" "$project_root")
  
  # Проверяем наличие файлов
  if [ ! -f "$compose_file" ]; then
    common_print_error "Файл $compose_file не найден"
    return 1
  fi
  
  # Формируем команду docker-compose
  local cmd="docker compose -f \"$compose_file\" -f \"$override_file\" $additional_params"
  
  # Просмотр логов
  common_print_header "📋 Просмотр логов контура $(env_get_full_name $env)"
  
  if [ "$follow" = "true" ]; then
    common_print_step "Просмотр логов сервиса $service в режиме реального времени..."
    cd "$project_root" && eval "$cmd logs -f $service"
  else
    common_print_step "Просмотр логов сервиса $service..."
    cd "$project_root" && eval "$cmd logs $service"
  fi
  
  return 0
}

# Функция для проверки статуса контейнеров
docker_compose_status() {
  local env=$1
  local project_root=$2
  local additional_params=${3:-""}
  
  # Получаем имя файла docker-compose для указанного окружения
  local compose_file=$(env_get_compose_file "$env" "$project_root")
  local override_file=$(docker_get_override_file "$env" "$project_root")
  
  # Проверяем наличие файлов
  if [ ! -f "$compose_file" ]; then
    common_print_error "Файл $compose_file не найден"
    return 1
  fi
  
  # Формируем команду docker-compose
  local cmd="docker compose -f \"$compose_file\" -f \"$override_file\" $additional_params"
  
  # Просмотр статуса
  common_print_header "📊 Статус контейнеров контура $(env_get_full_name $env)"
  cd "$project_root" && eval "$cmd ps"
  
  return 0
}

# Экспортируем функции для использования в других скриптах
export -f docker_get_volume_name docker_get_container_name docker_get_network_name
export -f docker_check_image docker_check_container docker_check_volume docker_ensure_volume
export -f docker_get_override_file docker_check_override_file docker_ensure_override_file
export -f docker_compose_up docker_compose_down docker_compose_logs docker_compose_status
