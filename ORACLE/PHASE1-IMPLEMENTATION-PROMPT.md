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

## Technical Deep Dives (ОБЯЗАТЕЛЬНО к реализации)

### TD-1: Auth Bridge — DSP (Wallet) ↔ GPROD (JWT)

DSP использует wallet-based auth (SIWE — EIP-4361), GPROD — JWT с username/password. Нужен bridge.

**Текущий JWT payload** (GPROD): `{ sub: user.id, username: user.username, roles: user.roles }`

**Phase 1 (MVP):**
1. Добавь `walletAddress String? @unique @map("wallet_address") @db.VarChar(42)` к модели `User` в Prisma
2. Создай middleware `wallet-address.middleware.ts` — валидация `X-Wallet-Address` header: `/^0x[0-9a-fA-F]{40}$/`
3. Обнови `JwtStrategy` — включи `walletAddress` в JWT payload: `{ sub, username, roles, walletAddress }`
4. Создай `OracleOwnerGuard` — сверяет `req.user.walletAddress` с `oracle.unitAddress`
5. Добавь endpoint `POST /api/v1/auth/link-wallet` — привязка wallet к существующему User (подписать сообщение → verify)

**Phase 2+ (future):** полный SIWE (Sign-In With Ethereum) через `verifyMessage()` из viem

---

### TD-2: Profile Completeness Check (PRD §3.2)

Кнопка "Init Oracle" активна только при полном профиле:

```typescript
// src/shared/utils/isOracleReady.ts (shared между GPROD и DSP)
export const isOracleReady = (profile: UnitProfile): boolean => {
  return !!(
    profile.unitname &&
    profile.bio && profile.bio.length >= 20 &&
    profile.specialisation &&
    profile.claAccepted &&
    (profile.socialLinks?.telegram || profile.socialLinks?.github)
  );
};
```

GPROD должен проверять `isOracleReady()` перед `POST /init/*` — вернуть 400 с `missingFields[]`.

---

### TD-3: On-Chain Verification для Community Tier (PRD §11.2)

Community tier требует `MemberStatus >= Dev (2)` из UnitManager.sol на BSC.

```typescript
// oracle.service.ts — verifyMemberStatus()
import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';

const UNIT_MANAGER_ADDRESS = '0x...'; // из env: UNIT_MANAGER_CONTRACT_ADDRESS
const CHAIN_ID = 56; // BSC Mainnet

async function verifyMemberStatus(walletAddress: string): Promise<number> {
  const client = createPublicClient({ chain: bsc, transport: http(process.env.BLOCKCHAIN_RPC_URL) });
  const member = await client.readContract({
    address: UNIT_MANAGER_ADDRESS,
    abi: unitManagerABI, // из shared-types или отдельный JSON
    functionName: 'members',
    args: [walletAddress],
  });
  return Number(member.status); // 0=None, 1=Unit, 2=Dev, 3=LeadDev, 4=ArchDev
}

// В POST /init/community:
const status = await verifyMemberStatus(walletAddress);
if (status < 2) throw new ForbiddenException({
  error: 'INSUFFICIENT_STATUS',
  required: 'Dev (2)',
  current: `${MemberStatusNames[status]} (${status})`,
});
```

Добавь `viem` в GPROD backend dependencies: `pnpm add viem`

---

### TD-4: DO / GCP OAuth Flows (PRD §4.3)

**DigitalOcean:**
```
POST /api/v1/oracle/init/self-hosted
  → provider: "digitalocean", oauthToken: "dop_v1_xxx"
  → GPROD calls DO API v2: POST /v2/droplets
    { name: "oracle-{unitname}", region: "{user_selected}",
      size: "s-2vcpu-4gb", image: "ubuntu-24-04-x64", tags: ["gybernaty-oracle"] }
  → Poll GET /v2/droplets/{id} until status=active
  → Extract IP → pass to SmartOracle DevOps Agent via gRPC
```

**Google Cloud:**
```
POST /api/v1/oracle/init/self-hosted
  → provider: "gcp", oauthToken: "ya29.xxx"
  → GPROD calls GCP Compute API: POST /compute/v1/projects/{project}/zones/{zone}/instances
    { name: "oracle-{unitname}", machineType: "e2-medium",
      disks: [{ initializeParams: { sourceImage: "ubuntu-2404-lts" } }] }
  → Extract external IP → pass to SmartOracle
```

