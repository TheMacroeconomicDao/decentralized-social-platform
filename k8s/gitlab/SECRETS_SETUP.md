# 🔐 Настройка секретов в GitLab

## Переменные CI/CD в GitLab

Настройте следующие переменные в GitLab:
**Settings → CI/CD → Variables**

### Обязательные переменные:

1. **GHCR_USERNAME**
   - Value:  (или ваш username)
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
   - Получить: `cat ~/.kube/config | base64 | tr -d '\n'`

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

```bash
# Установите переменные
export GITLAB_TOKEN="ваш-токен"
export GITLAB_URL="https://gitlab.gyber.org"
export PROJECT_ID="root%2Fdecentralized-social-platform"

# GHCR_USERNAME
curl -X POST "${GITLAB_URL}/api/v4/projects/${PROJECT_ID}/variables" \
  -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"key": "GHCR_USERNAME", "value": "TheMacroeconomicDao", "protected": true}'

# GHCR_TOKEN
curl -X POST "${GITLAB_URL}/api/v4/projects/${PROJECT_ID}/variables" \
  -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"key": "GHCR_TOKEN", "value": "ваш-ghcr-token", "protected": true, "masked": true}'

# KUBE_CONFIG
KUBE_CONFIG_B64=$(cat ~/.kube/config | base64 | tr -d '\n')
curl -X POST "${GITLAB_URL}/api/v4/projects/${PROJECT_ID}/variables" \
  -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"key\": \"KUBE_CONFIG\", \"value\": \"${KUBE_CONFIG_B64}\", \"protected\": true, \"masked\": true}"

# KUBE_CONTEXT
curl -X POST "${GITLAB_URL}/api/v4/projects/${PROJECT_ID}/variables" \
  -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"key": "KUBE_CONTEXT", "value": "default", "protected": true}'
```

## Использование секретов в Kubernetes

Секреты из GitLab CI/CD Variables автоматически доступны в пайплайнах через переменные окружения.

Для использования в Kubernetes deployments, создайте секреты:

```bash
# Создать секрет из GitLab переменной (в CI/CD)
kubectl create secret generic ghcr-secret \
  --from-literal=username=$GHCR_USERNAME \
  --from-literal=password=$GHCR_TOKEN \
  --namespace=default \
  --dry-run=client -o yaml | kubectl apply -f -
```
