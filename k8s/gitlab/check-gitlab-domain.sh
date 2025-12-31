#!/bin/bash
set -e

echo "🌐 Проверка GitLab по домену gitlab.gyber.org"
echo ""

GITLAB_URL="https://gitlab.gyber.org"
GITLAB_IP="65.108.15.30"

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

# Проверка 1: Статус пода
echo "1️⃣  Проверка статуса GitLab пода..."
POD_STATUS=$(kubectl get pod -n gitlab $POD_NAME -o jsonpath='{.status.phase}')
READY=$(kubectl get pod -n gitlab $POD_NAME -o jsonpath='{.status.containerStatuses[0].ready}')

if [ "$POD_STATUS" = "Running" ] && [ "$READY" = "true" ]; then
    echo "   ✅ Под работает и готов"
else
    echo "   ⚠️  Под в статусе: $POD_STATUS (Ready: $READY)"
fi
echo ""

# Проверка 2: Внутренняя доступность
echo "2️⃣  Проверка внутренней доступности GitLab..."
INTERNAL_CODE=$(kubectl exec -n gitlab $POD_NAME -- curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "000")

if [ "$INTERNAL_CODE" = "302" ] || [ "$INTERNAL_CODE" = "200" ]; then
    echo "   ✅ GitLab отвечает внутри пода (HTTP $INTERNAL_CODE)"
else
    echo "   ❌ GitLab не отвечает внутри пода (HTTP $INTERNAL_CODE)"
fi
echo ""

# Проверка 3: Сервис
echo "3️⃣  Проверка Kubernetes сервиса..."
SVC_IP=$(kubectl get svc -n gitlab gitlab -o jsonpath='{.spec.clusterIP}' 2>/dev/null || echo "")
if [ -n "$SVC_IP" ]; then
    echo "   ✅ Сервис настроен (ClusterIP: $SVC_IP)"
else
    echo "   ❌ Сервис не найден"
fi
echo ""

# Проверка 4: Ingress
echo "4️⃣  Проверка Ingress..."
INGRESS_IP=$(kubectl get ingress -n gitlab gitlab-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
if [ -n "$INGRESS_IP" ]; then
    echo "   ✅ Ingress настроен (IP: $INGRESS_IP)"
else
    echo "   ⚠️  Ingress IP не назначен"
fi
echo ""

# Проверка 5: SSL сертификат
echo "5️⃣  Проверка SSL сертификата..."
CERT_READY=$(kubectl get certificate -n gitlab gitlab-tls -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "Unknown")

if [ "$CERT_READY" = "True" ]; then
    echo "   ✅ SSL сертификат готов"
elif [ "$CERT_READY" = "False" ]; then
    echo "   ⚠️  SSL сертификат еще не готов (cert-manager выдает)"
    echo "   💡 Это может занять несколько минут"
else
    echo "   ⚠️  Статус сертификата: $CERT_READY"
fi
echo ""

# Проверка 6: Доступность через IP
echo "6️⃣  Проверка доступности через IP ($GITLAB_IP)..."
IP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" -H "Host: gitlab.gyber.org" "https://$GITLAB_IP" --connect-timeout 5 2>/dev/null || echo "000")

if [ "$IP_CODE" = "200" ] || [ "$IP_CODE" = "302" ] || [ "$IP_CODE" = "301" ]; then
    echo "   ✅ GitLab доступен через IP (HTTP $IP_CODE)"
else
    echo "   ⚠️  GitLab недоступен через IP (HTTP $IP_CODE)"
fi
echo ""

# Проверка 7: Доступность через домен
echo "7️⃣  Проверка доступности через домен ($GITLAB_URL)..."
DOMAIN_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$GITLAB_URL" --connect-timeout 10 2>/dev/null || echo "000")

if [ "$DOMAIN_CODE" = "200" ] || [ "$DOMAIN_CODE" = "302" ] || [ "$DOMAIN_CODE" = "301" ]; then
    echo "   ✅ GitLab доступен через домен (HTTP $DOMAIN_CODE)"
    DOMAIN_AVAILABLE=true
else
    echo "   ⚠️  GitLab недоступен через домен (HTTP $DOMAIN_CODE)"
    echo "   💡 Возможные причины:"
    echo "      - DNS не настроен или еще не распространился"
    echo "      - SSL сертификат еще не готов"
    echo "      - Проблемы с сетью"
    DOMAIN_AVAILABLE=false
fi
echo ""

# Итоговая информация
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$DOMAIN_AVAILABLE" = "true" ]; then
    echo "✅ GITLAB ДОСТУПЕН ПО ДОМЕНУ"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Откройте в браузере: $GITLAB_URL"
    echo ""
    echo "📋 Данные для входа:"
    echo "   Логин:    root"
    echo "   Пароль:   $ROOT_PASSWORD"
    echo ""
    echo "📋 Следующие шаги:"
    echo "   1. Откройте $GITLAB_URL в браузере"
    echo "   2. Войдите с данными выше"
    echo "   3. Перейдите: Settings → Access Tokens"
    echo "   4. Создайте токен с правами: api, read_user, read_repository, write_repository, sudo"
    echo "   5. Сохраните токен: echo 'ваш-токен' > k8s/gitlab/.gitlab-token"
    echo "   6. Настройте переменные: ./k8s/gitlab/setup-env-now.sh"
    echo ""
    
    # Пытаемся открыть в браузере (macOS)
    if command -v open &> /dev/null; then
        echo "🌐 Открываю в браузере..."
        open "$GITLAB_URL" 2>/dev/null || true
    fi
else
    echo "⚠️  GITLAB НЕ ДОСТУПЕН ПО ДОМЕНУ (НО РАБОТАЕТ ВНУТРИ КЛАСТЕРА)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "💡 Рекомендации:"
    echo ""
    echo "1. Проверьте DNS настройки:"
    echo "   gitlab.gyber.org должен указывать на $GITLAB_IP"
    echo "   Проверьте: dig gitlab.gyber.org"
    echo ""
    echo "2. Дождитесь выдачи SSL сертификата:"
    echo "   kubectl get certificate -n gitlab gitlab-tls"
    echo "   kubectl describe certificate -n gitlab gitlab-tls"
    echo ""
    echo "3. Проверьте логи cert-manager:"
    echo "   kubectl logs -n cert-manager -l app=cert-manager --tail=20"
    echo ""
    echo "4. Временное решение - доступ через IP (без SSL):"
    echo "   Добавьте в /etc/hosts:"
    echo "   $GITLAB_IP gitlab.gyber.org"
    echo "   Затем откройте: http://gitlab.gyber.org (без https)"
    echo ""
fi


