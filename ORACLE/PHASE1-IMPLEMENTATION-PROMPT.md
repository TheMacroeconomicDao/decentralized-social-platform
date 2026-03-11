# ORACLE DSP Integration — Phase 1: Foundation

> Промт для запуска в новом чате Claude Code.
> Рабочая директория: `/Users/Gyber/GYBERNATY-ECOSYSTEM/CSC/DSP`

---

## Контекст

Ты реализуешь **Phase 1 (Foundation)** интеграции модуля Oracle в Decentralized Social Platform (DSP).

**Обязательно прочитай перед началом работы:**
- `ORACLE/PRD-ORACLE-DSP-INTEGRATION.md` — полный PRD (§1-§17, ~2250 строк). Это твой единственный источник истины. Все типы, API, схемы, Helm values, Ansible playbooks, архитектура — там.
- `GPROD/apps/backend/src/` — существующий NestJS backend (модули: auth, users, projects, health)
- `GPROD/apps/backend/prisma/` — существующие миграции Prisma
- `GPROD/packages/shared-types/src/` — shared types package (monorepo)
- `src/shared/types/unit-profile.ts` — текущий UnitProfile interface
- `src/shared/types/ipfs-storage.ts` — DDP типы (уже готовы)
- `src/features/UnitProfile/ui/` — текущие компоненты (Editor, View, TeamsContribute)
- `ORACLE/openclaw-k8s/helm/values.yaml` — текущий SmartOracle Helm config

---

## Задача: Phase 1 — Foundation (4 deliverables)

### 1. GPROD Oracle Module (NestJS)

**Где:** `GPROD/apps/backend/src/modules/oracle/`

Создай полноценный NestJS модуль:

```
modules/oracle/
├── oracle.module.ts
├── oracle.controller.ts          — REST API /api/v1/oracle/*
├── oracle.service.ts             — бизнес-логика
├── oracle.gateway.ts             — WebSocket gateway для SSE provisioning
├── dto/
│   ├── init-oracle.dto.ts        — InitSelfHostedDto, InitCommunityDto
│   ├── oracle-status.dto.ts      — OracleStatusResponseDto
│   ├── provisioning.dto.ts       — ProvisioningStatusDto
│   └── oracle-config.dto.ts      — AddApiKeyDto, UpdateSettingsDto
├── entities/
│   └── oracle-instance.entity.ts — Prisma model mapping
├── guards/
│   └── oracle-owner.guard.ts     — проверка что запрос от владельца oracle
└── interfaces/
    └── oracle.interfaces.ts      — internal interfaces
```

**REST API endpoints** (из PRD §8.1):

| Method | Path | Описание |
|--------|------|----------|
| `GET` | `/api/v1/oracle/status` | Oracle status для текущего юзера |
| `POST` | `/api/v1/oracle/init/self-hosted` | Init self-hosted oracle |
| `POST` | `/api/v1/oracle/init/community` | Init community oracle (verify on-chain) |
| `GET` | `/api/v1/oracle/provisioning/:id/stream` | SSE streaming provisioning progress |
| `POST` | `/api/v1/oracle/suspend` | Suspend oracle |
| `POST` | `/api/v1/oracle/resume` | Resume oracle |
| `DELETE` | `/api/v1/oracle/destroy` | Destroy oracle (с X-Confirm header) |
| `POST` | `/api/v1/oracle/config/api-key` | Add API key для premium моделей |
| `GET` | `/api/v1/oracle/health` | Health check (для SmartOracle heartbeat) |

**Все типы запросов/ответов** — PRD §8.1 (копируй точно).

**Prisma schema** — добавь в `GPROD/apps/backend/prisma/schema.prisma`:

```prisma
model OracleInstance {
  id              String    @id @default(uuid())
  unitAddress     String    @unique @map("unit_address") @db.VarChar(42)
  state           String    @default("provisioning") @db.VarChar(20)
  tier            String    @db.VarChar(20)
  provider        String?   @db.VarChar(20)
  serverIp        String?   @map("server_ip")
  serverRegion    String?   @map("server_region") @db.VarChar(20)
  k8sNamespace    String    @map("k8s_namespace") @db.VarChar(63)
  k8sNodeName     String?   @map("k8s_node_name") @db.VarChar(63)
  monthlyCost     Decimal   @default(0) @map("monthly_cost") @db.Decimal(10, 2)
  vaultSecretPath String?   @map("vault_secret_path") @db.VarChar(255)
  telegramPaired  Boolean   @default(false) @map("telegram_paired")
  createdAt       DateTime  @default(now()) @map("created_at")
  suspendedAt     DateTime? @map("suspended_at")
  suspendReason   String?   @map("suspend_reason") @db.VarChar(50)
  lastHeartbeat   DateTime? @map("last_heartbeat")

  provisioningLogs OracleProvisioningLog[]
  healthEvents     OracleHealthEvent[]

  @@map("oracle_instances")
}

model OracleProvisioningLog {
  id         String   @id @default(uuid())
  oracleId   String   @map("oracle_id")
  phase      String   @db.VarChar(30)
  status     String   @db.VarChar(20)
  detail     String?
  durationMs Int?     @map("duration_ms")
  createdAt  DateTime @default(now()) @map("created_at")

  oracle OracleInstance @relation(fields: [oracleId], references: [id], onDelete: Cascade)

  @@map("oracle_provisioning_logs")
}

model OracleHealthEvent {
  id        String   @id @default(uuid())
  oracleId  String   @map("oracle_id")
  eventType String   @map("event_type") @db.VarChar(30)
  details   Json?
  createdAt DateTime @default(now()) @map("created_at")

  oracle OracleInstance @relation(fields: [oracleId], references: [id], onDelete: Cascade)

  @@map("oracle_health_events")
}
```

