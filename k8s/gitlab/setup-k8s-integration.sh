#!/bin/bash
set -e

echo "☸️  Настройка интеграции Kubernetes с GitLab"
echo ""

# Загрузка токена
if [ -f "k8s/gitlab/.gitlab-token" ]; then
    GITLAB_TOKEN=$(cat k8s/gitlab/.gitlab-token)
    echo "✅ Токен загружен"
elif [ -n "$GITLAB_TOKEN" ]; then
    echo "✅ Токен из переменной окружения"
else
    echo "❌ Токен не найден!"
    exit 1
fi

GITLAB_URL="https://gitlab.gyber.org"
PROJECT_NAME="decentralized-social-platform"
PROJECT_PATH="root/${PROJECT_NAME}"

echo "🌐 GitLab URL: $GITLAB_URL"
echo "📦 Проект: $PROJECT_PATH"
echo ""

# Создаем namespace для GitLab CI/CD если нужно
echo "📦 Проверяю namespace для GitLab Runner..."
kubectl create namespace gitlab-runner --dry-run=client -o yaml | kubectl apply -f - 2>/dev/null || true

# Создаем секрет с GitLab токеном для Kubernetes
echo "🔐 Создаю Kubernetes secret с GitLab токеном..."
kubectl create secret generic gitlab-token \
  --from-literal=token="$GITLAB_TOKEN" \
  --from-literal=url="$GITLAB_URL" \
  --namespace=default \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic gitlab-token \
  --from-literal=token="$GITLAB_TOKEN" \
  --from-literal=url="$GITLAB_URL" \
  --namespace=gitlab-runner \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secret создан"
echo ""

# Создаем конфигурационный файл для GitLab CI/CD
echo "📝 Создаю .gitlab-ci.yml..."
cat > .gitlab-ci.yml <<'EOF'
stages:
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  REGISTRY: ghcr.io
  IMAGE_NAME: themacroeconomicdao/decentralized-social-platform

build-stage:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $GHCR_USERNAME -p $GHCR_TOKEN $REGISTRY
  script:
    - |
      COMMIT_HASH=$(echo $CI_COMMIT_SHA | cut -c1-7)
      docker build -t $REGISTRY/$IMAGE_NAME/dsp-stage:$COMMIT_HASH -f Dockerfile .
      docker push $REGISTRY/$IMAGE_NAME/dsp-stage:$COMMIT_HASH
      docker tag $REGISTRY/$IMAGE_NAME/dsp-stage:$COMMIT_HASH $REGISTRY/$IMAGE_NAME/dsp-stage:latest
      docker push $REGISTRY/$IMAGE_NAME/dsp-stage:latest
  only:
    - stage

deploy-stage:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - |
      kubectl config use-context $KUBE_CONTEXT || true
      COMMIT_HASH=$(echo $CI_COMMIT_SHA | cut -c1-7)
      kubectl apply -k k8s/overlays/stage/
      kubectl set image deployment/dsp-stage-deployment \
        dsp-stage=$REGISTRY/$IMAGE_NAME/dsp-stage:$COMMIT_HASH \
        -n default
      kubectl rollout status deployment/dsp-stage-deployment --timeout=300s -n default
  only:
    - stage
  when: on_success

build-prod:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $GHCR_USERNAME -p $GHCR_TOKEN $REGISTRY
  script:
    - |
      COMMIT_HASH=$(echo $CI_COMMIT_SHA | cut -c1-7)
      docker build -t $REGISTRY/$IMAGE_NAME/dsp-prod:$COMMIT_HASH -f Dockerfile .
      docker push $REGISTRY/$IMAGE_NAME/dsp-prod:$COMMIT_HASH
      docker tag $REGISTRY/$IMAGE_NAME/dsp-prod:$COMMIT_HASH $REGISTRY/$IMAGE_NAME/dsp-prod:latest
      docker push $REGISTRY/$IMAGE_NAME/dsp-prod:latest
  only:
    - main
  when: manual

deploy-prod:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - |
      kubectl config use-context $KUBE_CONTEXT || true
      COMMIT_HASH=$(echo $CI_COMMIT_SHA | cut -c1-7)
      kubectl apply -k k8s/overlays/prod/
      kubectl set image deployment/dsp-prod-deployment \
        dsp-prod=$REGISTRY/$IMAGE_NAME/dsp-prod:$COMMIT_HASH \
        -n default
      kubectl rollout status deployment/dsp-prod-deployment --timeout=600s -n default
  only:
    - main
  when: manual
