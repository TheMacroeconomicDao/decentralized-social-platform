#!/bin/bash

# Пуш и развертывание образа d26596f65e2f по инструкции

set -e

IMAGE_HASH="d26596f65e2f"
REGISTRY="ghcr.io"
IMAGE_NAME="themacroeconomicdao/decentralized-social-platform"

echo "🚀 Пуш и развертывание образа: $IMAGE_HASH"
echo ""

# Определяем окружение (stage или prod)
ENVIRONMENT="${1:-stage}"

if [ "$ENVIRONMENT" = "prod" ]; then
    IMAGE_TAG="${REGISTRY}/${IMAGE_NAME}/dsp-prod:${IMAGE_HASH}"
    DEPLOYMENT_NAME="dsp-prod-deployment"
    CONTAINER_NAME="dsp-prod"
    echo "📦 Окружение: PRODUCTION"
else
    IMAGE_TAG="${REGISTRY}/${IMAGE_NAME}/dsp-stage:${IMAGE_HASH}"
    DEPLOYMENT_NAME="dsp-stage-deployment"
    CONTAINER_NAME="dsp-stage"
    echo "📦 Окружение: STAGE"
fi

echo "🖼️  Образ: $IMAGE_TAG"
echo ""

# Проверяем, есть ли образ локально
echo "🔍 Поиск образа локально..."
if docker images | grep -q "$IMAGE_HASH"; then
    echo "✅ Образ найден локально"
    LOCAL_IMAGE=$(docker images | grep "$IMAGE_HASH" | awk '{print $1":"$2}' | head -1)
    echo "   Тегируем: $LOCAL_IMAGE -> $IMAGE_TAG"
    docker tag "$LOCAL_IMAGE" "$IMAGE_TAG"
else
    echo "⚠️  Образ с хешем $IMAGE_HASH не найден локально"
    echo "💡 Пытаемся найти образ с digest или собираем новый..."
    
    # Пытаемся найти образ по digest
    if docker images --digests | grep -q "$IMAGE_HASH"; then
        DIGEST_IMAGE=$(docker images --digests | grep "$IMAGE_HASH" | awk '{print $1":"$2}' | head -1)
        echo "✅ Найден образ с digest: $DIGEST_IMAGE"
        docker tag "$DIGEST_IMAGE" "$IMAGE_TAG"
    else
        echo "❌ Образ не найден. Нужно собрать новый образ."
        echo ""
        echo "📦 Сборка образа..."
        COMMIT_HASH=$(git rev-parse --short HEAD)
        docker build \
            -t "$IMAGE_TAG" \
            -t "${REGISTRY}/${IMAGE_NAME}/dsp-${ENVIRONMENT}:latest" \
            -f Dockerfile .
        echo "✅ Образ собран"
    fi
fi

# Логин в GHCR (если нужно)
echo ""
echo "🔐 Проверка доступа к registry..."
if ! docker pull "$IMAGE_TAG" 2>/dev/null; then
    echo "⚠️  Не удалось получить образ из registry"
    echo "💡 Убедитесь, что вы авторизованы:"
    echo "   echo \$GHCR_TOKEN | docker login ghcr.io -u \$GHCR_USERNAME --password-stdin"
fi

# Push образа
echo ""
echo "📤 Push образа в registry..."
docker push "$IMAGE_TAG"
docker push "${REGISTRY}/${IMAGE_NAME}/dsp-${ENVIRONMENT}:latest" || true

echo "✅ Образ запушен"
echo ""

# Deploy по инструкции
echo "☸️  Развертывание в Kubernetes..."
echo ""

# Применяем манифесты
echo "1️⃣  Применение манифестов..."
kubectl apply -k k8s/overlays/${ENVIRONMENT}/

# Обновляем образ
echo ""
echo "2️⃣  Обновление образа deployment..."
kubectl set image deployment/$DEPLOYMENT_NAME \
    $CONTAINER_NAME=$IMAGE_TAG \
    -n default

# Ждем rollout
echo ""
echo "3️⃣  Ожидание завершения rollout..."
if kubectl rollout status deployment/$DEPLOYMENT_NAME --timeout=300s -n default; then
    echo ""
    echo "✅ Deployment успешно обновлен!"
else
    echo ""
    echo "⚠️  Rollout не завершился в течение 5 минут"
fi

# Показываем статус
echo ""
echo "📊 Текущий статус:"
kubectl get pods -l app=$CONTAINER_NAME -n default
kubectl get deployment $DEPLOYMENT_NAME -n default

echo ""
echo "🎉 Готово! Образ $IMAGE_HASH развернут в $ENVIRONMENT"




