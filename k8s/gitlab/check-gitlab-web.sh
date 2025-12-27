#!/bin/bash
set -e

echo "🌐 Проверка доступности GitLab веб-интерфейса"
echo ""

GITLAB_URL="https://gitlab.gyber.org"

# Получаем root пароль
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab под не найден!"
    exit 1
fi

ROOT_PASSWORD=$(kubectl exec -n gitlab $POD_NAME -- grep 'Password:' /etc/gitlab/initial_root_password 2>/dev/null | awk '{print $2}')

if [ -z "$ROOT_PASSWORD" ]; then
    echo "❌ Не удалось получить root пароль"
    exit 1
fi

echo "📋 Данные для входа:"
echo "   URL:      $GITLAB_URL"
echo "   Логин:    root"
echo "   Пароль:   $ROOT_PASSWORD"
echo ""

# Проверка доступности
echo "🔍 Проверяю доступность веб-интерфейса..."
HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$GITLAB_URL" --connect-timeout 10 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "000" ]; then
    echo "❌ Веб-интерфейс недоступен"
    echo ""
    echo "💡 Возможные причины:"
    echo "   1. GitLab еще инициализируется (может занять 5-10 минут)"
    echo "   2. Проблемы с сетью или ingress"
    echo ""
    echo "📋 Проверьте статус:"
    echo "   kubectl get pods -n gitlab"
    echo "   kubectl get ingress -n gitlab"
    echo "   kubectl logs -n gitlab $POD_NAME --tail=20"
    echo ""
    echo "💡 Альтернатива: используйте портфорвардинг:"
    echo "   kubectl port-forward -n gitlab svc/gitlab 8080:80"
    echo "   Затем откройте: http://localhost:8080"
    exit 1
elif [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "301" ]; then
    echo "✅ Веб-интерфейс доступен! (HTTP $HTTP_CODE)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 ОТКРОЙТЕ В БРАУЗЕРЕ"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   URL:      $GITLAB_URL"
    echo "   Логин:    root"
    echo "   Пароль:   $ROOT_PASSWORD"
    echo ""
    echo "📋 Следующие шаги:"
    echo "   1. Откройте $GITLAB_URL в браузере"
    echo "   2. Войдите с данными выше"
    echo "   3. Перейдите: Settings → Access Tokens"
    echo "   4. Создайте токен с правами: api, read_user, read_repository, write_repository, sudo"
    echo "   5. Сохраните токен в: k8s/gitlab/.gitlab-token"
    echo ""
    
    # Пытаемся открыть в браузере (macOS)
    if command -v open &> /dev/null; then
        echo "🌐 Открываю в браузере..."
        open "$GITLAB_URL" 2>/dev/null || true
    fi
else
    echo "⚠️  Веб-интерфейс отвечает, но с кодом: $HTTP_CODE"
    echo "   Это может означать проблемы с конфигурацией или SSL"
    echo ""
    echo "💡 Попробуйте открыть вручную: $GITLAB_URL"
fi