EOF

echo "✅ .gitlab-ci.yml создан"
echo ""

# Создаем инструкцию по настройке переменных в GitLab
echo "📋 Создаю инструкцию по настройке секретов..."
cat > k8s/gitlab/SECRETS_SETUP.md <<EOF
# 🔐 Настройка секретов в GitLab

## Переменные CI/CD в GitLab

Настройте следующие переменные в GitLab:
**Settings → CI/CD → Variables**

### Обязательные переменные:

1. **GHCR_USERNAME**
   - Value: `TheMacroeconomicDao` (или ваш username)
   - Protected: ✅
   - Masked: ❌

2. **GHCR_TOKEN**
   - Value: (ваш GitHub Personal Access Token с правами packages:write)
   - Protected: ✅
   - Masked: ✅

3. **KUBE_CONFIG**
   - Value: (base64 encoded kubeconfig)
   - Protected: ✅
   - Masked: ✅
   - Получить: \`cat ~/.kube/config | base64 | tr -d '\n'\`

4. **KUBE_CONTEXT**
   - Value: (имя контекста Kubernetes, например: default)
   - Protected: ✅
   - Masked: ❌

### Опциональные переменные:

5. **OPENAI_API_KEY** (если используется)
   - Value: (ваш OpenAI API ключ)
   - Protected: ✅
   - Masked: ✅

## Настройка через API:

\`\`\`bash
# Установите переменные
export GITLAB_TOKEN="ваш-токен"
export GITLAB_URL="https://gitlab.gyber.org"
export PROJECT_ID="root%2Fdecentralized-social-platform"

# GHCR_USERNAME
curl -X POST "\${GITLAB_URL}/api/v4/projects/\${PROJECT_ID}/variables" \\
  -H "PRIVATE-TOKEN: \${GITLAB_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "GHCR_USERNAME", "value": "TheMacroeconomicDao", "protected": true}'

# GHCR_TOKEN
curl -X POST "\${GITLAB_URL}/api/v4/projects/\${PROJECT_ID}/variables" \\
  -H "PRIVATE-TOKEN: \${GITLAB_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "GHCR_TOKEN", "value": "ваш-ghcr-token", "protected": true, "masked": true}'

# KUBE_CONFIG
KUBE_CONFIG_B64=\$(cat ~/.kube/config | base64 | tr -d '\n')
curl -X POST "\${GITLAB_URL}/api/v4/projects/\${PROJECT_ID}/variables" \\
  -H "PRIVATE-TOKEN: \${GITLAB_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d "{\"key\": \"KUBE_CONFIG\", \"value\": \"\${KUBE_CONFIG_B64}\", \"protected\": true, \"masked\": true}"

# KUBE_CONTEXT
curl -X POST "\${GITLAB_URL}/api/v4/projects/\${PROJECT_ID}/variables" \\
  -H "PRIVATE-TOKEN: \${GITLAB_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "KUBE_CONTEXT", "value": "default", "protected": true}'
\`\`\`

## Использование секретов в Kubernetes

Секреты из GitLab CI/CD Variables автоматически доступны в пайплайнах через переменные окружения.

Для использования в Kubernetes deployments, создайте секреты:

\`\`\`bash
# Создать секрет из GitLab переменной (в CI/CD)
kubectl create secret generic ghcr-secret \\
  --from-literal=username=\$GHCR_USERNAME \\
  --from-literal=password=\$GHCR_TOKEN \\
  --namespace=default \\
  --dry-run=client -o yaml | kubectl apply -f -
\`\`\`
EOF

echo "✅ Инструкция создана: k8s/gitlab/SECRETS_SETUP.md"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ИНТЕГРАЦИЯ НАСТРОЕНА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Следующие шаги:"
echo ""
echo "1. Настройте переменные CI/CD в GitLab:"
echo "   https://gitlab.gyber.org/root/decentralized-social-platform/-/settings/ci_cd"
echo ""
echo "2. См. инструкцию: k8s/gitlab/SECRETS_SETUP.md"
echo ""
echo "3. Запушьте код в GitLab:"
echo "   git push gitlab main"
echo ""
echo "4. GitLab CI/CD автоматически соберет и задеплоит приложения"
echo ""

