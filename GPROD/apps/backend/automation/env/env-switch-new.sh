#!/bin/bash

# ===================================================
# 🌟 GPROD Environment Switcher Pro
# ===================================================
# Интеллектуальное переключение между контурами окружения
# Версия 2.0
# 
# Функциональность:
# - Автоматическое определение системы (MacOS/Linux)
# - Автоматическое создание файлов окружения из шаблонов
# - Адаптация для локальной разработки или Docker
# - Интеллектуальный выбор docker-compose файла
# - Проверка зависимостей и автокоррекция ошибок
# - Запуск приложения в выбранном режиме

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

# Символы для вывода
CHECK_MARK="${GREEN}✓${NC}"
CROSS_MARK="${RED}✗${NC}"
ARROW="${BLUE}→${NC}"
STAR="${YELLOW}★${NC}"
INFO="${CYAN}ℹ${NC}"

# Функции для вывода
print_header() {
    echo -e "\n${WHITE}${BOLD}$1${NC}\n"
}

print_subheader() {
    echo -e "\n${CYAN}$1${NC}"
}

print_success() {
    echo -e "${CHECK_MARK} ${GREEN}$1${NC}"
}

print_error() {
    echo -e "${CROSS_MARK} ${RED}$1${NC}"
}

print_warning() {
    echo -e "${STAR} ${YELLOW}$1${NC}"
}

print_info() {
    echo -e "${INFO} ${BLUE}$1${NC}"
}

print_step() {
    echo -e "${ARROW} ${PURPLE}$1${NC}"
}

print_hr() {
    echo -e "${CYAN}────────────────────────────────────────────────────${NC}"
}

# Определение системы
detect_system() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS_TYPE="MacOS"
        SED_INPLACE=("sed" "-i" "")
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS_TYPE="Linux"
        SED_INPLACE=("sed" "-i")
    else
        OS_TYPE="Unknown"
        SED_INPLACE=("sed" "-i")
        print_warning "Неизвестная ОС: $OSTYPE. Используем настройки Linux."
    fi
    print_info "Операционная система: ${BOLD}$OS_TYPE${NC}"
}

# Проверка наличия Docker
check_docker() {
    if command -v docker &> /dev/null; then
        DOCKER_AVAILABLE=true
        
        # Проверяем, запущен ли Docker демон
        if docker info &> /dev/null; then
            print_success "Docker запущен и готов к использованию"
        else
            print_warning "Docker установлен, но демон не запущен"
            DOCKER_AVAILABLE=false
        fi
    else
        DOCKER_AVAILABLE=false
        print_warning "Docker не найден в системе"
    fi
    
    # Auto-set Docker mode based on availability
    if [ "$USE_DOCKER" = "" ]; then
        USE_DOCKER=$DOCKER_AVAILABLE
    fi
}

# Проверка наличия pnpm
check_pnpm() {
    if command -v pnpm &> /dev/null; then
        PNPM_AVAILABLE=true
        print_success "pnpm доступен в системе"
    else
        PNPM_AVAILABLE=false
        print_warning "pnpm не найден, будем использовать npm"
    fi
}

# Функция для адаптации DATABASE_URL и других параметров
adapt_for_mode() {
    local env_file=$1
    local is_docker=$2
    
    if [ ! -f "$env_file" ]; then
        print_error "Файл $env_file не существует"
        return 1
    fi
    
    if [ "$is_docker" = true ]; then
        # Для Docker (db:5432)
        print_step "Адаптируем $env_file для работы в Docker..."
        "${SED_INPLACE[@]}" 's/localhost:5432/db:5432/g' "$env_file"
        "${SED_INPLACE[@]}" 's/RUNNING_IN_DOCKER=false/RUNNING_IN_DOCKER=true/g' "$env_file"
    else
        # Для локальной разработки (localhost:5432)
        print_step "Адаптируем $env_file для локальной разработки..."
        "${SED_INPLACE[@]}" 's/db:5432/localhost:5432/g' "$env_file"
        "${SED_INPLACE[@]}" 's/RUNNING_IN_DOCKER=true/RUNNING_IN_DOCKER=false/g' "$env_file"
    fi
    
    # MacOS fix for sed
    if [ "$OS_TYPE" = "MacOS" ]; then
        rm -f "${env_file}.bak" 2>/dev/null
    fi
    
    print_success "Файл $env_file успешно адаптирован"
}

