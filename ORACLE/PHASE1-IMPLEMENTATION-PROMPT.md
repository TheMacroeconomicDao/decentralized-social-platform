# ORACLE DSP Integration — Phase 1: Foundation

> Промт для запуска в новом чате Claude Code.
> Рабочая директория: `/Users/Gyber/GYBERNATY-ECOSYSTEM/CSC/DSP`

---

## Контекст

Ты реализуешь **Phase 1 (Foundation)** интеграции модуля Oracle в Decentralized Social Platform (DSP).

Oracle — персональный AI-ассистент каждого участника (Unit) экосистемы Gybernaty.
Каждый Unit получает изолированный AI-агент (PicoClaw), развёрнутый в Kubernetes namespace.

### Архитектура проекта (ВАЖНО — прочитай внимательно)

**DSP Frontend** (`/Users/Gyber/GYBERNATY-ECOSYSTEM/CSC/DSP/`):
- Next.js 16 App Router + React 19 + TypeScript
- Feature-Sliced Design (FSD): `src/app/`, `src/widgets/`, `src/features/`, `src/shared/`
- Web3 auth: wagmi v2 + viem v2 + RainbowKit v2 (SIWE — Sign-In With Ethereum)
- SCSS modules, Framer Motion, Three.js / React Three Fiber
- Деплой: Docker → k3s via GitHub Actions