Реализуй `CloudProviderService` (strategy pattern) — `DigitalOceanProvider`, `GCPProvider` с единым интерфейсом:
```typescript
interface ICloudProvider {
  createServer(config: ServerConfig): Promise<{ serverId: string; ip: string }>;
  getServerStatus(serverId: string): Promise<ServerStatus>;
  deleteServer(serverId: string): Promise<void>;
}
```

---

### TD-5: Provisioning Timeout & Rollback (PRD §4.5)

Каждая фаза provisioning имеет timeout и rollback:

| Phase | Timeout | Rollback Action |
|-------|---------|-----------------|
| `server_creation` | 5 min | Cancel + delete droplet/instance |
| `security_hardening` | 3 min | Destroy server, notify user |
| `k8s_join` | 5 min | Remove node label, destroy server |
| `agent_deploy` | 3 min | Delete namespace, drain node |
| `health_check` | 2 min | Retry once, then rollback deploy |
| **Total** | **≤16 min** | Atomic cleanup on any failure |

Реализуй в `oracle.service.ts` с AbortController / setTimeout per phase. Каждый шаг пишет `OracleProvisioningLog`. При failure — rollback предыдущих фаз в обратном порядке.

---

### TD-6: Server Lifecycle State Machine (PRD §3.3)

```
NONE → PROVISIONING → ACTIVE → SUSPENDED → ACTIVE (resume)
                  ↘ FAILED            ↘ DECOMMISSIONED → DESTROYED
```

Допустимые transitions:
```typescript
const VALID_TRANSITIONS: Record<OracleState, OracleState[]> = {
  'none':             ['provisioning'],
  'provisioning':     ['active', 'failed'],
  'active':           ['suspended', 'decommissioning'],
  'suspended':        ['active', 'decommissioning'],  // resume или auto-decom через 30 дней
  'decommissioning':  ['destroyed'],
  'destroyed':        [],
  'failed':           ['provisioning', 'destroyed'],   // retry или cleanup
};
```

Реализуй `transitionState()` в service с валидацией допустимых переходов.

---

### TD-7: Health Monitoring Decision Tree (PRD §10.3)

SmartOracle проверяет каждые 5 минут (для Phase 1 — заложи структуру):

```typescript
// oracle.service.ts — healthCheck() scaffold
async checkAgentHealth(oracleId: string): Promise<HealthStatus> {
  const oracle = await this.getOracle(oracleId);

  // 1. Node Ready?
  const nodeReady = await this.k8sClient.isNodeReady(oracle.k8sNodeName);
  if (!nodeReady) {
    await this.incrementFailure(oracleId);
    if (await this.getFailureCount(oracleId) >= 3) {
      await this.transitionState(oracleId, 'suspended', 'server_unreachable');
    }
    return 'node_not_ready';
  }

  // 2. Pod Running?
  const podRunning = await this.k8sClient.isPodRunning(oracle.k8sNamespace);
  if (!podRunning) {
    await this.k8sClient.restartPod(oracle.k8sNamespace, 'picoclaw');
    return 'pod_restarted';
  }

  // 3. Heartbeat < 1 hour?
  if (Date.now() - oracle.lastHeartbeat.getTime() > 3600_000) {
    this.logger.warn(`Stale heartbeat: ${oracleId}`);
    return 'heartbeat_stale';
  }

  await this.resetFailure(oracleId);
  return 'healthy';
}
```

---

### TD-8: Key Rotation Automation (PRD §7.5)

Добавь в DevOps Agent playbooks:

| Asset | Period | CronJob Schedule |
|-------|--------|-----------------|
| SSH keys | 90 days | `0 3 * * 0` (weekly check, rotate if ≥90d) |
| K3s join token | 180 days | `0 3 1 * *` (monthly check) |
| Vault tokens | 24 hours | Auto-renewal via Vault agent sidecar |

`rotate-keys.yml` playbook:
1. Generate new Ed25519 keypair
2. Deploy new public key to server
3. Verify SSH with new key
4. Store new private key in Vault (новый version)
5. Shred old local key files
6. Update `OracleInstance.vaultSecretPath` если path changes

---

### TD-9: Node Affinity Rules (PRD §10.2)

Добавь в `templates/` для DevOps Agent:

**Self-hosted** — PicoClaw runs ONLY on user's own node:
```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gybernaty.org/unit
              operator: In
              values: ["{{ unit_address }}"]
```

**Community** — PicoClaw runs on shared community workers:
```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gybernaty.org/role
              operator: In
              values: ["community-worker"]
```

Включи affinity в `values-template.yaml.hbs` через Handlebars conditional.

---

### TD-10: Environment Variables

Добавь `.env.example` в `GPROD/apps/backend/`:

