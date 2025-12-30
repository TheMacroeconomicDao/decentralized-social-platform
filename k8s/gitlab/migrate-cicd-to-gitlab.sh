#!/bin/bash

# Полная миграция CI/CD и секрет-менеджмента на GitLab
# Автоматически настраивает все переменные и обновляет конфигурацию

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 МИГРАЦИЯ CI/CD И СЕКРЕТ-МЕНЕДЖМЕНТА НА GITLAB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Загрузка токена
if [ -n "$GITLAB_TOKEN" ]; then
    echo "✅ GitLab токен найден в переменной окружения"
elif [ -f "k8s/gitlab/gitlab-token.env" ]; then
    source k8s/gitlab/gitlab-token.env
    echo "✅ GitLab токен загружен из файла"
else
    echo "❌ GitLab токен не найден!"
    echo "   Установите: export GITLAB_TOKEN=\"ваш-токен\""
    exit 1
fi

GITLAB_URL="https://gyber.org/lab"
PROJECT_PATH="root/decentralized-social-platform"
PROJECT_ID=$(echo "$PROJECT_PATH" | sed 's/\//%2F/g')

echo "🌐 GitLab URL: $GITLAB_URL"
echo "📦 Проект: $PROJECT_PATH"
echo ""

# Функция для создания/обновления переменной
create_variable() {
    local key=$1
    local value=$2
    local protected=${3:-true}
    local masked=${4:-false}
    
    echo "📝 Настройка переменной: $key"
    
    # Проверяем существует ли переменная
    EXISTING=$(curl -s -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
        "$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables/$key" 2>/dev/null || echo "")
    
    if [ -n "$EXISTING" ] && [ "$EXISTING" != "404" ]; then
        # Обновляем существующую
        curl -s -X PUT "$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables/$key" \
            -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"value\": \"$value\",
                \"protected\": $protected,
                \"masked\": $masked
            }" > /dev/null
        echo "   ✅ Обновлена"
    else
        # Создаем новую
        curl -s -X POST "$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables" \
            -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"key\": \"$key\",
                \"value\": \"$value\",
                \"protected\": $protected,
                \"masked\": $masked
            }" > /dev/null
        echo "   ✅ Создана"
    fi
}

# Запрашиваем необходимые значения
echo "📋 Введите необходимые значения (или нажмите Enter для пропуска):"
echo ""

# GHCR_USERNAME
read -p "GitHub Container Registry Username [TheMacroeconomicDao]: " GHCR_USERNAME
GHCR_USERNAME=${GHCR_USERNAME:-TheMacroeconomicDao}

# GHCR_TOKEN
read -p "GitHub Container Registry Token (PAT с правами packages:write): " GHCR_TOKEN
if [ -z "$GHCR_TOKEN" ]; then
    echo "⚠️  GHCR_TOKEN не указан, пропускаем"
else
    create_variable "GHCR_USERNAME" "$GHCR_USERNAME" true false
    create_variable "GHCR_TOKEN" "$GHCR_TOKEN" true true
fi

# KUBE_CONFIG
read -p "Использовать текущий kubeconfig? [y/N]: " USE_CURRENT_KUBE
if [[ "$USE_CURRENT_KUBE" =~ ^[Yy]$ ]]; then
    if [ -f "$HOME/.kube/config" ]; then
        KUBE_CONFIG_B64=$(cat ~/.kube/config | base64 | tr -d '\n')
        create_variable "KUBE_CONFIG" "$KUBE_CONFIG_B64" true true
        echo "✅ KUBE_CONFIG сохранен"
    else
        echo "⚠️  ~/.kube/config не найден"
    fi
else
    read -p "KUBE_CONFIG (base64): " KUBE_CONFIG_B64
    if [ -n "$KUBE_CONFIG_B64" ]; then
        create_variable "KUBE_CONFIG" "$KUBE_CONFIG_B64" true true
    fi
fi

# KUBE_CONTEXT
read -p "Kubernetes Context [default]: " KUBE_CONTEXT
KUBE_CONTEXT=${KUBE_CONTEXT:-default}
create_variable "KUBE_CONTEXT" "$KUBE_CONTEXT" true false

# OPENAI_API_KEY
read -p "OpenAI API Key (опционально): " OPENAI_API_KEY
if [ -n "$OPENAI_API_KEY" ]; then
    create_variable "OPENAI_API_KEY" "$OPENAI_API_KEY" true true
fi

# TELEGRAM_BOT_TOKEN
read -p "Telegram Bot Token (опционально): " TELEGRAM_BOT_TOKEN
if [ -n "$TELEGRAM_BOT_TOKEN" ]; then
    create_variable "TELEGRAM_BOT_TOKEN" "$TELEGRAM_BOT_TOKEN" true true
    read -p "Telegram Chat ID: " TELEGRAM_CHAT_ID
    if [ -n "$TELEGRAM_CHAT_ID" ]; then
        create_variable "TELEGRAM_CHAT_ID" "$TELEGRAM_CHAT_ID" true false
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ МИГРАЦИЯ ЗАВЕРШЕНА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Проверьте переменные в GitLab:"
echo "   $GITLAB_URL/$PROJECT_PATH/-/settings/ci_cd"
echo ""
echo "🚀 Следующие шаги:"
echo "   1. Проверьте все переменные в GitLab UI"
echo "   2. Запушьте код: git push gitlab main"
echo "   3. Запустите пайплайн в GitLab"
echo ""



