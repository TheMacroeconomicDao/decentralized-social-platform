#!/bin/bash
set -e

echo "🚀 DSP - Полный деплой в Production"
echo ""

# 1. Переход в проект
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
echo "✅ В директории проекта"

# 2. Проверка что на main ветке
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️  Внимание: вы не на ветке main (текущая: $CURRENT_BRANCH)"
  read -p "Продолжить? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 3. Pull последних изменений
echo "📥 Получаю последние изменения..."
git pull origin main
echo "✅ Main ветка обновлена"

# 4. Проверка Docker
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker не запущен! Запустите Docker Desktop и повторите попытку."
  exit 1
fi
echo "✅ Docker работает"

# 5. Получение хеша коммита
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "📝 Хеш коммита: $COMMIT_HASH"

# 6. Сборка образа
echo "🔨 Собираю образ (10-15 минут)..."
docker build \
  -t ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -f Dockerfile .

echo "✅ Образ собран: dsp-prod:$COMMIT_HASH"

# 7. Push в registry
echo "📤 Пушу в registry..."
docker push ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH
echo "✅ Образ запушен"

# 8. Deploy в Kubernetes
echo "🚀 Деплою в Kubernetes..."
kubectl apply -k k8s/overlays/prod/
kubectl set image deployment/dsp-prod-deployment \
  dsp-prod=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-prod:$COMMIT_HASH \
  -n default
kubectl rollout status deployment/dsp-prod-deployment --timeout=600s
echo "✅ Deployment завершен"

# 9. Проверка статуса
echo ""
echo "📊 Статус подов:"
kubectl get pods -l app=dsp-prod -n default

echo ""
echo "📦 Используемый образ:"
kubectl describe deployment dsp-prod-deployment -n default | grep "Image:"

echo ""
echo "🧪 Тест Health API:"
curl -s https://gyber.org/api/health | jq . || echo "⚠️  Health check не доступен (возможно еще запускается)"

echo ""
echo "🎉 Деплой завершен успешно!"
echo "🌐 Production URL: https://gyber.org"
echo "📝 Commit: $COMMIT_HASH"
