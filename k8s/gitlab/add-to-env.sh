#!/bin/bash
set -e

echo "🔧 Добавление GitLab токена в переменные окружения"
echo ""

# Проверка наличия токена
TOKEN_FILE="k8s/gitlab/.gitlab-token"
ENV_FILE="k8s/gitlab/.env"

if [ ! -f "$TOKEN_FILE" ] || [ ! -s "$TOKEN_FILE" ]; then
    echo "❌ Токен не найден в $TOKEN_FILE"
    echo ""
    echo "💡 Создайте токен вручную:"
    echo "   1. Откройте https://gitlab.gyber.org"
    echo "   2. Войдите как root"
    echo "   3. Settings → Access Tokens"
    echo "   4. Создайте токен с правами: api, read_user, read_repository, write_repository, sudo"
    echo "   5. Сохраните токен:"
    echo "      echo 'ваш-токен' > $TOKEN_FILE"
    exit 1
fi

GITLAB_TOKEN=$(cat "$TOKEN_FILE" | tr -d '\n\r ')
GITLAB_URL="https://gitlab.gyber.org"

if [ -z "$GITLAB_TOKEN" ]; then
    echo "❌ Токен пустой!"
    exit 1
fi

echo "✅ Токен найден"
echo ""

# Создаем .env файл
cat > "$ENV_FILE" <<EOF
# GitLab Configuration
# Generated: $(date)
export GITLAB_URL="$GITLAB_URL"
export GITLAB_TOKEN="$GITLAB_TOKEN"
export GITLAB_USER="root"
EOF

chmod 600 "$ENV_FILE"
echo "📄 Создан файл: $ENV_FILE"
echo ""

# Проверяем .zshrc
ZSHRC_FILE="$HOME/.zshrc"
ENV_LINE="source $(pwd)/$ENV_FILE"

# Проверяем, не добавлена ли уже строка
if grep -q "$ENV_FILE" "$ZSHRC_FILE" 2>/dev/null; then
    echo "✅ Переменные уже добавлены в ~/.zshrc"
else
    echo "➕ Добавляю в ~/.zshrc..."
    echo "" >> "$ZSHRC_FILE"
    echo "# GitLab Configuration (added $(date))" >> "$ZSHRC_FILE"
    echo "$ENV_LINE" >> "$ZSHRC_FILE"
    echo "✅ Добавлено в ~/.zshrc"
fi

# Проверяем .zshenv (загружается раньше)
ZSHENV_FILE="$HOME/.zshenv"
if [ -f "$ZSHENV_FILE" ]; then
    if grep -q "$ENV_FILE" "$ZSHENV_FILE" 2>/dev/null; then
        echo "✅ Переменные уже добавлены в ~/.zshenv"
    else
        echo "➕ Добавляю в ~/.zshenv..."
        echo "" >> "$ZSHENV_FILE"
        echo "# GitLab Configuration (added $(date))" >> "$ZSHENV_FILE"
        echo "$ENV_LINE" >> "$ZSHENV_FILE"
        echo "✅ Добавлено в ~/.zshenv"
    fi
fi

# Загружаем переменные в текущую сессию
export GITLAB_URL="$GITLAB_URL"
export GITLAB_TOKEN="$GITLAB_TOKEN"
export GITLAB_USER="root"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ НАСТРОЕНЫ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Переменные:"
echo "   GITLAB_URL:  $GITLAB_URL"
echo "   GITLAB_TOKEN: ${GITLAB_TOKEN:0:10}... (скрыт)"
echo "   GITLAB_USER: root"
echo ""
echo "📄 Файлы:"
echo "   $ENV_FILE"
echo "   $ZSHRC_FILE"
if [ -f "$ZSHENV_FILE" ]; then
    echo "   $ZSHENV_FILE"
fi
echo ""
echo "💡 Для применения в новых терминалах:"
echo "   source ~/.zshrc"
echo ""
echo "💡 Или перезапустите терминал"
echo ""
echo "📋 Проверка:"
echo "   echo \$GITLAB_URL"
echo "   echo \$GITLAB_TOKEN"
echo ""


