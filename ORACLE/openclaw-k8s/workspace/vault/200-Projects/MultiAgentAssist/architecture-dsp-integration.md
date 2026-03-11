---
tags: [architecture, multiagentassist, dsp, multi-tenant, openclaw]
created: 2026-03-09
source: analysis
status: draft-v1
---

# MultiAgentAssist × DSP — Integration Architecture

## Vision

**MultiAgentAssist (MAI)** — персональный AI-агент для каждого участника DSP-сети.
При инициализации в DSP у каждого пользователя автоматически поднимается изолированный
OpenClaw-контейнер, подключённый к его Unit Profile, репозиториям, проектам и данным.

Основа: **OpenClaw v2026+** — API-совместимый AI gateway с skills, sub-agents, heartbeat.

---

## Архитектура: один изолированный инстанс на пользователя

```
DSP Social Network
├── Unit Profile (userId, github, projects, prefs)
└── MAI Module ─────────────────────────────────────────────────┐
                                                                 │
                 MAI Provisioning Service (new component)        │
                 POST /api/v1/mai/provision                      │
                 ┌────────────────────────────────────┐          │
                 │  1. Create ns openclaw-{userId}    │          │
                 │  2. Create K8s Secret (user keys)  │◄─────────┘
                 │  3. Helm install openclaw           │
                 │  4. Wait pod Ready                  │
                 │  5. Deploy workspace (Unit Profile) │
                 │  6. Return connection info          │
                 └──────────────────┬─────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                       │
    Namespace: openclaw-alice   openclaw-bob          openclaw-carol
    ┌─────────────────────┐     ┌──────────────┐      ┌──────────────┐
    │ OpenClaw Pod        │     │ OpenClaw Pod │      │ OpenClaw Pod │
    │ ├── USER.md         │     │ ├── USER.md  │      │ ├── USER.md  │
    │ ├── vault/ (git)    │     │ ├── vault/   │      │ ├── vault/   │
    │ ├── skills/         │     │ ...          │      │ ...          │
    │ └── .env (secrets)  │     └──────────────┘      └──────────────┘
    │ PVC: 5Gi            │
    │ Telegram: DM paired │
    └─────────────────────┘
```

### Почему изолированные инстансы (не multi-agent в одном pod):
- Полная изоляция данных — vault одного пользователя недоступен другому
- Независимые API keys — каждый пользователь использует свои квоты
- Независимые сессии, история, модели
- Простой биллинг и resource quotas per namespace
- Безопасный `kubectl exec` и `persist-secret` scope

---

## Компоненты для разработки

### 1. MAI Provisioning Service

**Технология:** NestJS + `@kubernetes/client-node`

**API:**
```
POST   /api/v1/mai/provision        — создать инстанс для userId
DELETE /api/v1/mai/deprovision      — удалить инстанс
GET    /api/v1/mai/status/{userId}  — статус (provisioning/ready/error)
POST   /api/v1/mai/suspend/{userId} — suspend (scale to 0, сохранить PVC)
POST   /api/v1/mai/resume/{userId}  — resume (scale up)
GET    /api/v1/mai/connection/{userId} — Telegram pairing URL / WS endpoint
```

**Provisioning flow (POST /provision):**
```
1. Validate userId + DSP auth token
2. Fetch Unit Profile from DSP API:
   - github_username, github_token (OAuth)
   - telegram_id (if user has connected Telegram)
   - projects list, language preference
   - DSP profile: name, bio, skills, research interests
3. Generate per-user config:
   - CLAUDE_API_KEY: from user's API key OR shared pool
   - TELEGRAM_BOT_TOKEN: per-user bot OR shared bot with routing
   - BOT_GITHUB_TOKEN: user's GitHub OAuth token
   - DSP_USER_ID, DSP_UNIT_PROFILE_URL
4. kubectl: create namespace openclaw-{userId}
5. kubectl: apply NetworkPolicy (namespace isolation)
6. kubectl: apply ResourceQuota (user tier)
7. helm upgrade --install openclaw-{userId} openclaw/openclaw \
     --namespace openclaw-{userId} \
     --values base-values.yaml \
     --values user-values.yaml (generated)
8. Wait for pod Ready (poll /health)
9. kubectl exec: deploy workspace (USER.md, TOOLS.md, etc.)
10. kubectl exec: initialize vault git repo
11. Return: { status: "ready", telegramBotUrl, wsEndpoint }
```

### 2. DSP–OpenClaw Identity Bridge

Синхронизирует Unit Profile DSP → workspace файлы OpenClaw.

**Triggers:**
- При provisioning (первичное создание USER.md)
- При обновлении Unit Profile в DSP (webhook)
- По требованию: `/sync-profile` команда боту

