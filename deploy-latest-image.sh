#!/bin/bash

# Развертывание последнего собранного образа в Kubernetes

set -e

# Хеш образа из последнего билда
IMAGE_HASH="d26596f65e2f"
REGISTRY="ghcr.io"
IMAGE_NAME="themacroeconomicdao/decentralized-social-platform"

echo "🚀 Развертывание последнего образа: $IMAGE_HASH"
echo ""

# Определяем, какое окружение обновлять
ENVIRONMENT="${1:-stage}"

if [ "$ENVIRONMENT" = "prod" ]; then
    DEPLOYMENT_NAME="dsp-prod-deployment"
    CONTAINER_NAME="dsp-prod"
    IMAGE_TAG="${REGISTRY}/${IMAGE_NAME}/dsp-prod:${IMAGE_HASH}"
    echo "📦 Окружение: PRODUCTION"
else
    DEPLOYMENT_NAME="dsp-stage-deployment"
    CONTAINER_NAME="dsp-stage"
    IMAGE_TAG="${REGISTRY}/${IMAGE_NAME}/dsp-stage:${IMAGE_HASH}"
    echo "📦 Окружение: STAGE"
fi

echo "🖼️  Образ: $IMAGE_TAG"
echo ""

# Проверяем доступность кластера
echo "☸️  Проверка доступа к кластеру..."
kubectl cluster-info --request-timeout=5s > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Ошибка: Не удается подключиться к Kubernetes кластеру"
    exit 1
fi

# Проверяем существование deployment
echo "🔍 Проверка deployment..."
if ! kubectl get deployment $DEPLOYMENT_NAME -n default > /dev/null 2>&1; then
    echo "❌ Deployment $DEPLOYMENT_NAME не найден"
    echo "💡 Создаю deployment..."
    kubectl apply -k k8s/overlays/${ENVIRONMENT}/
    sleep 5
fi

# Обновляем образ
echo "🔄 Обновление образа deployment..."
kubectl set image deployment/$DEPLOYMENT_NAME \
    $CONTAINER_NAME=$IMAGE_TAG \
    -n default

echo "✅ Образ обновлен"
echo ""

# Ждем rollout
echo "⏳ Ожидание завершения rollout (максимум 5 минут)..."
if kubectl rollout status deployment/$DEPLOYMENT_NAME --timeout=300s -n default; then
    echo ""
    echo "✅ Deployment успешно обновлен!"
else
    echo ""
    echo "⚠️  Rollout не завершился в течение 5 минут"
    echo "💡 Проверьте статус: kubectl rollout status deployment/$DEPLOYMENT_NAME -n default"
fi

# Показываем статус
echo ""
echo "📊 Текущий статус:"
kubectl get pods -l app=$CONTAINER_NAME -n default
kubectl get deployment $DEPLOYMENT_NAME -n default

echo ""
echo "🎉 Готово! Образ $IMAGE_HASH развернут в $ENVIRONMENT"



