#!/bin/bash
set -e

echo "🔐 Получение root пароля для GitLab"
echo ""

# Проверка что под запущен
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab под не найден. Проверьте статус:"
    echo "   kubectl get pods -n gitlab"
    exit 1
fi

echo "📦 Под: $POD_NAME"
echo ""

# Проверка что под готов
READY=$(kubectl get pod -n gitlab $POD_NAME -o jsonpath='{.status.containerStatuses[0].ready}')

if [ "$READY" != "true" ]; then
    echo "⏳ Под еще не готов. Ожидание..."
    echo "   Статус: $(kubectl get pod -n gitlab $POD_NAME -o jsonpath='{.status.phase}')"
    echo ""
    echo "💡 Подождите несколько минут и запустите скрипт снова:"
    echo "   ./k8s/gitlab/get-root-password.sh"
    exit 1
fi

echo "✅ Под готов"
echo ""

# Получение пароля
echo "🔍 Ищу root пароль..."
PASSWORD=$(kubectl exec -n gitlab $POD_NAME -- grep 'Password:' /etc/gitlab/initial_root_password 2>/dev/null | awk '{print $2}')

if [ -z "$PASSWORD" ]; then
    echo "⚠️  Пароль еще не сгенерирован. GitLab все еще инициализируется."
    echo "   Это может занять 5-10 минут после запуска пода."
    echo ""
    echo "💡 Проверьте логи:"
    echo "   kubectl logs -n gitlab $POD_NAME --tail=20"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 ROOT ПАРОЛЬ ДЛЯ GITLAB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   URL:      https://gitlab.gyber.org"
echo "   Логин:    root"
echo "   Пароль:   $PASSWORD"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  ВАЖНО: Сохраните этот пароль! Он нужен для первого входа."
echo "   После входа рекомендуется изменить пароль в настройках профиля."
echo ""


