#!/bin/bash
set -e

echo "🔧 Настройка GitLab переменных окружения"
echo ""

# Проверяем наличие токена
TOKEN_FILE="k8s/gitlab/.gitlab-token"

if [ ! -f "$TOKEN_FILE" ] || [ ! -s "$TOKEN_FILE" ]; then
    echo "❌ Токен не найден!"
    echo ""
    echo "📋 Инструкция по получению токена:"
    echo ""
    echo "1. Откройте: https://gitlab.gyber.org"
    echo ""
    echo "2. Войдите:"
    echo "   Логин: root"
    echo "   Пароль: $(kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password 2>/dev/null | awk "{print \$2}"')"
    echo ""
    echo "3. Создайте токен:"
    echo "   - Settings → Access Tokens"
    echo "   - Имя: system-full-access"
    echo "   - Scopes: api, read_user, read_repository, write_repository, sudo"
    echo ""
    echo "4. Сохраните токен:"
    echo "   echo 'ваш-токен' > $TOKEN_FILE"
    echo "   chmod 600 $TOKEN_FILE"
    echo ""
    echo "5. Запустите этот скрипт снова:"
    echo "   ./k8s/gitlab/setup-env-now.sh"
    echo ""
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
ENV_FILE="k8s/gitlab/.env"
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

# Добавляем в .zshrc
ZSHRC_FILE="$HOME/.zshrc"
ENV_FILE_ABS="$(cd "$(dirname "$ENV_FILE")" && pwd)/$(basename "$ENV_FILE")"
ENV_LINE="source \"$ENV_FILE_ABS\""

if grep -qF "$ENV_FILE_ABS" "$ZSHRC_FILE" 2>/dev/null || grep -qF "$ENV_FILE" "$ZSHRC_FILE" 2>/dev/null; then
    echo "✅ Переменные уже добавлены в ~/.zshrc"
else
    echo "➕ Добавляю в ~/.zshrc..."
    {
        echo ""
        echo "# GitLab Configuration (added $(date))"
        echo "$ENV_LINE"
    } >> "$ZSHRC_FILE"
    echo "✅ Добавлено в ~/.zshrc"
fi

# Добавляем в .zshenv если существует
ZSHENV_FILE="$HOME/.zshenv"
if [ -f "$ZSHENV_FILE" ]; then
    if grep -qF "$ENV_FILE_ABS" "$ZSHENV_FILE" 2>/dev/null || grep -qF "$ENV_FILE" "$ZSHENV_FILE" 2>/dev/null; then
        echo "✅ Переменные уже добавлены в ~/.zshenv"
    else
        echo "➕ Добавляю в ~/.zshenv..."
        {
            echo ""
            echo "# GitLab Configuration (added $(date))"
            echo "$ENV_LINE"
        } >> "$ZSHENV_FILE"
        echo "✅ Добавлено в ~/.zshenv"
    fi
fi

# Загружаем в текущую сессию
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
echo "   GITLAB_TOKEN: ${GITLAB_TOKEN:0:15}... (скрыт)"
echo "   GITLAB_USER: root"
echo ""
echo "📄 Файлы обновлены:"
echo "   $ENV_FILE"
echo "   $ZSHRC_FILE"
if [ -f "$ZSHENV_FILE" ]; then
    echo "   $ZSHENV_FILE"
fi
echo ""
echo "💡 Для применения в текущей сессии:"
echo "   source ~/.zshrc"
echo ""
echo "💡 Или перезапустите терминал"
echo ""
echo "📋 Проверка переменных:"
echo "   echo \$GITLAB_URL"
echo "   echo \$GITLAB_TOKEN"
echo ""