**Mapping Unit Profile → USER.md:**
```yaml
# DSP Unit Profile fields → USER.md sections
displayName      → "Name: ..."
bio              → "About: ..."
github           → "GitHub: https://github.com/..."
skills[]         → "Tech Stack: ..."
projects[]       → "Active Projects: ..." (+ auto-add to TOOLS.md)
research         → "Research Interests: ..."
language_pref    → agent model language hint
telegram_id      → auto-pair on provisioning
```

**Auto-populate TOOLS.md GitHub section:**
```
For each project in Unit Profile:
  - repo: {github_username}/{repo_name}
  - Add to TOOLS.md.GitHub.repos[]
```

### 3. Multi-tenant Helm Values Template

Базовый `helm/values-multitenant-base.yaml` + генерируемый на каждого пользователя:

```yaml
# Generated per user by Provisioning Service
image:
  tag: "2026.3.2"

persistence:
  enabled: true
  size: "{{userTier.storageGi}}Gi"   # Free: 5Gi, Pro: 20Gi

openclaw:
  timezone: "{{user.timezone}}"
  configMode: "merge"

# Resource tier
resources:
  requests:
    cpu: "{{userTier.cpuRequest}}"
    memory: "{{userTier.memRequest}}"
  limits:
    cpu: "{{userTier.cpuLimit}}"
    memory: "{{userTier.memLimit}}"
```

**Tier matrix:**
| Tier | CPU req | CPU max | RAM req | RAM max | Storage | Models |
|------|---------|---------|---------|---------|---------|--------|
| Free | 100m | 500m | 256Mi | 512Mi | 5Gi | free models only |
| Pro | 250m | 2000m | 512Mi | 2Gi | 20Gi | all models |
| Enterprise | 500m | 4000m | 1Gi | 8Gi | 50Gi | all + priority |

### 4. Multi-tenant Ingress & Routing

```
*.mai.gyber.org  →  per-user routing
oracle.gyber.org →  Gybernaty admin instance (current)

Wildcard cert:  *.mai.gyber.org  (cert-manager, letsencrypt-prod)

Traefik routing rules:
  {userId}.mai.gyber.org  →  openclaw-{userId}/openclaw svc :18789
```

Or alternatively: shared WebSocket proxy with user-token based routing.

### 5. Telegram Bot Architecture

**Option A: Shared bot с per-user routing (рекомендуется для старта)**
- Один `@GybernMAI_bot` для всех пользователей DSP
- OpenClaw multi-agent: каждый Telegram userId маппится на свой agent (свой workspace)
- Pros: одна регистрация бота, дешевле, проще onboarding
- Cons: единая точка отказа, shared rate limits

**Option B: Per-user bot (полная изоляция)**
- При provisioning: `POST /BotFather/createBot` через Telegram Bot API
- Каждый пользователь получает своего `@{username}_MAI_bot`
- Pros: полная изоляция, персональный identity
- Cons: требует автоматизации BotFather через unofficial API (сложно), или пользователь регистрирует сам

**Рекомендация:** Старт с Option A (shared bot, multi-agent routing), переход на Option B когда пользователей > 1000.

---

## Security Model (многопользовательский контекст)

### Namespace Isolation
```yaml
# NetworkPolicy per user namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-cross-ns
  namespace: openclaw-{userId}
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
  ingress:
    # Allow only from Traefik ingress controller
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-system
  egress:
    # Allow HTTPS outbound (API calls)
    - ports: [{port: 443}]
    # Allow DNS
    - ports: [{port: 53, protocol: UDP}]
```

### Resource Quotas
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: openclaw-{userId}-quota
  namespace: openclaw-{userId}
spec:
  hard:
    pods: "3"
    requests.cpu: "500m"
    requests.memory: "1Gi"
    limits.cpu: "2"
    limits.memory: "4Gi"
    persistentvolumeclaims: "2"
    requests.storage: "25Gi"
```

### Secrets Isolation
- Каждый namespace имеет свой K8s Secret с пользовательскими ключами
- RBAC: ServiceAccount в namespace не имеет доступа к другим namespace
- Vault (Obsidian) каждого пользователя — приватный GitHub repo

### PodSecurityAdmission
```yaml
# Namespace label — restricted pod security
labels:
  pod-security.kubernetes.io/enforce: restricted
  pod-security.kubernetes.io/enforce-version: latest
```

---

## Требования к доработкам OpenClaw → MAI

### MAI-REQ-001: DSP Auth Bridge
**Задача:** Реализовать механизм передачи DSP user token при provisioning.
При старте OpenClaw pod читает `DSP_USER_TOKEN` из env и автоматически
запрашивает Unit Profile от DSP API, создавая USER.md.

**Компонент:** init-container или startup hook в Helm chart.
**Приоритет:** CRITICAL (без него provisioning ручной)

### MAI-REQ-002: Health/Ready Webhook
**Задача:** OpenClaw должен вызывать webhook при полной инициализации.
Provisioning Service ждёт этот callback чтобы вернуть `status: "ready"` DSP.

**Предлагаемый интерфейс:**
```yaml
# values.yaml
openclaw:
  lifecycle:
    onReady:
      webhook: "https://mai.gyber.org/api/v1/mai/callback/ready"
      headers:
        X-User-Id: "{{userId}}"
        X-Secret: "{{callbackSecret}}"
