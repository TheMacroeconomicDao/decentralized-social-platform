#!/bin/bash

# ===================================================
# 🛠️ GPROD Common Library
# ===================================================
# Общие функции и утилиты для всех скриптов автоматизации
#
# Использование:
#   source ./automation/lib/common-lib.sh

# Цвета для вывода
COMMON_GREEN='\033[0;32m'
COMMON_RED='\033[0;31m'
COMMON_YELLOW='\033[1;33m'
COMMON_BLUE='\033[0;34m'
COMMON_PURPLE='\033[0;35m'
COMMON_CYAN='\033[0;36m'
COMMON_WHITE='\033[1;37m'
COMMON_BOLD='\033[1m'
COMMON_BG_GREEN='\033[42m'
COMMON_BG_BLUE='\033[44m'
COMMON_BG_CYAN='\033[46m'
COMMON_BG_GRAY='\033[100m'
COMMON_NC='\033[0m' # No Color

# Символы для вывода
COMMON_CHECK_MARK="${COMMON_GREEN}✓${COMMON_NC}"
COMMON_CROSS_MARK="${COMMON_RED}✗${COMMON_NC}"
COMMON_ARROW="${COMMON_BLUE}→${COMMON_NC}"
COMMON_STAR="${COMMON_YELLOW}★${COMMON_NC}"
COMMON_INFO="${COMMON_CYAN}ℹ${COMMON_NC}"

# Экспортируем цвета для использования в других скриптах
export COMMON_GREEN COMMON_RED COMMON_YELLOW COMMON_BLUE COMMON_PURPLE COMMON_CYAN
export COMMON_WHITE COMMON_BOLD COMMON_BG_GREEN COMMON_BG_BLUE COMMON_BG_CYAN COMMON_BG_GRAY COMMON_NC
export COMMON_CHECK_MARK COMMON_CROSS_MARK COMMON_ARROW COMMON_STAR COMMON_INFO

# Функции для вывода
common_print_header() {
  echo -e "\n${COMMON_WHITE}${COMMON_BOLD}$1${COMMON_NC}\n"
}

common_print_subheader() {
  echo -e "\n${COMMON_CYAN}$1${COMMON_NC}"
}

common_print_success() {
  echo -e "${COMMON_CHECK_MARK} ${COMMON_GREEN}$1${COMMON_NC}"
}

common_print_error() {
  echo -e "${COMMON_CROSS_MARK} ${COMMON_RED}$1${COMMON_NC}"
}

common_print_warning() {
  echo -e "${COMMON_STAR} ${COMMON_YELLOW}$1${COMMON_NC}"
}

common_print_info() {
  echo -e "${COMMON_INFO} ${COMMON_BLUE}$1${COMMON_NC}"
}

common_print_step() {
  echo -e "${COMMON_ARROW} ${COMMON_PURPLE}$1${COMMON_NC}"
}

common_print_hr() {
  echo -e "${COMMON_CYAN}----------------------------------------${COMMON_NC}"
}

# Функция для проверки наличия команды
common_check_command() {
  local cmd=$1
  local install_msg=$2
  
  if ! command -v "$cmd" &> /dev/null; then
    common_print_error "Команда '$cmd' не найдена"
    if [ -n "$install_msg" ]; then
      common_print_info "$install_msg"
    fi
    return 1
  fi
  
  return 0
}

# Функция для определения операционной системы
common_detect_system() {
  if [[ "$(uname)" == "Darwin" ]]; then
    echo "macos"
  elif [[ "$(uname)" == "Linux" ]]; then
    echo "linux"
  else
    echo "unknown"
  fi
}

# Функция для проверки наличия Docker
common_check_docker() {
  common_print_step "Проверка наличия Docker..."
  
  if ! common_check_command "docker" "Установите Docker: https://docs.docker.com/get-docker/"; then
    return 1
  fi
  
  if ! docker info &> /dev/null; then
    common_print_error "Docker не запущен или нет прав доступа"
    common_print_info "Убедитесь, что Docker запущен и у вас есть права на его использование"
    return 1
  fi
  
  common_print_success "Docker установлен и работает"
  return 0
}

# Функция для проверки наличия pnpm
common_check_pnpm() {
  common_print_step "Проверка наличия pnpm..."
  
  if ! common_check_command "pnpm" "Установите pnpm: npm install -g pnpm"; then
    return 1
  fi
  
  common_print_success "pnpm установлен"
  return 0
}

# Функция для проверки наличия Node.js
common_check_node() {
  common_print_step "Проверка наличия Node.js..."
  
  if ! common_check_command "node" "Установите Node.js: https://nodejs.org/"; then
    return 1
  fi
  
  local node_version=$(node -v | cut -d 'v' -f 2)
  local major_version=$(echo "$node_version" | cut -d '.' -f 1)
  
  if [ "$major_version" -lt 16 ]; then
    common_print_warning "Версия Node.js ($node_version) устарела. Рекомендуется использовать Node.js 16 или выше."
  else
    common_print_success "Node.js $node_version установлен"
  fi
  
  return 0
}

# Экспортируем функции для использования в других скриптах
export -f common_print_header common_print_subheader common_print_success common_print_error
export -f common_print_warning common_print_info common_print_step common_print_hr
export -f common_check_command common_detect_system common_check_docker common_check_pnpm common_check_node