# Функция для проверки и создания .env файла из шаблона
ensure_env_file() {
    local env_full=$1
    local env_file=".env.$env_full"
    local template=".env-templates/$env_file"
    
    if [ ! -f "$env_file" ]; then
        print_warning "Файл $env_file не найден"
        
        if [ -f "$template" ]; then
            print_step "Создаем из шаблона..."
            cp "$template" "$env_file"
            print_success "Файл $env_file создан из шаблона"
        else
            print_warning "Шаблон $template не найден"
            print_step "Создаем базовый файл $env_file..."
            
            # Создаем минимальный .env файл
            echo "NODE_ENV=$env_full" > "$env_file"
            echo "PORT=$(get_default_port $env_full)" >> "$env_file"
            echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_${env_full}" >> "$env_file"
            echo "JWT_SECRET=${env_full}_secret_key" >> "$env_file"
            echo "RUNNING_IN_DOCKER=$([ "$USE_DOCKER" = true ] && echo "true" || echo "false")" >> "$env_file"
            
            print_success "Создан базовый файл $env_file"
            print_warning "Рекомендуется дополнить его необходимыми переменными"
        fi
    else
        print_success "Файл $env_file уже существует"
    fi
    
    return 0
}

# Получение порта по умолчанию для контура
get_default_port() {
    local env=$1
    
    case $env in
        development)
            echo "3008"
            ;;
        staging)
            echo "3003"
            ;;
        production)
            echo "3007"
            ;;
        test)
            echo "3009"
            ;;
        *)
            echo "3000"
            ;;
    esac
}

# Получает порт из .env файла
get_port_from_env() {
    local env_file=$1
    local default_port=$2
    
    if [ -f "$env_file" ]; then
        PORT=$(grep -E "^PORT=" "$env_file" | cut -d '=' -f2)
        if [ -z "$PORT" ]; then
            echo $default_port
        else
            echo $PORT
        fi
    else
        echo $default_port
    fi
}

# Функция запуска docker compose с правильным файлом
run_docker_compose() {
    local env=$1
    local compose_file=$2
    
    # Проверка существования файла
    if [ ! -f "$compose_file" ]; then
        print_warning "Файл $compose_file не найден"
        
        # Ищем альтернативные файлы
        if [ -f "docker-compose.reference.yml" ]; then
            compose_file="docker-compose.reference.yml"
            print_info "Используем docker-compose.reference.yml"
        elif [ -f "docker-compose.yml" ]; then
            compose_file="docker-compose.yml"
            print_info "Используем docker-compose.yml"
        else
            print_error "Не найдено подходящих docker-compose файлов"
            return 1
        fi
    fi
    
    # Остановка всех запущенных контейнеров
    print_step "Останавливаем запущенные контейнеры..."
    docker compose -f "$compose_file" down &> /dev/null
    
    # Запуск с правильным файлом
    print_step "Запускаем контейнеры с $compose_file..."
    docker compose -f "$compose_file" up -d
    
    # Проверка статуса
    if [ $? -eq 0 ]; then
        print_success "Контейнеры успешно запущены"
        return 0
    else
        print_error "Ошибка запуска контейнеров"
        return 1
    fi
}

# Запуск приложения локально с правильным скриптом
run_local_app() {
    local env=$1
    
    case $env in
        development)
            print_step "Запускаем в режиме разработки..."
            if [ "$PNPM_AVAILABLE" = true ]; then
                LOGGER_TEST_MODE=true pnpm run start:dev
            else
                LOGGER_TEST_MODE=true npm run start:dev
            fi
            ;;
        staging)
            print_step "Запускаем в staging режиме..."
            if [ "$PNPM_AVAILABLE" = true ]; then
                pnpm run start:stage
            else
                npm run start:stage
            fi
            ;;
        production)
            print_step "Запускаем в production режиме..."
            if [ "$PNPM_AVAILABLE" = true ]; then
                pnpm run start:prod
            else
                npm run start:prod
            fi
            ;;
        *)
            print_error "Неизвестный контур: $env"
            return 1
            ;;
    esac
    
    return 0
}