Создай Prisma migration: `npx prisma migrate dev --name add_oracle_module`

**Интеграция в app.module.ts** — добавь `OracleModule` в imports.

**Аутентификация** — используй существующий JWT guard из `modules/auth/guards/`. Добавь `@UseGuards(JwtAuthGuard)` на все endpoints. Wallet address извлекай из JWT payload или заголовка `X-Wallet-Address`.

---

### 2. Oracle Types в shared-types

**Где:** `GPROD/packages/shared-types/src/oracle.ts`

Скопируй типы из PRD §9.1 (точно как написано):
- `OracleState`, `OracleTier`, `CloudProvider`, `ProvisioningPhase`
- `OracleStatus`, `OracleServer`, `OracleAgent`, `OracleStats`
- `ProvisioningStatus`, `ProvisioningPhaseStatus`
- `OracleInitRequest`
- `OraclePrivacySettings` (из PRD §12.3)

Также создай `src/shared/types/oracle.ts` в DSP (frontend) с теми же типами.

Расширь `UnitProfile` в `src/shared/types/unit-profile.ts` — добавь optional поле `oracle` (PRD §9.2).

---

### 3. Ansible Playbooks для DevOps Agent

**Где:** `ORACLE/devops-agent/`

Создай структуру:

```
ORACLE/devops-agent/
├── SKILL.md                          — OpenClaw skill definition для DevOps Agent
├── playbooks/
│   ├── harden-server.yml             — SSH hardening (из PRD §4.4, Phase 1)
│   ├── join-cluster.yml              — K3s agent install + node label (Phase 2)
│   ├── deploy-picoclaw.yml           — Namespace + NetworkPolicy + Helm deploy (Phase 3)
│   ├── rotate-keys.yml               — SSH key rotation (90 days)
│   └── decommission.yml              — Drain node + delete namespace + export data
├── inventory/
│   └── dynamic.py                    — Dynamic inventory из HashiCorp Vault
├── templates/
│   ├── namespace.yaml.j2             — K8s namespace с PSA labels
│   ├── networkpolicy.yaml.j2         — deny-all + DNS + HTTPS egress
│   ├── resourcequota.yaml.j2         — per-tier resource limits
│   └── rbac.yaml.j2                  — picoclaw-role с минимальными permissions
├── vars/
│   ├── community-tier.yml            — 250m/512Mi limits
│   └── self-hosted-tier.yml          — 500m/1Gi limits
├── ansible.cfg
└── requirements.yml                  — Galaxy dependencies
```

**SKILL.md** — OpenClaw skill definition:
```markdown
---
name: devops-provision
description: Server provisioning, hardening, K8s management for Oracle instances
triggers:
  - "provision server"
  - "harden server"
  - "join cluster"
  - "deploy picoclaw"
  - "rotate keys"
  - "decommission"
---

# DevOps Provision Skill

You are the DevOps Agent — a specialized sub-agent of SmartOracle responsible for infrastructure automation.

## Capabilities
- Server security hardening (SSH key-only, disable password auth)
- K3s cluster node management (join, label, drain)
- Kubernetes namespace isolation (NetworkPolicy, ResourceQuota, RBAC)
- PicoClaw deployment via Helm
- SSH key rotation (90-day CronJob)
- Server decommissioning with data export

## Tools
- Ansible playbooks in `devops-agent/playbooks/`
- HashiCorp Vault client for secrets
- @kubernetes/client-node for K8s API
- Cloud provider SDKs (DigitalOcean, GCP)

## Workflow
1. Receive provision request from SmartOracle
2. Execute playbooks in sequence: harden → join → deploy
3. Report progress via gRPC stream to GPROD
4. Log all actions to oracle_provisioning_logs

## Security Rules
- NEVER store SSH keys outside Vault
- ALWAYS shred temporary key files after Vault storage
- ALWAYS apply deny-all NetworkPolicy before deploying agent
- NEVER grant cluster-admin to any PicoClaw instance
```

Playbooks — бери содержимое из PRD §4.4 (полные YAML с tasks). Адаптируй jinja2 templates из PRD §7.4.

---

### 4. PicoClaw Helm Chart

**Где:** `ORACLE/picoclaw/`

