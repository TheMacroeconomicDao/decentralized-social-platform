#!/bin/bash
set -e

echo "🔧 Настройка локального доступа к GitLab"
echo ""

# Проверка что под запущен
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -z "$POD_NAME" ]; then
    echo "❌ GitLab под не найден!"
    exit 1
fi

# Получаем root пароль
ROOT_PASSWORD=$(kubectl exec -n gitlab $POD_NAME -- grep 'Password:' /etc/gitlab/initial_root_password 2>/dev/null | awk '{print $2}')

if [ -z "$ROOT_PASSWORD" ]; then
    echo "❌ Не удалось получить root пароль"
    exit 1
fi

echo "📋 Данные для входа:"
echo "   Логин:    root"
echo "   Пароль:   $ROOT_PASSWORD"
echo ""

# Проверяем, не запущен ли уже портфорвардинг
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Портфорвардинг уже запущен на порту 8080"
    echo ""
    echo "🌐 Откройте в браузере: http://localhost:8080"
    echo ""
    echo "📋 Данные для входа:"
    echo "   Логин:    root"
    echo "   Пароль:   $ROOT_PASSWORD"
    echo ""
    
    # Открываем в браузере
    if command -v open &> /dev/null; then
        echo "🌐 Открываю в браузере..."
        open "http://localhost:8080" 2>/dev/null || true
    fi
    
    exit 0
fi

echo "🚀 Запускаю портфорвардинг на порту 8080..."
echo ""
echo "   Локальный URL: http://localhost:8080"
echo ""
echo "⚠️  Портфорвардинг будет работать пока вы не закроете этот процесс (Ctrl+C)"
echo ""

# Запускаем портфорвардинг в фоне
kubectl port-forward -n gitlab svc/gitlab 8080:80 > /tmp/gitlab-portforward.log 2>&1 &
PORTFORWARD_PID=$!

# Ждем немного для установки соединения
sleep 3

# Проверяем что портфорвардинг работает
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Портфорвардинг запущен успешно!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 GITLAB ДОСТУПЕН ЛОКАЛЬНО"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   URL:      http://localhost:8080"
    echo "   Логин:    root"
    echo "   Пароль:   $ROOT_PASSWORD"
    echo ""
    echo "📋 Следующие шаги:"
    echo "   1. Откройте http://localhost:8080 в браузере"
    echo "   2. Войдите с данными выше"
    echo "   3. Перейдите: Settings → Access Tokens"
    echo "   4. Создайте токен с правами: api, read_user, read_repository, write_repository, sudo"
    echo "   5. Сохраните токен: echo 'ваш-токен' > k8s/gitlab/.gitlab-token"
    echo ""
    echo "⚠️  Для остановки портфорвардинга: kill $PORTFORWARD_PID"
    echo ""
    
    # Открываем в браузере
    if command -v open &> /dev/null; then
        echo "🌐 Открываю в браузере..."
        sleep 2
        open "http://localhost:8080" 2>/dev/null || true
    fi
    
    # Ждем завершения
    wait $PORTFORWARD_PID
else
    echo "❌ Не удалось запустить портфорвардинг"
    echo ""
    echo "💡 Проверьте логи:"
    echo "   cat /tmp/gitlab-portforward.log"
    kill $PORTFORWARD_PID 2>/dev/null || true
    exit 1
fi