# Check for args parse library (getopt)
check_getopt() {
    if ! getopt --test > /dev/null; then
        GETOPT_COMPATIBLE=0
        print_warning "Расширенная обработка аргументов недоступна. Используем базовый режим."
    else
        GETOPT_COMPATIBLE=1
        print_success "Расширенная обработка аргументов доступна."
    fi
}

# Инициализация
print_header "🌟 GPROD Environment Switcher Pro"
print_step "Инициализация..."
detect_system
check_docker
check_pnpm
check_getopt

# Обработка аргументов командной строки
ENV=""
USE_DOCKER=""
SKIP_LAUNCH=false
SILENT_MODE=false

# Расширенная обработка с getopt
if [ "$GETOPT_COMPATIBLE" = "1" ]; then
    OPTS=$(getopt -o "e:dls" --long "env:,docker,local,skip,silent" -n "$(basename $0)" -- "$@")
    
    if [ $? != 0 ]; then
        print_error "Некорректные аргументы"
        exit 1
    fi
    
    eval set -- "$OPTS"
    
    while true; do
        case "$1" in
            -e | --env)
                ENV=$(echo "$2" | tr '[:upper:]' '[:lower:]')
                shift 2
                ;;
            -d | --docker)
                USE_DOCKER=true
                shift
                ;;
            -l | --local)
                USE_DOCKER=false
                shift
                ;;
            -s | --skip)
                SKIP_LAUNCH=true
                shift
                ;;
            --silent)
                SILENT_MODE=true
                shift
                ;;
            --)
                shift
                break
                ;;
            *)
                print_error "Внутренняя ошибка обработки аргументов"
                exit 1
                ;;
        esac
    done
    
    # Проверка позиционных аргументов
    if [ -z "$ENV" ] && [ "$#" -gt 0 ]; then
        ENV=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    fi
else
    # Базовая обработка без getopt
    if [ "$#" -gt 0 ]; then
        ENV=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    fi
    
    if [ "$#" -gt 1 ]; then
        if [ "$2" = "--docker" ]; then
            USE_DOCKER=true
        elif [ "$2" = "--local" ]; then
            USE_DOCKER=false
        fi
    fi
fi

# Интерактивный выбор, если контур не задан
if [ -z "$ENV" ]; then
    if [ "$SILENT_MODE" = false ]; then
        print_subheader "Выберите контур окружения:"
        select env_type in "development" "staging" "production"; do
            case $env_type in
                development|staging|production)
                    ENV=$(echo "$env_type" | tr '[:upper:]' '[:lower:]')
                    break
                    ;;
                *)
                    print_error "Некорректный выбор"
                    ;;
            esac
        done
    else
        # В тихом режиме используем development по умолчанию
        ENV="development"
    fi
fi

# Проверка корректности контура
case $ENV in
    dev|development)
        ENV_FULL="development"
        ENV_SHORT="dev"
        ;;
    stage|staging)
        ENV_FULL="staging"
        ENV_SHORT="stage"
        ;;
    prod|production)
        ENV_FULL="production"
        ENV_SHORT="prod"
        ;;
    *)
        print_error "Некорректный контур: $ENV"
        print_info "Поддерживаемые контуры: development, staging, production"
        exit 1
        ;;
esac

ENV_FILE=".env.${ENV_FULL}"
COMPOSE_FILE="docker-compose.${ENV_SHORT}.yml"

# Если режим запуска не задан, и Docker недоступен, используем локальный режим
if [ -z "$USE_DOCKER" ]; then
    # Интерактивный выбор режима запуска
    if [ "$DOCKER_AVAILABLE" = true ] && [ "$SILENT_MODE" = false ]; then
        print_subheader "Выберите режим запуска:"
        select run_mode in "Docker" "Локально"; do
            case $run_mode in
                Docker)
                    USE_DOCKER=true
                    break
                    ;;
                Локально)
                    USE_DOCKER=false
                    break
                    ;;
                *)
                    print_error "Некорректный выбор"
                    ;;
            esac
        done
    elif [ "$DOCKER_AVAILABLE" = true ] && [ "$SILENT_MODE" = true ]; then
        # В тихом режиме используем Docker, если доступен
        USE_DOCKER=true
    else
        USE_DOCKER=false
    fi