```
ORACLE/picoclaw/
├── helm/
│   ├── values-template.yaml.hbs      — Handlebars template (из PRD §5.3)
│   ├── values-community.yaml         — Community tier overrides
│   └── values-self-hosted.yaml       — Self-hosted tier overrides
├── workspace-templates/
│   ├── USER.md.hbs                   — Generated from UnitProfile
│   ├── IDENTITY.md.hbs               — Agent identity prompt
│   └── TOOLS.md.hbs                  — Available tools by tier
├── skills/
│   └── dsp-integration/
│       └── SKILL.md                  — DSP integration skill
└── README.md
```

**values-template.yaml.hbs** — из PRD §5.3 (Handlebars template с переменными tier_storage, tier_cpu_request, user_timezone, user_anthropic_key).

**values-community.yaml**:
```yaml
resources:
  requests:
    cpu: "250m"
    memory: "512Mi"
  limits:
    cpu: "500m"
    memory: "1Gi"
persistence:
  size: "2Gi"
openclaw:
  defaultModel:
    model: "openrouter/qwen/qwen3-coder:free"
```

**values-self-hosted.yaml**:
```yaml
resources:
  requests:
    cpu: "500m"
    memory: "1Gi"
  limits:
    cpu: "1000m"
    memory: "2Gi"
persistence:
  size: "5Gi"
```

**Workspace templates** — генерируй из PRD §5.4. USER.md.hbs должен подставлять unitname, bio, specialisation, skills, social links из UnitProfile.

---

### 5. HashiCorp Vault Config

**Где:** `ORACLE/vault-config/`

```
ORACLE/vault-config/
├── policies/
│   ├── smartoracle.hcl               — full R/W на oracle/servers/*
│   ├── devops-agent.hcl              — read-only на SSH keys
│   └── unit-readonly.hcl             — unit reads own agent config only
└── k8s/
    ├── vault-deployment.yaml         — Vault OSS в K8s
    └── vault-injector.yaml           — Sidecar injector
```

Policies — из PRD §7.3 (HCL файлы).

---

### 6. gRPC Proto

**Где:** `ORACLE/proto/oracle.proto`

Полный protobuf из PRD §8.2:
- service OracleOrchestrator
- ProvisionServer (stream), SuspendAgent, ResumeAgent, DestroyAgent
- GetAgentHealth, StreamHealthEvents, ListAgents, GetAgentConfig
- Все message types (ProvisionRequest, ProvisionEvent, AgentRef, AgentStatus, etc.)

---

## Технические требования

1. **NestJS** — используй существующий стиль кода из `modules/auth/` и `modules/users/`. ESM modules (`"type": "module"` в package.json). Декораторы NestJS 11.
2. **Prisma 6** — используй существующий `prisma/schema.prisma`, добавь models в конец. Запусти migration.
3. **Validation** — `class-validator` + `class-transformer` для DTOs (уже в dependencies).
4. **SSE** — используй `@Sse()` декоратор NestJS для provisioning stream.
5. **Guards** — переиспользуй `JwtAuthGuard` из auth module.
6. **Ansible** — production-ready playbooks с error handling, retry logic, tags для partial runs.
7. **Helm** — Handlebars templates (.hbs) для генерации values.yaml на лету при provision.
8. **Security** — никаких секретов в коде. Vault paths, не значения. Все credentials через env vars или Vault.

## Порядок выполнения

1. Прочитай PRD целиком (§1-§17)
2. Прочитай существующий GPROD backend code (app.module.ts, auth module, prisma schema)
3. Создай shared types (oracle.ts в обоих packages)
4. Расширь UnitProfile type
5. Создай Prisma models + migration
6. Создай NestJS Oracle module (controller → service → gateway → DTOs → guards)
7. Создай gRPC proto file
8. Создай DevOps Agent (SKILL.md + playbooks + templates)
9. Создай PicoClaw Helm chart (values + workspace templates)
10. Создай Vault config (policies + K8s manifests)
11. Проверь что всё компилируется: `cd GPROD && pnpm build`

## Не делай

- НЕ трогай существующие компоненты DSP (UI будет в Phase 2)
- НЕ создавай Docker images
- НЕ деплой ничего в production
- НЕ добавляй Co-Authored-By в коммиты
- НЕ модифицируй SmartOracle workspace (openclaw-k8s/)
- НЕ выдумывай API endpoints — бери только из PRD §8

---

## Критерии готовности Phase 1

- [ ] `GPROD/apps/backend/src/modules/oracle/` — полный NestJS module с 9 endpoints
- [ ] `GPROD/apps/backend/prisma/schema.prisma` — 3 новых модели + успешная migration
- [ ] `GPROD/packages/shared-types/src/oracle.ts` — все Oracle types
- [ ] `DSP/src/shared/types/oracle.ts` — frontend Oracle types
- [ ] `DSP/src/shared/types/unit-profile.ts` — расширен oracle полем
- [ ] `ORACLE/proto/oracle.proto` — gRPC service definition
- [ ] `ORACLE/devops-agent/` — SKILL.md + 5 playbooks + 4 templates + vars
- [ ] `ORACLE/picoclaw/` — Helm values + 3 workspace templates + skill
- [ ] `ORACLE/vault-config/` — 3 HCL policies + 2 K8s manifests
- [ ] `pnpm build` в GPROD проходит без ошибок
