#!/bin/bash

# ===================================================
# 🌟 GPROD Advanced Environment Setup Script
# ===================================================
# Автоматическое создание и настройка .env файлов для всех окружений
# Версия 2.1 - с поддержкой выбора стрелками

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

# Более простой выбор опций без сложной обработки клавиш
simple_select() {
    local title=$1
    shift
    local options=("$@")
    local num_options=${#options[@]}
    local choice
    
    echo -e "${CYAN}${title}${NC}"
    
    for ((i=1; i<=num_options; i++)); do
        echo -e "${GREEN}$i)${NC} ${options[$i-1]}"
    done
    
    while true; do
        read -p "$(echo -e "${BLUE}Введите номер (1-$num_options): ${NC}")" choice
        
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le $num_options ]; then
            return $((choice-1))
        else
            print_error "Пожалуйста, введите число от 1 до $num_options"
        fi
    done
}

# Переопределяем устаревшую функцию arrow_select
arrow_select() {
    simple_select "$@"
    return $?
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
    fi
    print_info "Определена операционная система: ${BOLD}$OS_TYPE${NC}"
}

# Проверка наличия Docker
check_docker() {
    if command -v docker &> /dev/null; then
        DOCKER_AVAILABLE=true
        print_success "Docker доступен в системе"
    else
        DOCKER_AVAILABLE=false
        print_warning "Docker не найден в системе, будет настроено для локальной разработки"
    fi
}

# Создание директории и файлов
print_header "🚀 Настройка окружения проекта GPROD"
print_step "Определение системных параметров..."
detect_system
check_docker

print_step "Создание директории для шаблонов .env файлов..."
mkdir -p .env-templates

print_subheader "📝 Генерация шаблонов .env файлов"

# Создаем шаблон для development
print_step "Создание шаблона для development..."
cat > .env-templates/.env.development << 'EOL'
# Основные настройки окружения
NODE_ENV=development
PORT=3008

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev

# JWT и авторизация
JWT_SECRET=dev_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=debug
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API (Dev)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_dev

# Инструментальные переменные
LOGGER_TEST_MODE=false
RUNNING_IN_DOCKER=false
EOL
print_success "Шаблон .env.development создан"

# Создаем шаблон для staging
print_step "Создание шаблона для staging..."
cat > .env-templates/.env.staging << 'EOL'
# Основные настройки окружения
NODE_ENV=staging
PORT=3003

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_stage

# JWT и авторизация
JWT_SECRET=stage_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=info
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://stage.gprod.com,https://stage-admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API (Staging)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=stage.gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_stage

# Prometheus и Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin

# Инструментальные переменные
LOGGER_TEST_MODE=false
RUNNING_IN_DOCKER=false
EOL
print_success "Шаблон .env.staging создан"

# Создаем шаблон для production
print_step "Создание шаблона для production..."
cat > .env-templates/.env.production << 'EOL'
# Основные настройки окружения
NODE_ENV=production
PORT=3007

# База данных
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/gprod_prod

# JWT и авторизация
JWT_SECRET=super_secure_jwt_secret_for_production
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=30d

# Логирование
LOG_LEVEL=warn
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://gprod.com,https://admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=50

# Дополнительные настройки
APP_NAME=GPROD API
APP_VERSION=1.0.0
HOST=api.gprod.com
DOMAIN=gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=prod_secure_password
POSTGRES_DB=gprod_prod

# SSL
SSL_ENABLED=true
SSL_KEY=/etc/ssl/private/gprod.key
SSL_CERT=/etc/ssl/certs/gprod.crt

# Prometheus и Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=secure_grafana_password

# Инструментальные переменные
LOGGER_TEST_MODE=false
RUNNING_IN_DOCKER=true
EOL
print_success "Шаблон .env.production создан"

# Создаем шаблон для test
print_step "Создание шаблона для test..."
cat > .env-templates/.env.test << 'EOL'
# Основные настройки окружения
NODE_ENV=test
PORT=3009

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_test

# JWT и авторизация
JWT_SECRET=test_jwt_secret
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=error
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000