fi

# Вывод выбранных настроек
print_subheader "📋 Параметры переключения"
print_info "Контур: ${BOLD}$ENV_FULL${NC}"
print_info "Режим запуска: ${BOLD}$([ "$USE_DOCKER" = true ] && echo "Docker" || echo "Локальный")${NC}"
print_info "Файл окружения: ${BOLD}$ENV_FILE${NC}"
print_info "Docker Compose файл: ${BOLD}$COMPOSE_FILE${NC}"

# Проверка и создание файла окружения
print_subheader "🔧 Подготовка файлов окружения"
ensure_env_file $ENV_FULL

# Адаптация файла окружения для выбранного режима
print_step "Настройка режима запуска..."
adapt_for_mode "$ENV_FILE" "$USE_DOCKER"

# Создание символической ссылки .env
print_step "Создание символической ссылки .env -> $ENV_FILE..."
ln -sf "$ENV_FILE" .env
print_success "Символическая ссылка .env создана"

# Определение порта из файла окружения
DEFAULT_PORT=$(get_default_port $ENV_FULL)
PORT=$(get_port_from_env "$ENV_FILE" "$DEFAULT_PORT")

# Запуск приложения, если не указан флаг --skip
if [ "$SKIP_LAUNCH" = false ]; then
    print_subheader "🚀 Запуск приложения"
    
    if [ "$USE_DOCKER" = true ]; then
        if [ "$DOCKER_AVAILABLE" = true ]; then
            # Запуск через Docker
            run_docker_compose "$ENV_FULL" "$COMPOSE_FILE"
            
            # Вывод информации о доступных сервисах
            print_subheader "🔗 Доступные сервисы"
            print_info "API: ${BOLD}http://localhost:${PORT}/api/v1${NC}"
            print_info "Swagger: ${BOLD}http://localhost:${PORT}/api/v1/docs${NC}"
            
            # Вывод дополнительных сервисов в зависимости от контура
            case $ENV_FULL in
                staging)
                    print_info "Prometheus: ${BOLD}http://localhost:9090${NC}"
                    print_info "Grafana: ${BOLD}http://localhost:3100${NC}"
                    ;;
                production)
                    print_info "Grafana: ${BOLD}http://localhost:3500${NC}"
                    ;;
            esac
            
            # Вывод запущенных контейнеров
            print_subheader "📊 Запущенные контейнеры"
            docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}\t{{.Status}}"
        else
            print_error "Docker недоступен, невозможно запустить в режиме Docker"
            print_info "Попробуйте локальный режим с флагом --local"
        fi
    else
        # Интерактивный запрос на запуск локально
        if [ "$SILENT_MODE" = false ]; then
            print_info "Запустить приложение локально? (y/n)"
            read -p "$(echo -e $YELLOW"Ваш выбор: "$NC)" should_run
            
            if [[ "$should_run" == "y" || "$should_run" == "Y" ]]; then
                run_local_app "$ENV_FULL"
            else
                print_info "Приложение не запущено. Используйте команду ниже для запуска:"
                print_info "${BOLD}pnpm run start:${ENV_SHORT}${NC}"
            fi
        else
            # В тихом режиме просто выводим команду
            print_info "Для запуска используйте: ${BOLD}pnpm run start:${ENV_SHORT}${NC}"
        fi
    fi
else
    print_info "Пропуск запуска приложения (флаг --skip)"
fi

print_hr
print_success "Переключение на контур ${BOLD}$ENV_FULL${NC} выполнено успешно!"

# Вывод справки по управлению
print_subheader "💡 Полезные команды"
print_step "Запуск локально: ${BOLD}pnpm run start:${ENV_SHORT}${NC}"
print_step "Запуск с Docker: ${BOLD}pnpm run docker:reference${NC}"
print_step "Переключение контура: ${BOLD}pnpm run env:switch:new <dev|stage|prod> [--docker|--local]${NC}"
print_step "Генерация API клиента: ${BOLD}pnpm run api:client:gen${NC}"

exit 0 