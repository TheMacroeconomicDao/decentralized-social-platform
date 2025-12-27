#!/bin/bash

# Полное исправление и развертывание DSP + Community Lab
# Диагностика, сборка, развертывание всех компонентов

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 ПОЛНАЯ ДИАГНОСТИКА И ИСПРАВЛЕНИЕ DSP + COMMUNITY LAB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Получаем коммит
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "📦 Коммит: $COMMIT_HASH"
echo ""

# ============================================================================
# ШАГ 1: ДИАГНОСТИКА
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ШАГ 1: ДИАГНОСТИКА КЛАСТЕРА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 Проверка DSP Production..."
DSP_PODS=$(kubectl get pods -n default -l app=dsp-prod 2>/dev/null | wc -l)
DSP_DEPLOYMENT=$(kubectl get deployment dsp-prod-deployment -n default 2>/dev/null | wc -l)

if [ "$DSP_DEPLOYMENT" -eq "0" ]; then
    echo -e "${RED}❌ DSP Production deployment не найден${NC}"
    DSP_EXISTS=false
else
    echo -e "${GREEN}✅ DSP Production deployment найден${NC}"
    kubectl get deployment dsp-prod-deployment -n default
    DSP_EXISTS=true
fi

if [ "$DSP_PODS" -eq "0" ]; then
    echo -e "${YELLOW}⚠️  DSP Production поды не найдены${NC}"
else
    echo -e "${GREEN}✅ DSP Production поды найдены:${NC}"
    kubectl get pods -n default -l app=dsp-prod
fi

echo ""
echo "🔍 Проверка Community Lab (GitLab)..."
GITLAB_POD=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -z "$GITLAB_POD" ]; then
    echo -e "${RED}❌ GitLab pod не найден${NC}"
    GITLAB_EXISTS=false
else
    echo -e "${GREEN}✅ GitLab pod найден: $GITLAB_POD${NC}"
    kubectl get pods -n gitlab -l app=gitlab
    GITLAB_EXISTS=true
fi

echo ""
echo "🔍 Проверка Ingress..."
kubectl get ingress -A | grep -E "gyber.org|lab" || echo "Ingress не найден"

echo ""
echo "🔍 Проверка доступности изнутри кластера..."
DSP_SERVICE_IP=$(kubectl get service dsp-prod-service -n default -o jsonpath='{.spec.clusterIP}' 2>/dev/null || echo "")
GITLAB_SERVICE_IP=$(kubectl get service gitlab -n gitlab -o jsonpath='{.spec.clusterIP}' 2>/dev/null || echo "")

if [ -n "$DSP_SERVICE_IP" ]; then
    echo "DSP Service IP: $DSP_SERVICE_IP"
    kubectl run -it --rm debug-dsp --image=curlimages/curl --restart=Never -- \
      curl -s -o /dev/null -w "DSP HTTP код: %{http_code}\n" -H "Host: gyber.org" http://$DSP_SERVICE_IP 2>/dev/null || echo "DSP недоступен"
fi

if [ -n "$GITLAB_SERVICE_IP" ]; then
    echo "GitLab Service IP: $GITLAB_SERVICE_IP"
    kubectl run -it --rm debug-gitlab --image=curlimages/curl --restart=Never -- \
      curl -s -o /dev/null -w "GitLab HTTP код: %{http_code}\n" -H "Host: gyber.org" http://$GITLAB_SERVICE_IP/lab 2>/dev/null || echo "GitLab недоступен"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 ШАГ 2: СБОРКА ОБРАЗОВ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔨 Сборка DSP Production образа..."
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile . 2>&1 | tail -5

echo ""
echo "✅ Образ собран: dsp-prod:$COMMIT_HASH"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 ШАГ 3: PUSH В REGISTRY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⚠️  Push требует авторизации в GHCR"
echo "   Для автоматического push используйте GitLab CI/CD"
echo "   Или выполните вручную:"
echo "   docker login ghcr.io -u TheMacroeconomicDao"
echo "   docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH"
echo ""

# Попытка push (может не сработать без авторизации)
if docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH 2>/dev/null; then
    echo -e "${GREEN}✅ Образ запушен в registry${NC}"
    docker tag ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
      ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest
    docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:latest 2>/dev/null || true
else
    echo -e "${YELLOW}⚠️  Push не выполнен (требуется авторизация)${NC}"
    echo "   Используйте локальный образ или настройте GitLab CI/CD"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ШАГ 4: РАЗВЕРТЫВАНИЕ DSP PRODUCTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$DSP_EXISTS" = false ]; then
    echo "📝 Создание DSP Production deployment..."
    kubectl apply -k k8s/overlays/prod/
else
    echo "🔄 Обновление DSP Production deployment..."
    kubectl apply -k k8s/overlays/prod/
fi

# Используем локальный образ если push не удался
if docker images | grep -q "dsp-prod:$COMMIT_HASH"; then
    echo "🔄 Обновление образа в deployment..."
    kubectl set image deployment/dsp-prod-deployment \
      dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
      -n default 2>/dev/null || \
    kubectl set image deployment/dsp-prod-deployment-primary \
      dsp-prod-primary=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
      -n default 2>/dev/null || echo "⚠️  Не удалось обновить образ (возможно используется другой deployment)"
fi

echo "⏳ Ожидание rollout..."
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s -n default 2>/dev/null || \
kubectl rollout status deployment/dsp-prod-deployment-primary --timeout=600s -n default 2>/dev/null || \
echo "⚠️  Rollout timeout или deployment не найден"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 ШАГ 5: ИСПРАВЛЕНИЕ COMMUNITY LAB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$GITLAB_EXISTS" = true ]; then
    echo "🔧 Применение конфигурации GitLab..."
    kubectl exec -n gitlab $GITLAB_POD -- gitlab-ctl reconfigure 2>&1 | tail -3
    
    echo ""
    echo "🔄 Перезапуск GitLab..."
    kubectl exec -n gitlab $GITLAB_POD -- gitlab-ctl restart 2>&1 | tail -5
    
    echo ""
    echo "⏳ Ожидание запуска GitLab (30 секунд)..."
    sleep 30
    
    echo ""
    echo "🔍 Проверка доступности GitLab..."
    kubectl exec -n gitlab $GITLAB_POD -- curl -s -I http://localhost:80/lab 2>&1 | head -3
else
    echo -e "${RED}❌ GitLab не найден, пропускаем${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ФИНАЛЬНАЯ ПРОВЕРКА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📊 Статус DSP Production:"
kubectl get pods -n default -l app=dsp-prod 2>/dev/null || echo "Поды не найдены"

echo ""
echo "📊 Статус Community Lab:"
kubectl get pods -n gitlab -l app=gitlab 2>/dev/null || echo "Поды не найдены"

echo ""
echo "🌐 Проверка доступности:"
sleep 10
curl -s -o /dev/null -w "DSP (gyber.org): HTTP %{http_code}\n" https://gyber.org --max-time 10 || echo "DSP недоступен"
curl -s -o /dev/null -w "Lab (gyber.org/lab): HTTP %{http_code}\n" https://gyber.org/lab --max-time 10 || echo "Lab недоступен"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ЗАВЕРШЕНО"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Проверьте доступность: https://gyber.org"
echo "   2. Проверьте Community Lab: https://gyber.org/lab"
echo "   3. Настройте GitLab CI/CD для автоматизации (см. k8s/gitlab/GITLAB_CI_SETUP.md)"
echo ""