# Дополнительные настройки
APP_NAME=GPROD API (Test)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_test

# Настройки тестов
JEST_TIMEOUT=10000
DISABLE_AUTH=true
DISABLE_RATE_LIMIT=true
DISABLE_CACHE=true

# Инструментальные переменные
LOGGER_TEST_MODE=true
RUNNING_IN_DOCKER=false
EOL
print_success "Шаблон .env.test создан"

print_info "Все шаблоны успешно созданы в директории .env-templates"

print_subheader "⚙️ Настройка рабочего окружения"

# Проверка наличия .env* файлов в корне
if ls .env* 1> /dev/null 2>&1; then
    print_warning "В проекте уже есть .env файлы:"
    ls -la .env* | grep -v "\.env-templates"
    
    options=("Да" "Нет")
    simple_select "Хотите перезаписать существующие .env файлы?" "${options[@]}"
    overwrite=$?
    
    if [ $overwrite -ne 0 ]; then
        print_info "Cохраняем существующие .env файлы."
        
        # Проверим симлинк .env
        if [ -L ".env" ]; then
            ENV_TARGET=$(readlink .env)
            print_info "Текущий .env является симлинком на $ENV_TARGET"
        elif [ -f ".env" ]; then
            print_warning ".env является обычным файлом, а не симлинком"
        else
            print_warning ".env не найден"
        fi
        
        exit 0
    fi
fi

# Определяем, какой контур установить по умолчанию
options=("development" "staging" "production" "test" "все контуры")
simple_select "Выберите контур для создания:" "${options[@]}"
env_type=$?

    case $env_type in
    0)
            DEFAULT_ENV="development"
            ENV_FILE=".env.development"
        ENV_FILES=("development")
            ;;
    1)
            DEFAULT_ENV="staging"
            ENV_FILE=".env.staging"
        ENV_FILES=("staging")
            ;;
    2)
            DEFAULT_ENV="production"
            ENV_FILE=".env.production"
        ENV_FILES=("production")
            ;;
    3)
            DEFAULT_ENV="test"
            ENV_FILE=".env.test"
        ENV_FILES=("test")
        ;;
    4)
        DEFAULT_ENV="development"
        ENV_FILE=".env.development"
        ENV_FILES=("development" "staging" "production" "test")
            ;;
    esac

# Копируем шаблоны для выбранных контуров
for env in "${ENV_FILES[@]}"; do
    src=".env-templates/.env.${env}"
    dest=".env.${env}"
    
    if [ -f "$src" ]; then
        cp "$src" "$dest"
        print_success "Файл $dest создан"
    else
        print_error "Шаблон $src не найден"
    fi
done

# Создаем симлинк на выбранный файл
ln -sf "$ENV_FILE" .env
print_success "Файл .env установлен как симлинк на $ENV_FILE"

# Определяем режим запуска
if [ "$DOCKER_AVAILABLE" = true ]; then
    options=("Docker" "Локально")
    arrow_select "Выберите режим запуска по умолчанию:" "${options[@]}"
    run_mode=$?
    
    if [ $run_mode -eq 0 ]; then
                USE_DOCKER=true
    else
                USE_DOCKER=false
    fi
else
    USE_DOCKER=false
fi

# Адаптация для выбранного режима
for env_file in .env.development .env.staging .env.production .env.test; do
    if [ -f "$env_file" ]; then
        if [ "$USE_DOCKER" = true ]; then
            # Для Docker (db:5432)
            "${SED_INPLACE[@]}" 's/localhost:5432/db:5432/g' "$env_file"
            "${SED_INPLACE[@]}" 's/RUNNING_IN_DOCKER=false/RUNNING_IN_DOCKER=true/g' "$env_file"
            print_success "Файл $env_file адаптирован для Docker"
        else
            # Для локальной разработки (localhost:5432)
            "${SED_INPLACE[@]}" 's/db:5432/localhost:5432/g' "$env_file"
            "${SED_INPLACE[@]}" 's/RUNNING_IN_DOCKER=true/RUNNING_IN_DOCKER=false/g' "$env_file"
            print_success "Файл $env_file адаптирован для локальной разработки"
        fi
        
        # MacOS fix for sed
        if [ "$OS_TYPE" = "MacOS" ]; then
            rm -f "${env_file}.bak" 2>/dev/null
        fi
    fi