```
**Приоритет:** HIGH

### MAI-REQ-003: Multi-tenant Ingress Controller
**Задача:** Автоматически создавать Ingress record при provisioning нового пользователя.
Wildcart cert `*.mai.gyber.org` + Traefik dynamic routing по subdomain.

**Вариант А:** cert-manager wildcard cert + Ingress per user
**Вариант Б:** Traefik IngressRoute с wildcard host matching → middleware для routing по userId

**Приоритет:** HIGH

### MAI-REQ-004: Idle Scale-Down
**Задача:** Если пользователь не взаимодействовал > 7 дней — scale deployment to 0.
PVC сохраняется. При следующем сообщении в Telegram — auto scale-up.

**Механизм:**
- CronJob каждую ночь: проверяет timestamp последней активности
- Если idle > 7d: `kubectl scale deployment --replicas=0`
- Telegram → Provisioning Service webhook → scale up → route message

**Приоритет:** MEDIUM (critical для cost control)

### MAI-REQ-005: DSP Activity Feed Integration
**Задача:** Heartbeat агента должен уметь читать активность пользователя в DSP
(новые проекты, updates в Unit Profile, mentions, notifications).

**Интерфейс:** DSP REST API endpoint `GET /api/v1/users/{userId}/feed?since={ts}`
Агент читает feed каждый heartbeat через `tools.http` или custom skill.

**Приоритет:** MEDIUM

### MAI-REQ-006: Shared Model Pool (cost sharing)
**Задача:** Free tier пользователи используют общий OpenRouter API key (rate limited per user).
Pro/Enterprise — персональные ключи.

**Механизм:** Provisioning Service выдаёт API key из пула с user-level rate limiting.
Metering: подсчёт токенов per userId через OpenRouter usage API.

**Приоритет:** LOW (для масштабирования)

### MAI-REQ-007: Vault Federation
**Задача:** Пользователь может разрешить другим пользователям DSP читать часть своего vault
(public research notes, collaborative projects).

**Механизм:** vault/Public/ папка → публичный GitHub repo.
Cross-user vault links в wikilinks через DSP API.

**Приоритет:** LOW (post-MVP)

---

## Roadmap

### Phase 1 — MVP (текущий sprint)
- [x] Базовый OpenClaw деплой на K3s (done)
- [x] Security hardening (done)
- [x] Security agent team (done)
- [ ] TLS Ingress oracle.gyber.org (in progress)
- [ ] PVC Backup (in progress)
- [ ] DSP Integration Design Document (this file)

### Phase 2 — Provisioning Core
- [ ] MAI Provisioning Service (NestJS)
- [ ] Helm values template per user
- [ ] NetworkPolicy + ResourceQuota per namespace
- [ ] Unit Profile → USER.md bridge
- [ ] Telegram shared bot + multi-agent routing

### Phase 3 — DSP Integration
- [ ] DSP webhook → provisioning trigger
- [ ] Unit Profile auto-sync
- [ ] Multi-tenant Ingress (*.mai.gyber.org)
- [ ] Idle scale-down CronJob
- [ ] Billing/metering integration

### Phase 4 — Scale & Federation
- [ ] Per-user vault repos
- [ ] DSP Activity Feed integration
- [ ] Vault Federation (public research sharing)
- [ ] Enterprise features

---

## Технический стек MAI Provisioning Service

```
backend/
├── src/
│   ├── provisioning/         # Core provisioning logic
│   │   ├── provisioning.service.ts
│   │   ├── kubernetes.service.ts   # k8s client
│   │   ├── helm.service.ts          # helm install/upgrade
│   │   └── templates/
│   │       ├── user-values.yaml.hbs
│   │       ├── networkpolicy.yaml.hbs
│   │       └── resourcequota.yaml.hbs
│   ├── dsp/                  # DSP API integration
│   │   ├── unit-profile.service.ts
│   │   └── identity-bridge.service.ts
│   ├── workspace/            # Workspace file generation
│   │   ├── user-md.generator.ts
│   │   └── tools-md.generator.ts
│   └── telegram/             # Bot pairing management
│       └── pairing.service.ts
├── Dockerfile
└── helm/                     # Helm chart for the service itself
```

**Dependencies:**
- `@kubernetes/client-node` — Kubernetes client
- `node-helm-client` OR shell exec helm — Helm operations
- `@nestjs/axios` — DSP API calls
- `handlebars` — template rendering
