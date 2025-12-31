#!/bin/bash

# Отключение телеметрии GitLab для устранения ошибок 502 в логах

set -e

echo "🔧 Отключение телеметрии GitLab..."
echo ""

# Получаем имя пода
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab pod не найден"
    exit 1
fi

# Получаем токен
ROOT_TOKEN=""
if [ -n "$GITLAB_TOKEN" ]; then
    ROOT_TOKEN="$GITLAB_TOKEN"
elif [ -f "k8s/gitlab/gitlab-token.env" ]; then
    source k8s/gitlab/gitlab-token.env
    ROOT_TOKEN="$GITLAB_TOKEN"
elif [ -f "k8s/gitlab/.gitlab-token" ]; then
    ROOT_TOKEN=$(cat k8s/gitlab/.gitlab-token | tr -d '\n\r ')
fi

if [ -z "$ROOT_TOKEN" ]; then
    echo "❌ Токен не найден"
    exit 1
fi

GITLAB_URL="https://gyber.org/lab"
API_URL="${GITLAB_URL}/api/v4"

echo "📝 Отключение телеметрии через API..."

# Отключаем сбор статистики использования
curl -s --request PUT "${API_URL}/application/settings" \
  --header "PRIVATE-TOKEN: ${ROOT_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "usage_stats_enabled": false,
    "version_check_enabled": false,
    "instance_statistics_visibility_private": true
  }' > /dev/null

echo "✅ Телеметрия отключена через API"
echo ""

# Также отключаем через Rails console для надежности
echo "🔧 Применение настроек через Rails console..."

kubectl exec -n gitlab $POD_NAME -- gitlab-rails runner <<'EOF'
app_settings = ApplicationSetting.current

app_settings.update!(
  usage_stats_enabled: false,
  version_check_enabled: false,
  instance_statistics_visibility_private: true
)

puts "✅ Телеметрия отключена"
EOF

echo ""
echo "✅ Готово! Ошибки 502 для телеметрии больше не должны появляться"
echo ""
echo "💡 Эти ошибки не критичны - они связаны только со сбором статистики использования"
echo "   Основные функции GitLab работают нормально"