done

# Создание пользовательской базовой конфигурации
print_subheader "🔧 Создание пользовательской конфигурации"
options=("Да" "Нет")
arrow_select "Хотите настроить дополнительные параметры для $ENV_FILE?" "${options[@]}"
customize=$?

if [ $customize -eq 0 ]; then
            # Порт
            read -p "$(echo -e $BLUE"Порт для API (оставьте пустым для значения по умолчанию): "$NC)" custom_port
            if [ ! -z "$custom_port" ]; then
                "${SED_INPLACE[@]}" "s/PORT=[0-9]*/PORT=$custom_port/" "$ENV_FILE"
                print_success "Порт установлен: $custom_port"
            fi
            
            # JWT Secret
            read -p "$(echo -e $BLUE"JWT Secret (оставьте пустым для значения по умолчанию): "$NC)" custom_jwt
            if [ ! -z "$custom_jwt" ]; then
                "${SED_INPLACE[@]}" "s/JWT_SECRET=.*/JWT_SECRET=$custom_jwt/" "$ENV_FILE"
                print_success "JWT Secret обновлен"
            fi
            
            # Режим отладки
    options=("Да" "Нет")
    arrow_select "Включить режим отладки?" "${options[@]}"
    debug_mode=$?
    
    if [ $debug_mode -eq 0 ]; then
                "${SED_INPLACE[@]}" "s/DEBUG=false/DEBUG=true/" "$ENV_FILE"
                print_success "Режим отладки включен"
    else
        "${SED_INPLACE[@]}" "s/DEBUG=true/DEBUG=false/" "$ENV_FILE"
        print_success "Режим отладки выключен"
            fi
            
            # MacOS fix for sed
            if [ "$OS_TYPE" = "MacOS" ]; then
                rm -f "${ENV_FILE}.bak" 2>/dev/null
            fi
else
            print_info "Используем значения по умолчанию"
fi

print_header "✅ Настройка окружения завершена успешно!"
print_info "Текущий контур: ${BOLD}$DEFAULT_ENV${NC}"
print_info "Режим запуска: ${BOLD}$([ "$USE_DOCKER" = true ] && echo "Docker" || echo "Локальный")${NC}"
print_info "Основной .env файл: ${BOLD}$ENV_FILE${NC}"

print_subheader "🚀 Что делать дальше?"
print_step "Запустить приложение в режиме разработки: ${BOLD}pnpm run start:dev${NC}"
print_step "Запустить с Docker: ${BOLD}pnpm run docker:reference${NC}"
print_step "Переключить контур: ${BOLD}pnpm run env:switch:new <dev|stage|prod> [--docker|--local]${NC}"

# Предложение сразу запустить приложение
print_subheader "🏃 Быстрый запуск"
options=("Да" "Нет")
arrow_select "Хотите запустить приложение сейчас?" "${options[@]}"
should_run=$?

if [ $should_run -eq 0 ]; then
    if [ "$USE_DOCKER" = true ]; then
        print_info "Запускаем с Docker..."
        if [ -f "docker-compose.reference.yml" ]; then
            docker compose -f docker-compose.reference.yml up -d
        else
            print_info "Проверяем наличие файла в директории docker/"
            if [ -f "docker/docker-compose.reference.yml" ]; then
                docker compose -f docker/docker-compose.reference.yml up -d
        else
            print_error "Файл docker-compose.reference.yml не найден"
            fi
        fi
    else
        print_info "Запускаем локально..."
        case $DEFAULT_ENV in
            development)
                LOGGER_TEST_MODE=true pnpm run start:dev
                ;;
            staging)
                pnpm run start:stage
                ;;
            production)
                pnpm run start:prod
                ;;
            test)
                pnpm run test:smart
                ;;
        esac
    fi
fi 