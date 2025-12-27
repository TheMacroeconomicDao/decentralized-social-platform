#!/bin/bash
set -e

echo "🔑 Создание Personal Access Token через GitLab Rails Console"
echo ""

POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab под не найден!"
    exit 1
fi

echo "📦 Под: $POD_NAME"
echo ""

# Генерируем имя токена
TOKEN_NAME="system-full-access-$(date +%Y%m%d-%H%M%S)"

echo "🔑 Создаю токен: $TOKEN_NAME"
echo ""

# Создаем токен через Rails console
TOKEN_OUTPUT=$(kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner "
user = User.find_by_username('root')
if user.nil?
  puts 'ERROR: Root user not found'
  exit 1
end

# Создаем токен с полными правами
token = PersonalAccessToken.create!(
  user: user,
  name: '${TOKEN_NAME}',
  scopes: ['api', 'read_user', 'read_repository', 'write_repository', 'read_registry', 'write_registry', 'sudo', 'admin_mode'],
  expires_at: 1.year.from_now
)

puts \"SUCCESS\"
puts \"TOKEN_NAME=#{token.name}\"
puts \"TOKEN=#{token.token}\"
puts \"SCOPES=#{token.scopes.join(',')}\"
puts \"EXPIRES_AT=#{token.expires_at}\"
" 2>&1)

if echo "$TOKEN_OUTPUT" | grep -q "TOKEN="; then
    TOKEN=$(echo "$TOKEN_OUTPUT" | grep "^TOKEN=" | cut -d'=' -f2)
    TOKEN_NAME_OUT=$(echo "$TOKEN_OUTPUT" | grep "^TOKEN_NAME=" | cut -d'=' -f2)
    SCOPES=$(echo "$TOKEN_OUTPUT" | grep "^SCOPES=" | cut -d'=' -f2)
    EXPIRES=$(echo "$TOKEN_OUTPUT" | grep "^EXPIRES_AT=" | cut -d'=' -f2)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ PERSONAL ACCESS TOKEN СОЗДАН УСПЕШНО"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   Имя токена: $TOKEN_NAME_OUT"
    echo "   Токен:      $TOKEN"
    echo "   Права:      $SCOPES"
    echo "   Срок:       $EXPIRES"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Сохраняем токен
    TOKEN_FILE="k8s/gitlab/.gitlab-token"
    echo "$TOKEN" > "$TOKEN_FILE"
    chmod 600 "$TOKEN_FILE"
    echo "💾 Токен сохранен в: $TOKEN_FILE"
    echo ""
    
    # Сохраняем полную информацию
    INFO_FILE="k8s/gitlab/.gitlab-token-info"
    cat > "$INFO_FILE" <<EOF
# GitLab Personal Access Token
# Создан: $(date)
# Имя: $TOKEN_NAME_OUT
# Токен: $TOKEN
# Права: $SCOPES
# Срок: $EXPIRES
# URL: https://gitlab.gyber.org
EOF
    chmod 600 "$INFO_FILE"
    echo "📄 Полная информация сохранена в: $INFO_FILE"
    echo ""
    
    echo "⚠️  ВАЖНО: Сохраните этот токен! Он больше не будет показан."
    echo ""
    echo "📋 Использование в системе:"
    echo ""
    echo "   # Экспорт переменной окружения"
    echo "   export GITLAB_TOKEN=\"$TOKEN\""
    echo "   export GITLAB_URL=\"https://gitlab.gyber.org\""
    echo ""
    echo "   # Использование в git remote"
    echo "   git remote set-url gitlab https://oauth2:\$GITLAB_TOKEN@gitlab.gyber.org/username/project.git"
    echo ""
    echo "   # Использование в curl/API"
    echo "   curl -H \"PRIVATE-TOKEN: \$GITLAB_TOKEN\" \$GITLAB_URL/api/v4/projects"
    echo ""
    echo "   # Использование в CI/CD"
    echo "   GITLAB_TOKEN: \$GITLAB_TOKEN"
    echo ""
else
    echo "❌ Ошибка при создании токена:"
    echo "$TOKEN_OUTPUT"
    exit 1
fi

