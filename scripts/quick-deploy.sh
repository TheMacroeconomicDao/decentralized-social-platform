#!/bin/bash
set -e

COMMIT_HASH=$(git rev-parse --short HEAD)
echo "🚀 Деплой DSP Production"
echo "📝 Commit: $COMMIT_HASH"
echo ""

# Проверка Docker
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker не запущен!"
  echo "💡 Запустите: open -a Docker"
  exit 1
fi

echo "✅ Docker работает"
echo "🔨 Собираю образ..."
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile .

echo "📤 Пушу в registry..."
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH

echo "🚀 Деплою в Kubernetes..."
kubectl apply -k k8s/overlays/prod/
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s

echo "✅ Готово! https://gyber.org"
kubectl get pods -l app=dsp-prod -n default