**GPROD Backend** (`/Users/Gyber/GYBERNATY-ECOSYSTEM/CSC/DSP/GPROD/`):
- **Отдельный git репозиторий** (https://github.com/TheMacroeconomicDao/gprod-monorepo.git)
- Monorepo (pnpm workspaces): `apps/backend`, `apps/frontend`, `packages/shared-types`, `packages/ui-components`
- NestJS 11, Prisma 6 + PostgreSQL, Express 5
- ES Modules (`"type": "module"`)
- Auth: JWT + Local strategy (passport-jwt, passport-local, argon2)
- Guards: `jwt-auth.guard.ts`, `local-auth.guard.ts` в `modules/auth/guards/`
- Existing modules: `auth`, `users`, `projects`, `health`
- Common: `middleware/` (request-logger, rate-limiter), `interceptors/`, `filters/`, `helpers/` (EnvHelper), `logger/` (winston), `database/` (PrismaService)
- Swagger: @nestjs/swagger v11.1.6

**Существующие Prisma модели** (`GPROD/apps/backend/prisma/schema.prisma`):
```prisma
model User {
  id, username, email, password, isActive, createdAt, updatedAt
  roles String[] @default(["user"])
  refreshTokens RefreshToken[]
}
model Project { id, title, description, ownerId → User }
model RefreshToken { id, token (unique), userId → User, createdAt, expiresAt }
```

**Существующие shared types** (`GPROD/packages/shared-types/src/index.ts`):
- `User`, `UserRole` (ADMIN, USER, MANAGER)
- `Project`, `ProjectStatus` (ACTIVE, INACTIVE, ARCHIVED)
- `ApiResponse<T>`, `PaginatedResponse<T>`, `HealthCheckResponse`

**ORACLE** (`/Users/Gyber/GYBERNATY-ECOSYSTEM/CSC/DSP/ORACLE/`):
- `PRD-ORACLE-DSP-INTEGRATION.md` — полный PRD (§1-§17, ~2250 строк). **Единственный источник истины.**
- `openclaw-k8s/` — существующий SmartOracle deployment (workspace, skills, k8s configs)
- `GYBERNATY_ECOSYSTEM_AGENT.md` — спецификация Oracle как агента экосистемы

**UnitProfile** (`src/shared/types/unit-profile.ts`):
```typescript
interface UnitProfile {
  address: string;           // wallet address (0x...)
  unitname: string;
  avatar?: string;
  bio?: string;
  fullName?: string;
  email?: string;
  unitType?: string;
  ensName?: string;
  chainId: number;
  balance?: string;
  isConnected: boolean;
  createdAt: number;
  lastLoginAt: number;
  socialLinks?: { telegram?, github?, twitter?, discord?, website? };
  preferences: { encryptByDefault, allowDirectMessages, showOnlineStatus, theme, language };
  stats: { messagesCount, chatsCount, connectionsCount, reputation };
  claAccepted?: DUNACLA;
  skills?: string[];
  location?: string;
  timezone?: string;
  specialisation?: Specialisation;
  qualifications?: QualificationLevel;
  profileVisibility?: ProfileVisibility;
  languages?: string[];
  links?: ProfileLink[];
  projects?: ProfileProject[];
  docs?: ProfileDoc[];
  // oracle?: OracleStatus — НЕТ, нужно добавить
}
```

**ВАЖНО — Auth bridge:**
DSP использует wallet auth (SIWE — EIP-4361), а GPROD backend — JWT с username/password. Для Oracle нужен **bridge**: GPROD должен принимать wallet address через SIWE verification (или X-Wallet-Address header с signature verification). В Phase 1 добавь поле `walletAddress` к модели User в Prisma и поддержку wallet-based auth в JWT payload.

---

## Обязательно прочитай перед началом работы

1. `ORACLE/PRD-ORACLE-DSP-INTEGRATION.md` — полный PRD. Все типы, API, схемы — там.
2. `GPROD/apps/backend/src/app.module.ts` — текущие imports
3. `GPROD/apps/backend/src/modules/auth/` — JWT guard, strategies
4. `GPROD/apps/backend/prisma/schema.prisma` — текущие модели
5. `GPROD/packages/shared-types/src/index.ts` — текущие shared types
6. `src/shared/types/unit-profile.ts` — текущий UnitProfile
7. `ORACLE/openclaw-k8s/` — SmartOracle deployment config (НЕ модифицировать)

---

## Задача: Phase 1 — Foundation (6 deliverables)

### 1. GPROD Oracle Module (NestJS)

**Где:** `GPROD/apps/backend/src/modules/oracle/`

Создай полноценный NestJS модуль:

```
modules/oracle/
├── oracle.module.ts
├── oracle.controller.ts          — REST API /api/v1/oracle/*
├── oracle.service.ts             — бизнес-логика
├── oracle.gateway.ts             — SSE для provisioning progress
├── dto/
│   ├── init-oracle.dto.ts        — InitSelfHostedDto, InitCommunityDto
│   ├── oracle-status.dto.ts      — OracleStatusResponseDto
│   ├── provisioning.dto.ts       — ProvisioningStatusDto
│   └── oracle-config.dto.ts      — AddApiKeyDto, UpdateSettingsDto
├── entities/
│   └── oracle-instance.entity.ts — Prisma model mapping
├── guards/
│   └── oracle-owner.guard.ts     — проверка владения oracle instance
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

**Все типы запросов/ответов** — бери из PRD §8.1.

**Prisma schema** — добавь в `GPROD/apps/backend/prisma/schema.prisma`:

```prisma
// Расширь User — добавь walletAddress для bridge DSP↔GPROD
// model User { ... walletAddress String? @unique @map("wallet_address") @db.VarChar(42) }

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

**Интеграция в app.module.ts** — добавь `OracleModule` в imports (после HealthModule).

**Аутентификация** — используй существующий `JwtAuthGuard` из `modules/auth/guards/jwt-auth.guard.ts`. Wallet address извлекай из JWT payload (добавь `walletAddress` в JWT strategy extraction). Для Phase 1 достаточно заголовка `X-Wallet-Address` с валидацией формата (0x + 40 hex chars).

---

### 2. Oracle Types в shared-types

**Где:** `GPROD/packages/shared-types/src/oracle.ts` + `src/shared/types/oracle.ts` (DSP frontend)

Скопируй типы из PRD §9.1:
- `OracleState` = 'provisioning' | 'active' | 'suspended' | 'error' | 'destroying'
- `OracleTier` = 'community' | 'self-hosted'
- `CloudProvider` = 'digitalocean' | 'gcp' | 'custom'
- `ProvisioningPhase` = 'init' | 'server' | 'harden' | 'cluster' | 'deploy' | 'configure' | 'ready'
- `OracleStatus`, `OracleServer`, `OracleAgent`, `OracleStats`
- `ProvisioningStatus`, `ProvisioningPhaseStatus`
- `OracleInitRequest` (self-hosted + community variants)
- `OraclePrivacySettings` (из PRD §12.3)

Расширь `UnitProfile` в `src/shared/types/unit-profile.ts` — добавь:
```typescript
oracle?: {
  state: OracleState;
  tier: OracleTier;
  agentName?: string;
  lastSeen?: number;
};
```

Добавь export в `GPROD/packages/shared-types/src/index.ts`:
```typescript
export * from './oracle';
```

---

### 3. Ansible Playbooks для DevOps Agent

**Где:** `ORACLE/devops-agent/`

Создай структуру:

```
ORACLE/devops-agent/
├── SKILL.md                          — OpenClaw skill definition для DevOps Agent
├── playbooks/
│   ├── harden-server.yml             — SSH hardening (из PRD §4.4)
│   ├── join-cluster.yml              — K3s agent install + node label
│   ├── deploy-picoclaw.yml           — Namespace + NetworkPolicy + Helm deploy
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

Playbooks — бери содержимое из PRD §4.4. Адаптируй jinja2 templates из PRD §7.4.

---

### 4. PicoClaw Helm Chart

**Где:** `ORACLE/picoclaw/`

```
ORACLE/picoclaw/
├── helm/
│   ├── values-template.yaml.hbs      — Handlebars template (из PRD §5.3)
│   ├── values-community.yaml         — Community tier: 250m/512Mi, 2Gi storage
│   └── values-self-hosted.yaml       — Self-hosted tier: 500m/1Gi, 5Gi storage
├── workspace-templates/
│   ├── USER.md.hbs                   — Generated from UnitProfile
│   ├── IDENTITY.md.hbs               — Agent identity prompt
│   └── TOOLS.md.hbs                  — Available tools by tier
├── skills/
│   └── dsp-integration/
│       └── SKILL.md                  — DSP integration skill
└── README.md
```

USER.md.hbs должен подставлять: unitname, bio, specialisation, skills, socialLinks из UnitProfile.

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

Policies — из PRD §7.3.

---

### 6. gRPC Proto

**Где:** `ORACLE/proto/oracle.proto`

Полный protobuf из PRD §8.2:
- service OracleOrchestrator
- ProvisionServer (stream), SuspendAgent, ResumeAgent, DestroyAgent
- GetAgentHealth, StreamHealthEvents, ListAgents, GetAgentConfig

---

## Технические требования

1. **NestJS 11** — используй стиль кода из `modules/auth/` и `modules/users/`. ES Modules, декораторы NestJS 11.
2. **Prisma 6** — добавь models в существующий `schema.prisma`. Запусти migration.
3. **Validation** — `class-validator` + `class-transformer` для DTOs (уже в dependencies).
4. **SSE** — используй `@Sse()` декоратор NestJS для provisioning stream.
5. **Guards** — переиспользуй `JwtAuthGuard` из auth module. Добавь `OracleOwnerGuard`.
6. **Swagger** — добавь `@ApiTags('oracle')` и swagger-декораторы на все endpoints (swagger уже настроен).
7. **Logging** — используй существующий winston logger из `common/logger/`.
8. **Ansible** — production-ready playbooks с error handling, retry logic, tags для partial runs.
9. **Helm** — Handlebars templates (.hbs) для генерации values.yaml при provision.
10. **Security** — никаких секретов в коде. Vault paths, не значения. Все credentials через env vars или Vault.

## Порядок выполнения

1. Прочитай PRD целиком (`ORACLE/PRD-ORACLE-DSP-INTEGRATION.md`, §1-§17)
2. Прочитай GPROD backend: `app.module.ts`, auth module (guards, strategies), prisma schema
3. Создай shared types (oracle.ts в GPROD/packages/shared-types/src/ и DSP/src/shared/types/)
4. Расширь UnitProfile type (добавь oracle field)
5. Расширь User model в Prisma (добавь walletAddress)
6. Создай OracleInstance + related models в Prisma + migration
7. Создай NestJS Oracle module (controller → service → gateway → DTOs → guards)
8. Создай gRPC proto file
9. Создай DevOps Agent (SKILL.md + playbooks + templates)
10. Создай PicoClaw Helm chart (values + workspace templates)
11. Создай Vault config (policies + K8s manifests)
12. Проверь: `cd GPROD && pnpm install && pnpm build`

## НЕ делай

- НЕ трогай существующие UI компоненты DSP (UI будет в Phase 2)
- НЕ создавай Docker images
- НЕ деплой ничего в production
- НЕ добавляй Co-Authored-By в коммиты
- НЕ модифицируй SmartOracle workspace (openclaw-k8s/)
- НЕ выдумывай API endpoints — бери только из PRD §8
- НЕ удаляй и не модифицируй существующие modules (auth, users, projects, health)

---

## Критерии готовности Phase 1

- [ ] `GPROD/apps/backend/src/modules/oracle/` — полный NestJS module с 9 endpoints
- [ ] `GPROD/apps/backend/prisma/schema.prisma` — 3 новых модели + walletAddress в User + успешная migration
- [ ] `GPROD/packages/shared-types/src/oracle.ts` — все Oracle types + re-export в index.ts
- [ ] `src/shared/types/oracle.ts` — frontend Oracle types (копия)
- [ ] `src/shared/types/unit-profile.ts` — расширен полем `oracle`
- [ ] `ORACLE/proto/oracle.proto` — gRPC service definition
- [ ] `ORACLE/devops-agent/` — SKILL.md + 5 playbooks + 4 templates + vars
- [ ] `ORACLE/picoclaw/` — Helm values + 3 workspace templates + skill
- [ ] `ORACLE/vault-config/` — 3 HCL policies + 2 K8s manifests
- [ ] `pnpm build` в GPROD проходит без ошибок