```env
# === Oracle Module ===

# Blockchain (BSC)
UNIT_MANAGER_CONTRACT_ADDRESS=0x...
BLOCKCHAIN_RPC_URL=https://bsc-dataseed.binance.org/

# Cloud Providers
DO_API_BASE_URL=https://api.digitalocean.com
GCP_COMPUTE_API_URL=https://compute.googleapis.com/compute/v1

# HashiCorp Vault
VAULT_ADDR=https://vault.internal:8200
VAULT_ROLE_ID=
VAULT_SECRET_ID=

# Kubernetes
K3S_MASTER_URL=https://k8s-master:6443
K3S_JOIN_TOKEN=

# SmartOracle gRPC
SMARTORACLE_GRPC_URL=grpc://smartoracle.openclaw.svc.cluster.local:5000

# Provisioning
PROVISIONING_TOTAL_TIMEOUT_MS=960000
PROVISIONING_PHASE_TIMEOUT_MS=300000

# PicoClaw Defaults
OPENCLAW_HELM_CHART=openclaw/openclaw
OPENCLAW_VERSION=2026.3.2
DEFAULT_FREE_MODEL=openrouter/qwen/qwen3-coder:free
```

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

1. **Прочитай PRD** целиком (`ORACLE/PRD-ORACLE-DSP-INTEGRATION.md`, §1-§17) — это source of truth
2. **Прочитай GPROD backend**: `app.module.ts`, auth module (guards, strategies, service), prisma schema, common/database
3. **Shared types** — oracle.ts в GPROD/packages/shared-types/src/ + DSP/src/shared/types/
4. **isOracleReady()** — `src/shared/utils/isOracleReady.ts` (TD-2)
5. **UnitProfile extension** — добавь `oracle` field
6. **Prisma models** — walletAddress в User + OracleInstance + logs + events → migration
7. **Auth bridge** — walletAddress в JWT payload, X-Wallet-Address middleware (TD-1)
8. **viem + on-chain verification** — `pnpm add viem`, verifyMemberStatus() (TD-3)
9. **NestJS Oracle module** — controller → service (с CloudProviderService, state machine, timeout/rollback, health scaffold) → DTOs → guards → gateway
10. **.env.example** — Oracle environment variables (TD-10)
11. **gRPC proto** — `ORACLE/proto/oracle.proto`
12. **DevOps Agent** — SKILL.md + playbooks + templates + affinity rules (TD-8, TD-9)
13. **PicoClaw Helm** — values templates + workspace templates + skill
14. **Vault config** — HCL policies + K8s manifests
15. **Build** — `cd GPROD && pnpm install && pnpm build`

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

### Backend (GPROD)
- [ ] `modules/oracle/` — полный NestJS module с 9 REST endpoints + Swagger
- [ ] `modules/oracle/oracle.service.ts` — CloudProviderService (strategy: DO + GCP), provisioning orchestration с timeout/rollback, state machine с `transitionState()`, health check scaffold
- [ ] `modules/oracle/guards/oracle-owner.guard.ts` — wallet ownership verification
- [ ] `prisma/schema.prisma` — OracleInstance + OracleProvisioningLog + OracleHealthEvent + `walletAddress` в User
- [ ] Prisma migration: `add_oracle_module` — успешно
- [ ] `modules/auth/` — walletAddress в JWT payload, X-Wallet-Address middleware
- [ ] On-chain verification: `verifyMemberStatus()` с viem + UnitManager ABI
- [ ] `isOracleReady()` validation в init endpoints
- [ ] `.env.example` дополнен Oracle переменными

### Shared Types
- [ ] `GPROD/packages/shared-types/src/oracle.ts` — все types + re-export в index.ts
- [ ] `src/shared/types/oracle.ts` — frontend Oracle types
- [ ] `src/shared/types/unit-profile.ts` — расширен полем `oracle`
- [ ] `src/shared/utils/isOracleReady.ts` — profile completeness check

### Infrastructure
- [ ] `ORACLE/proto/oracle.proto` — gRPC OracleOrchestrator service + all messages
- [ ] `ORACLE/devops-agent/` — SKILL.md + 5 playbooks + 4 J2 templates + 2 tier vars + ansible.cfg + requirements.yml
- [ ] `ORACLE/picoclaw/` — Helm values (template + community + self-hosted) + 3 workspace templates + affinity rules + skill
- [ ] `ORACLE/vault-config/` — 3 HCL policies + 2 K8s manifests

### Build
- [ ] `cd GPROD && pnpm install && pnpm build` — без ошибок
