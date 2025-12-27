#!/bin/bash

set -e

echo "🔧 Исправление DNS и SSL для GitLab"
echo ""

GITLAB_IP="65.108.15.30"
DOMAIN="gitlab.gyber.org"
NAMESPACE="gitlab"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ШАГ 1: Проверка DNS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Проверка DNS
echo "🔍 Проверяю DNS запись для $DOMAIN..."
DNS_RESULT=$(dig +short $DOMAIN @8.8.8.8 2>/dev/null || echo "")

if [ -z "$DNS_RESULT" ]; then
    echo -e "${RED}❌ DNS запись не найдена${NC}"
    echo ""
    echo "⚠️  ТРЕБУЕТСЯ НАСТРОЙКА DNS:"
    echo ""
    echo "   На DNS сервере для домена gyber.org создайте A запись:"
    echo "   ${YELLOW}gitlab.gyber.org -> $GITLAB_IP${NC}"
    echo ""
    echo "   После настройки DNS подождите 5-10 минут для распространения"
    echo "   и запустите этот скрипт снова."
    echo ""
    echo "   Для проверки DNS используйте:"
    echo "   ${YELLOW}dig +short gitlab.gyber.org @8.8.8.8${NC}"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ DNS запись найдена: $DNS_RESULT${NC}"
    
    if [ "$DNS_RESULT" != "$GITLAB_IP" ]; then
        echo -e "${YELLOW}⚠️  Внимание: DNS указывает на $DNS_RESULT, ожидается $GITLAB_IP${NC}"
        echo "   Возможно, DNS еще не обновился. Подождите несколько минут."
        echo ""
    else
        echo -e "${GREEN}✅ DNS указывает на правильный IP: $GITLAB_IP${NC}"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ШАГ 2: Проверка доступности GitLab"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Проверка HTTP доступности
echo "🔍 Проверяю доступность GitLab по HTTP..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: $DOMAIN" http://$GITLAB_IP --max-time 10 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}❌ GitLab недоступен по HTTP${NC}"
    echo "   Проверьте статус подов: kubectl get pods -n $NAMESPACE"
    exit 1
elif [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ GitLab доступен по HTTP (код: $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  GitLab отвечает с кодом: $HTTP_CODE${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ШАГ 3: Пересоздание SSL сертификата"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Удаление старого Certificate (если есть)
echo "🗑️  Удаляю старый Certificate (если существует)..."
kubectl delete certificate -n $NAMESPACE gitlab-tls 2>/dev/null || echo "   Certificate не найден, пропускаю"

# Удаление старых Order и Challenge
echo "🗑️  Удаляю старые Order и Challenge..."
kubectl delete order -n $NAMESPACE --all 2>/dev/null || true
kubectl delete challenge -n $NAMESPACE --all 2>/dev/null || true

echo ""
echo "⏳ Ожидаю 5 секунд..."
sleep 5

# Проверка, что Ingress пересоздаст Certificate
echo "✅ Certificate будет автоматически пересоздан Ingress'ом"
echo ""

# Мониторинг Certificate
echo "🔍 Ожидаю создания Certificate..."
for i in {1..30}; do
    CERT=$(kubectl get certificate -n $NAMESPACE gitlab-tls 2>/dev/null || echo "")
    if [ -n "$CERT" ]; then
        echo -e "${GREEN}✅ Certificate создан${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠️  Certificate еще не создан, проверьте вручную:${NC}"
        echo "   kubectl get certificate -n $NAMESPACE"
        break
    fi
    sleep 2
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ШАГ 4: Мониторинг получения SSL сертификата"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⏳ Ожидаю получения SSL сертификата от Let's Encrypt..."
echo "   Это может занять 1-5 минут"
echo ""

MAX_WAIT=300  # 5 минут
ELAPSED=0
INTERVAL=10

while [ $ELAPSED -lt $MAX_WAIT ]; do
    CERT_READY=$(kubectl get certificate -n $NAMESPACE gitlab-tls -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "False")
    
    if [ "$CERT_READY" = "True" ]; then
        echo -e "${GREEN}✅ SSL сертификат успешно получен!${NC}"
        echo ""
        break
    fi
    
    # Показываем статус каждые 30 секунд
    if [ $((ELAPSED % 30)) -eq 0 ]; then
        STATUS=$(kubectl get certificate -n $NAMESPACE gitlab-tls -o jsonpath='{.status.conditions[?(@.type=="Ready")].reason}' 2>/dev/null || echo "Unknown")
        echo "   Статус: $STATUS (прошло ${ELAPSED}с)"
    fi
    
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ "$CERT_READY" != "True" ]; then
    echo -e "${YELLOW}⚠️  Сертификат еще не готов после $MAX_WAIT секунд${NC}"
    echo ""
    echo "Проверьте статус вручную:"
    echo "   kubectl describe certificate -n $NAMESPACE gitlab-tls"
    echo "   kubectl describe challenge -n $NAMESPACE"
    echo ""
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ПРОВЕРКА ДОСТУПНОСТИ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Финальная проверка HTTPS
echo "🔍 Проверяю доступность по HTTPS..."
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN --max-time 10 2>/dev/null || echo "000")

if [ "$HTTPS_CODE" = "000" ]; then
    echo -e "${YELLOW}⚠️  HTTPS пока недоступен (возможно, нужно подождать распространения)${NC}"
elif [ "$HTTPS_CODE" = "200" ] || [ "$HTTPS_CODE" = "302" ]; then
    echo -e "${GREEN}✅ GitLab доступен по HTTPS (код: $HTTPS_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS отвечает с кодом: $HTTPS_CODE${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ЗАВЕРШЕНО"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "GitLab должен быть доступен по адресу:"
echo -e "   ${GREEN}https://$DOMAIN${NC}"
echo ""
echo "Root пароль:"
echo "   73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk="
echo ""

