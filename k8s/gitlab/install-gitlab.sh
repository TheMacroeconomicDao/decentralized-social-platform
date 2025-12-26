#!/bin/bash
set -e

echo "🚀 Установка GitLab в Kubernetes кластер"
echo ""

# Проверка Helm
if ! command -v helm &> /dev/null; then
    echo "❌ Helm не установлен!"
    exit 1
fi

# Проверка kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl не установлен!"
    exit 1
fi

# Проверка подключения к кластеру
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Не удается подключиться к кластеру!"
    exit 1
fi

echo "✅ Предварительные проверки пройдены"
echo ""

# Создание namespace (если не существует)
kubectl create namespace gitlab --dry-run=client -o yaml | kubectl apply -f -

# Добавление репозитория (если еще не добавлен)
if ! helm repo list | grep -q gitlab; then
    echo "📦 Добавляю GitLab Helm репозиторий..."
    helm repo add gitlab https://charts.gitlab.io
    helm repo update
fi

echo "📦 Устанавливаю GitLab..."
echo "⚠️  Это может занять 10-15 минут..."

# Установка GitLab
helm upgrade --install gitlab gitlab/gitlab \
  --namespace gitlab \
  --timeout 20m \
  --values k8s/gitlab/values.yaml \
  --wait

echo ""
echo "✅ GitLab установлен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Получить root пароль:"
echo "   kubectl get secret gitlab-gitlab-initial-root-password -n gitlab -o jsonpath='{.data.password}' | base64 -d && echo"
echo ""
echo "2. Проверить статус подов:"
echo "   kubectl get pods -n gitlab"
echo ""
echo "3. Открыть GitLab в браузере:"
echo "   https://gitlab.gyber.org"
echo ""
echo "4. Войти с логином: root и паролем из шага 1"

