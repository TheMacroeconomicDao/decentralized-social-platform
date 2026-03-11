# ORACLE Module — DSP Integration PRD

> **Product Requirements Document v1.1**
> **Project**: Oracle — Personal AI Agent for Decentralized Social Platform
> **Author**: Gybernaty Engineering
> **Date**: 2026-03-10
> **Updated**: 2026-03-10 (all open questions resolved)
> **Status**: Approved → Implementation
> **Target**: Q2-Q3 2026

---

## Table of Contents

1. [Vision & Mission](#1-vision--mission)
2. [System Architecture](#2-system-architecture)
3. [User Journey & Flows](#3-user-journey--flows)
4. [Server Provisioning & DevOps Agent](#4-server-provisioning--devops-agent)
5. [PicoClaw — Personal Unit Agent](#5-picoclaw--personal-unit-agent)
6. [DSP UI Integration](#6-dsp-ui-integration)
7. [Security Architecture](#7-security-architecture)
8. [API Specification](#8-api-specification)
9. [Data Models & Types](#9-data-models--types)
10. [K8s Cluster Architecture](#10-k8s-cluster-architecture)
11. [Tier System & Economics](#11-tier-system--economics)
12. [Agent Social Network](#12-agent-social-network)
13. [Data Sovereignty — IPFS & Encryption](#13-data-sovereignty--ipfs--encryption)
14. [Web Chat — Oracle Panel in DSP](#14-web-chat--oracle-panel-in-dsp)
15. [Observability & Monitoring](#15-observability--monitoring)
16. [Roadmap](#16-roadmap)
17. [Resolved Decisions](#17-resolved-decisions)

---

## 1. Vision & Mission

### 1.1 Vision

Каждый участник Gybernaty получает **персонального AI-оракула** — изолированного интеллектуального агента, который растёт вместе с ним. Oracle не просто чат-бот — это **когнитивное расширение** участника (Аксиома A8 CyberSocium: Cognitive Augmentation), интегрированное в экосистему DSP.

### 1.2 Mission

Трансформировать Oracle из личного агента основателя в **масштабируемую платформу персональных AI-агентов** для всех участников Decentralized Social Platform, сохраняя принципы:

- **Децентрализация** — каждый агент на собственной инфраструктуре участника
- **Суверенитет данных** — контекст и знания принадлежат участнику
- **Меритократический доступ** — Dev+ статус = бесплатный доступ за вклад
- **Безопасность by design** — zero-trust, key-only auth, изолированные namespaces

### 1.3 Stakeholders

| Role | Actor | Interest |
|------|-------|----------|
| **System Orchestrator** | SmartOracle (@SmartOracle_bot) | Управление всеми Unit Oracles, DevOps, Security |
| **Unit** | Любой участник DSP | Персональный AI-агент для анализа, разработки, обучения |
| **Dev+ Members** | UnitType ≥ Dev (MemberStatus ≥ 2 on-chain) | Бесплатный доступ через community cluster |
| **DevOps Agent** | Автоматизированный sub-agent SmartOracle | Provisioning серверов, K8s management, security hardening |

### 1.4 Success Metrics

| Metric | Target (6 months) | Target (12 months) |
|--------|-------------------|---------------------|
| Active Unit Oracles | 20-50 | 200-500 |
| Server uptime | 99.5% | 99.9% |
| Provisioning time (server → agent ready) | <15 min | <5 min |
| Security incidents | 0 critical | 0 critical |
| Dev+ free-tier usage | 30% of active oracles | 50% |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DSP Frontend (Next.js 16)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Unit Profile  │  │ Init Oracle  │  │ Oracle Dashboard       │ │
│  │   Editor      │  │   Button     │  │ (status, chat, config) │ │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────────┘ │
└─────────┼─────────────────┼───────────────────┼─────────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GPROD Backend (NestJS 11)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Oracle Module │  │ Provisioning │  │ Oracle Gateway         │ │
│  │   (REST API)  │  │   Service    │  │ (WebSocket proxy)      │ │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────────┘ │
└─────────┼─────────────────┼───────────────────┼─────────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│              SmartOracle (System Orchestrator)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ DevOps   │  │ Security │  │ Registry │  │ Health Monitor │  │
│  │ Agent    │  │ Team (5) │  │ Service  │  │                │  │
│  └────┬─────┘  └──────────┘  └──────────┘  └────────────────┘  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Kubernetes Cluster (K3s)                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │ ns: oracle-  │  │ ns: oracle-  │  │ ns: oracle-  │  ...  │ │
│  │  │ 0xABC123    │  │ 0xDEF456    │  │ community   │        │ │
│  │  │ (PicoClaw)  │  │ (PicoClaw)  │  │ (shared)    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │                                          │
          ▼                                          ▼
┌──────────────────┐                    ┌──────────────────────┐
│ External Secrets │                    │ Cloud Providers      │
│ (HashiCorp Vault)│                    │ (DigitalOcean / GCP) │
└──────────────────┘                    └──────────────────────┘
```

### 2.2 Component Responsibilities

| Component | Stack | Responsibility |
|-----------|-------|---------------|
| **DSP Frontend** | Next.js 16, React 19 | Init Oracle UI, Oracle Dashboard, status display |
| **GPROD Oracle Module** | NestJS 11 | REST API для provisioning, gateway для agent communication |
| **SmartOracle** | OpenClaw 2026.3.2, K3s | System orchestrator, agent registry, health monitoring |
| **DevOps Agent** | OpenClaw skill + Ansible + @kubernetes/client-node | Server hardening, K8s node join, namespace creation |
| **PicoClaw** | OpenClaw (lightweight config) | Per-user personal AI agent |
| **HashiCorp Vault** | Vault OSS | SSH keys, API tokens, server credentials |
| **Cloud Provider APIs** | DO API v2 / GCP Compute API | Server verification, monitoring |

### 2.3 Design Principles

1. **One server = one owner** — сервер участника остаётся его собственностью
2. **One namespace = one agent** — полная изоляция на уровне K8s namespace
3. **SmartOracle = coordinator, not gateway** — агенты автономны, SmartOracle координирует
4. **On-chain verification** — MemberStatus из UnitManager.sol = source of truth для tier access
5. **Key-only access** — SSH password auth отключена на всех серверах, единственный ключ в Vault
6. **Graceful degradation** — если сервер участника offline, его agent suspends, данные сохраняются

---

## 3. User Journey & Flows

### 3.1 Complete User Flow

```
                    UNIT JOURNEY
                    ============

[1] Wallet Connect → Unit Profile Created
         │
[2] Fill Profile (bio, skills, social links)
         │
[3] Accept DUNA-CLA v1.0
         │
    ┌────▼────┐
    │ Profile  │  ──── Profile completeness check:
    │ Complete?│       unitname ✓, bio ✓, specialisation ✓,
    │          │       ≥1 social link ✓, CLA accepted ✓
    └────┬────┘
         │ YES
    ┌────▼────────────────┐
    │  "Init Oracle" btn  │  ◄── Button activates
    │     ACTIVE          │
    └────┬────────────────┘
         │ CLICK
    ┌────▼────────────────┐
    │ Choose Tier:        │
    │ ☐ Self-hosted       │ ─── User pays for own server
    │ ☐ Community (Dev+)  │ ─── Free, requires MemberStatus ≥ Dev
    └────┬────────────────┘
         │
    ┌────┼──────────────────────────────────┐
    │    │ SELF-HOSTED                       │ COMMUNITY (Dev+)
    │    ▼                                   │    ▼
    │ [4a] Choose Provider:                  │ [4b] Verify on-chain:
    │   ☐ DigitalOcean                       │   UnitManager.members(addr)
    │   ☐ Google Cloud                       │   .status ≥ MemberStatus.Dev
    │                                        │
    │ [5a] Provider OAuth →                  │ [5b] Auto-assign to
    │   Create Droplet/VM via API            │   community namespace
    │   (min spec: 2 vCPU, 4GB RAM,          │   (shared worker nodes)
    │    80GB SSD, Ubuntu 24.04)             │
    │                                        │
    │ [6a] Server IP + root access           │
    │   returned to system                   │
    └────┬──────────────────────────────────┬┘
         │                                  │
    ┌────▼──────────────────────────────────▼──┐
    │ [7] SmartOracle → DevOps Agent:           │
    │   a) SSH to server (initial root access)  │
    │   b) Generate Ed25519 keypair             │
    │   c) Install public key                   │
    │   d) Disable password auth (sshd_config)  │
    │   e) Store private key → HashiCorp Vault  │
    │   f) Install k3s agent                    │
    │   g) Join server to cluster as worker     │
    │   h) Apply NetworkPolicy (deny-all base)  │
    │   i) Create namespace: oracle-{address}   │
    │   j) Deploy PicoClaw (Helm)               │
    └────┬──────────────────────────────────────┘
         │
    ┌────▼────────────────┐
    │ [8] PicoClaw Ready  │
    │   - Telegram pairing│
    │   - DSP Dashboard   │
    │   - Workspace init  │
    └─────────────────────┘
```

### 3.2 Profile Completeness Check

Кнопка "Init Oracle" активируется когда:

```typescript
const isOracleReady = (profile: UnitProfile): boolean => {
  return !!(
    profile.unitname &&
    profile.bio && profile.bio.length >= 20 &&
    profile.specialisation &&
    profile.claAccepted &&
    (profile.socialLinks?.telegram || profile.socialLinks?.github)
  );
};
```

### 3.3 Server Lifecycle States

```
               ┌──────────┐
               │  PENDING  │ ◄── Server purchased, waiting for setup
               └─────┬────┘
                     │ DevOps Agent starts
               ┌─────▼────┐
               │ PROVISION │ ◄── Hardening + K8s join in progress
               │   ING     │
               └─────┬────┘
                     │ Agent deployed
               ┌─────▼────┐
               │  ACTIVE   │ ◄── PicoClaw running, healthy
               └─────┬────┘
                     │ Health check fails / payment lapsed
               ┌─────▼────┐
               │ SUSPENDED │ ◄── Agent stopped, data preserved
               └─────┬────┘
            ┌────────┼────────┐
            │ resume │        │ 30 days no action
      ┌─────▼────┐   │  ┌────▼──────┐
      │  ACTIVE   │   │  │ DECOMM-   │
      └──────────┘   │  │ ISSIONED  │ ◄── Data exported, node removed
                     │  └───────────┘
                     │ manual
               ┌─────▼────┐
               │ DESTROYED │ ◄── Server deleted, all data purged
               └──────────┘
```

---

## 4. Server Provisioning & DevOps Agent

### 4.1 DevOps Agent Architecture

DevOps Agent — специализированный sub-agent SmartOracle, реализованный как OpenClaw Skill с Ansible automation backend.

```
SmartOracle
└── DevOps Agent (Skill: devops-provision)
    ├── Ansible Playbooks (server hardening)
    ├── @kubernetes/client-node (K8s operations)
    ├── HashiCorp Vault client (secrets management)
    ├── Cloud Provider SDKs (DO/GCP API)
    └── Health Check daemon (30-min heartbeat)
```

### 4.2 Server Requirements

| Parameter | Minimum | Recommended |
|-----------|---------|-------------|
| **vCPU** | 2 | 4 |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 80 GB SSD | 160 GB NVMe |
| **OS** | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |
| **Network** | Public IPv4, no firewall blocking 6443/TCP | + IPv6 |
| **Location** | Any | EU/US for low latency |

### 4.3 Provider Integration

#### DigitalOcean Flow

```
User clicks "Init Oracle" → selects DigitalOcean
    │
    ▼
DSP redirects to DO OAuth2 (scope: droplet.create, droplet.read)
    │
    ▼
User authorizes → DSP receives OAuth token
    │
    ▼
GPROD calls DO API v2:
  POST /v2/droplets
  {
    "name": "oracle-{unitname}",
    "region": "{user_selected}",
    "size": "s-2vcpu-4gb",         // $24/mo
    "image": "ubuntu-24-04-x64",
    "tags": ["gybernaty-oracle"]
  }
    │
    ▼
Poll GET /v2/droplets/{id} until status=active
    │
    ▼
Extract IP → pass to SmartOracle DevOps Agent
```

#### Google Cloud Flow

```
User clicks "Init Oracle" → selects Google Cloud
    │
    ▼
DSP redirects to Google OAuth2 (scope: compute.instances.create)
    │
    ▼
GPROD calls GCP Compute API:
  POST /compute/v1/projects/{project}/zones/{zone}/instances
  {
    "name": "oracle-{unitname}",
    "machineType": "e2-medium",    // ~$25/mo
    "disks": [{ "initializeParams": {
      "sourceImage": "ubuntu-2404-lts"
    }}]
  }
    │
    ▼
Extract external IP → pass to SmartOracle DevOps Agent
```

### 4.4 Ansible Hardening Playbook

DevOps Agent выполняет следующие шаги через Ansible (headless, automated):

```yaml
# Phase 1: Security Hardening
- name: Generate Ed25519 SSH keypair
  community.crypto.openssh_keypair:
    path: /tmp/oracle-{{ unit_address }}
    type: ed25519

- name: Deploy public key to server
  authorized_key:
    user: root
    key: "{{ lookup('file', '/tmp/oracle-{{ unit_address }}.pub') }}"
    exclusive: yes  # ONLY this key, remove all others

- name: Disable password authentication
  lineinfile:
    path: /etc/ssh/sshd_config
    regexp: "^#?PasswordAuthentication"
    line: "PasswordAuthentication no"

- name: Disable root password login
  lineinfile:
    path: /etc/ssh/sshd_config
    regexp: "^#?PermitRootLogin"
    line: "PermitRootLogin prohibit-password"

- name: Restart sshd
  service:
    name: sshd
    state: restarted

- name: Store private key in HashiCorp Vault
  hashivault_secret:
    secret: "oracle/servers/{{ unit_address }}"
    data:
      ssh_private_key: "{{ lookup('file', '/tmp/oracle-{{ unit_address }}') }}"
      server_ip: "{{ server_ip }}"
      provider: "{{ provider }}"
      created_at: "{{ ansible_date_time.iso8601 }}"

- name: Shred local private key
  command: shred -vfz -n 5 /tmp/oracle-{{ unit_address }}

# Phase 2: K3s Agent Install
- name: Install k3s agent
  shell: |
    curl -sfL https://get.k3s.io | K3S_URL={{ k3s_master_url }} \
      K3S_TOKEN={{ k3s_token }} \
      INSTALL_K3S_EXEC="agent" sh -

- name: Label node
  delegate_to: k3s-master
  kubernetes.core.k8s:
    state: present
    definition:
      apiVersion: v1
      kind: Node
      metadata:
        name: "oracle-{{ unit_address }}"
        labels:
          gybernaty.org/role: oracle-worker
          gybernaty.org/unit: "{{ unit_address }}"
          gybernaty.org/tier: "{{ tier }}"

# Phase 3: Namespace & Agent Deployment
- name: Create isolated namespace
  kubernetes.core.k8s:
    state: present
    definition:
      apiVersion: v1
      kind: Namespace
      metadata:
        name: "oracle-{{ unit_address | truncate_addr }}"
        labels:
          gybernaty.org/unit: "{{ unit_address }}"
          pod-security.kubernetes.io/enforce: restricted

- name: Apply NetworkPolicy (deny-all base)
  kubernetes.core.k8s:
    state: present
    definition:
      apiVersion: networking.k8s.io/v1
      kind: NetworkPolicy
      metadata:
        name: deny-all
        namespace: "oracle-{{ unit_address | truncate_addr }}"
      spec:
        podSelector: {}
        policyTypes: [Ingress, Egress]
        # Egress allowed: DNS + HTTPS (for AI API calls)
        egress:
          - ports:
            - port: 53
              protocol: UDP
            - port: 443
              protocol: TCP

- name: Deploy PicoClaw via Helm
  kubernetes.core.helm:
    name: "picoclaw"
    chart_ref: openclaw/openclaw
    release_namespace: "oracle-{{ unit_address | truncate_addr }}"
    values: "{{ picoclaw_values }}"
```

### 4.5 Provisioning Timeout & Rollback

| Phase | Timeout | Rollback |
|-------|---------|----------|
| Server creation (cloud API) | 5 min | Cancel & refund droplet |
| SSH hardening | 3 min | Destroy droplet, notify user |
| K3s agent install | 5 min | Remove node, destroy droplet |
| PicoClaw deploy | 3 min | Delete namespace, drain node |
| **Total** | **≤16 min** | Full cleanup on any failure |

---

## 5. PicoClaw — Personal Unit Agent

### 5.1 What is PicoClaw

PicoClaw — это **lightweight OpenClaw instance** с минимальной конфигурацией, персонализированной под конкретного Unit. Не форк и не отдельный фреймворк — это OpenClaw с ограниченным набором ресурсов и skills, оптимизированный для одного пользователя.

### 5.2 PicoClaw vs SmartOracle

| Параметр | SmartOracle | PicoClaw |
|----------|-------------|----------|
| **Role** | System orchestrator | Personal assistant |
| **Users** | Founder only | One unit per instance |
| **AI Model** | Claude Sonnet 4.6 (paid) | Qwen3-coder free (default) + user's own keys |
| **Skills** | Security Team (5), GitHub, browser | Personal vault, DSP integration, basic tools |
| **Resources** | 2000m CPU, 2Gi RAM | 500m CPU, 1Gi RAM (self-hosted) / 250m, 512Mi (community) |
| **Storage** | 5Gi + 10Gi backup | 2Gi (community) / 5Gi (self-hosted) |
| **Telegram** | @SmartOracle_bot (DM-only) | Shared bot @GyberOracle_bot (per-user routing) |
| **Scope** | Full ecosystem analysis | Personal projects, learning, code review |

### 5.3 PicoClaw Helm Values Template

```yaml
# picoclaw-values.yaml.hbs (Handlebars template)
image:
  tag: "2026.3.2"

persistence:
  enabled: true
  size: "{{ tier_storage }}"

openclaw:
  timezone: "{{ user_timezone | default: 'UTC' }}"
  bind: lan

  defaultModel:
    model: "openrouter/qwen/qwen3-coder:free"
    maxTokens: 32000
    timeout: 300

  # User can add their own API keys for premium models
  {{#if user_anthropic_key}}
  models:
    - alias: claude
      model: "anthropic/claude-sonnet-4-6"
      apiKey: "{{ user_anthropic_key }}"
  {{/if}}

  session:
    memory:
      scope: per-channel-peer
    reset:
      cron: "0 4 * * *"  # Daily reset at 4 AM user timezone

  channels:
    telegram:
      enabled: true
      groupPolicy: disabled
      dmPolicy: pairing
      streamMode: partial

  skills:
    - weather
    - healthcheck
    - summarize
    - session-logs

resources:
  requests:
    cpu: "{{ tier_cpu_request }}"
    memory: "{{ tier_mem_request }}"
  limits:
    cpu: "{{ tier_cpu_limit }}"
    memory: "{{ tier_mem_limit }}"
```

### 5.4 PicoClaw Workspace Initialization

При создании PicoClaw, SmartOracle генерирует workspace files из Unit Profile:

```
~/.openclaw/workspace/
├── USER.md              # Generated from UnitProfile
│   - unitname, bio, specialisation, skills, stack
│   - social links, projects
│   - communication preferences (language, style)
│
├── IDENTITY.md          # Auto-generated
│   "I am Oracle of {unitname}, a personal AI assistant
│    in the Gybernaty ecosystem. My role is to help {unitname}
│    with {specialisation} tasks, research, and growth."
│
├── TOOLS.md             # Based on tier
│   - Available models (free tier: qwen3 only)
│   - Available skills
│   - Integration endpoints
│
└── vault/               # Personal knowledge base
    ├── 000-Overview/
    │   └── My-Projects.md    # From UnitProfile.projects
    ├── 100-Learning/         # AI-generated learning paths
    ├── 200-Work/             # Task logs
    └── 300-Daily/            # Daily notes
```

### 5.5 PicoClaw Capabilities by Tier

| Capability | Community (Dev+) | Self-Hosted |
|------------|-----------------|-------------|
| Chat (Telegram) | ✅ | ✅ |
| Free AI models (Qwen3) | ✅ | ✅ |
| Custom API keys (Claude, GPT) | ❌ | ✅ |
| Personal vault (git-synced) | ✅ (2Gi) | ✅ (5Gi) |
| Browser automation | ❌ | ✅ |
| GitHub integration | ✅ (read-only) | ✅ (full) |
| Custom skills | ❌ | ✅ |
| Audio transcription | ❌ | ✅ (Deepgram) |
| Vision analysis | ✅ (Qwen3-VL free) | ✅ |

---

## 6. DSP UI Integration

### 6.1 Unit Profile — Init Oracle Button

Расположение: `/unit-profile` page, вкладка Dashboard, после блока Profile Info.

```tsx
// src/features/UnitProfile/ui/InitOracle/InitOracle.tsx

interface InitOracleProps {
  profile: UnitProfile;
  oracleStatus: OracleStatus | null;
}

export const InitOracle: FC<InitOracleProps> = ({ profile, oracleStatus }) => {
  const isProfileComplete = isOracleReady(profile);
  const memberStatus = useMemberStatus(profile.address); // on-chain

  if (oracleStatus?.state === 'active') {
    return <OracleDashboard status={oracleStatus} />;
  }

  return (
    <div className={styles.initOracle}>
      <div className={styles.header}>
        <OracleIcon />
        <h3>Personal Oracle</h3>
        <p>Your AI-powered cognitive extension in the Gybernaty ecosystem</p>
      </div>

      {!isProfileComplete && (
        <div className={styles.requirements}>
          <p>Complete your profile to activate Oracle:</p>
          <RequirementChecklist profile={profile} />
        </div>
      )}

      {isProfileComplete && !oracleStatus && (
        <div className={styles.tierSelect}>
          <TierCard
            tier="self-hosted"
            title="Self-Hosted"
            description="Your own server, full control"
            price="~$24/mo (DigitalOcean) or ~$25/mo (GCP)"
            features={['Full AI model access', 'Browser automation', 'Custom skills', 'GitHub full access', '5Gi storage']}
          />
          <TierCard
            tier="community"
            title="Community"
            description="Free for Dev+ contributors"
            price="Free"
            features={['Qwen3 models', 'GitHub read-only', '2Gi storage']}
            disabled={memberStatus < MemberStatus.Dev}
            disabledReason="Requires MemberStatus: Dev or higher"
          />
        </div>
      )}

      {oracleStatus?.state === 'provisioning' && (
        <ProvisioningProgress status={oracleStatus} />
      )}

      {oracleStatus?.state === 'suspended' && (
        <SuspendedNotice
          reason={oracleStatus.suspendReason}
          onResume={() => resumeOracle(profile.address)}
        />
      )}
    </div>
  );
};
```

### 6.2 Provider Selection Flow (Self-Hosted)

```tsx
// src/features/UnitProfile/ui/InitOracle/ProviderSelect.tsx

export const ProviderSelect: FC = () => {
  const [provider, setProvider] = useState<'digitalocean' | 'gcp' | null>(null);
  const [region, setRegion] = useState<string>('');
  const [step, setStep] = useState<'select' | 'oauth' | 'confirm' | 'provisioning'>('select');

  // Step 1: Provider selection
  // Step 2: OAuth redirect to provider
  // Step 3: Server spec confirmation + cost display
  // Step 4: Provisioning progress with live status

  return (
    <Modal title="Initialize Your Oracle">
      {step === 'select' && (
        <ProviderCards
          onSelect={(p) => { setProvider(p); setStep('oauth'); }}
        />
      )}
      {step === 'oauth' && (
        <OAuthRedirect
          provider={provider}
          onSuccess={(token) => { /* store token, advance */ }}
        />
      )}
      {step === 'confirm' && (
        <ServerConfirmation
          provider={provider}
          region={region}
          monthlyCost={provider === 'digitalocean' ? 24 : 25}
          onConfirm={() => startProvisioning()}
        />
      )}
      {step === 'provisioning' && (
        <ProvisioningTimeline phases={PROVISIONING_PHASES} />
      )}
    </Modal>
  );
};
```

### 6.3 Oracle Dashboard (Post-Init)

После активации Oracle, в Unit Profile появляется dashboard:

```tsx
// src/features/UnitProfile/ui/OracleDashboard/OracleDashboard.tsx

interface OracleDashboardProps {
  status: OracleStatus;
}

export const OracleDashboard: FC<OracleDashboardProps> = ({ status }) => {
  return (
    <div className={styles.dashboard}>
      {/* Status Bar */}
      <StatusIndicator
        state={status.state}           // active | suspended | provisioning
        uptime={status.uptime}
        lastHeartbeat={status.lastHeartbeat}
        tier={status.tier}
      />

      {/* Quick Actions */}
      <div className={styles.actions}>
        <Button onClick={openTelegramChat}>
          Chat in Telegram
        </Button>
        <Button onClick={openWebChat} variant="secondary">
          Chat in Browser
        </Button>
        <Button onClick={openVault} variant="ghost">
          Knowledge Vault
        </Button>
      </div>

      {/* Agent Stats */}
      <div className={styles.stats}>
        <Stat label="Messages" value={status.stats.totalMessages} />
        <Stat label="Skills" value={status.stats.installedSkills} />
        <Stat label="Vault Size" value={status.stats.vaultSize} />
        <Stat label="Model" value={status.activeModel} />
      </div>

      {/* Server Info (self-hosted only) */}
      {status.tier === 'self-hosted' && (
        <ServerInfo
          provider={status.server.provider}
          region={status.server.region}
          ip={status.server.ip}         // masked: 185.xxx.xxx.42
          monthlyCost={status.server.monthlyCost}
          nextPayment={status.server.nextPaymentDate}
        />
      )}

      {/* Configuration */}
      <OracleSettings
        onAddApiKey={handleAddApiKey}
        onInstallSkill={handleInstallSkill}
        onManageTelegram={handleTelegramPairing}
      />
    </div>
  );
};
```

### 6.4 Payment Warning Component

```tsx
// src/features/UnitProfile/ui/InitOracle/PaymentWarning.tsx

export const PaymentWarning: FC = () => (
  <div className={styles.warning}>
    <WarningIcon />
    <h4>Server Responsibility</h4>
    <p>
      You are responsible for keeping your server active and paid.
      If the server becomes unreachable for more than 72 hours,
      your Oracle will be suspended.
    </p>
    <p>
      <strong>Alternative:</strong> Achieve MemberStatus <code>Dev</code> or higher
      to use community infrastructure for free — your contribution
      to the ecosystem earns you compute resources.
    </p>
    <div className={styles.statusLink}>
      <span>Current Status: </span>
      <MemberStatusBadge address={address} />
      <a href="/unit-profile#upgrade">How to upgrade →</a>
    </div>
  </div>
);
```

---

## 7. Security Architecture

### 7.1 Threat Model

| Threat | Risk | Mitigation |
|--------|------|------------|
| Compromised server SSH | HIGH | Key-only auth, single key in Vault, key rotation |
| Cross-namespace access | HIGH | NetworkPolicy deny-all, PodSecurityAdmission: restricted |
| Stolen API keys | MEDIUM | Per-user K8s Secrets, Vault encryption at rest |
| SmartOracle compromise | CRITICAL | Minimal permissions, RBAC, audit logging |
| Malicious PicoClaw skill | MEDIUM | Skill allowlist, no host network access |
| Server payment lapse | LOW | Graceful suspend → 30-day decomm timeline |

### 7.2 SSH Key Management

```
                          ┌──────────────────────┐
                          │  HashiCorp Vault      │
                          │  ┌──────────────────┐ │
                          │  │ oracle/servers/   │ │
                          │  │  ├── 0xABC123     │ │ ← Ed25519 private key
                          │  │  ├── 0xDEF456     │ │ ← Ed25519 private key
                          │  │  └── ...          │ │
                          │  └──────────────────┘ │
                          │  Access Policy:       │
                          │   - SmartOracle (R/W) │
                          │   - DevOps Agent (R)  │
                          │   - Nobody else       │
                          └──────────────────────┘

Принципы:
  1. Один ключ на сервер, NO COPIES нигде кроме Vault
  2. Ключ генерируется на master, НИКОГДА на целевом сервере
  3. После деплоя public key → shred private key с диска
  4. Ротация ключей: каждые 90 дней автоматически
  5. Audit log: каждый доступ к ключу логируется
```

### 7.3 Vault Policies (HCL)

```hcl
# SmartOracle full access to oracle secrets
path "oracle/servers/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# DevOps Agent read-only
path "oracle/servers/+/ssh_private_key" {
  capabilities = ["read"]
}

# Unit can only read their own agent config (not SSH keys)
path "oracle/agents/{{identity.entity.aliases.unit_address}}/*" {
  capabilities = ["read"]
}

# No one else has access
path "oracle/*" {
  capabilities = ["deny"]
}
```

### 7.4 K8s Security Layers

```yaml
# Per-namespace security

# 1. PodSecurityAdmission
apiVersion: v1
kind: Namespace
metadata:
  name: oracle-0xabc123
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted

# 2. ResourceQuota (prevent resource abuse)
apiVersion: v1
kind: ResourceQuota
metadata:
  name: oracle-quota
  namespace: oracle-0xabc123
spec:
  hard:
    requests.cpu: "500m"
    requests.memory: "1Gi"
    limits.cpu: "1000m"
    limits.memory: "2Gi"
    persistentvolumeclaims: "2"
    pods: "3"

# 3. NetworkPolicy (deny-all + whitelist)
# See section 4.4 Ansible playbook

# 4. RBAC (service account with minimal permissions)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: picoclaw-role
  namespace: oracle-0xabc123
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]  # Can only see own pods
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get"]           # Can only read own secrets
    resourceNames: ["picoclaw-config"]
```

### 7.5 Key Rotation Schedule

| Asset | Rotation Period | Method |
|-------|----------------|--------|
| SSH keys | 90 days | Automated via DevOps Agent CronJob |
| K3s join token | 180 days | Master token rotate + re-join |
| Vault tokens | 24 hours | Auto-renewal via Vault agent |
| API keys (user's) | User-managed | Stored in K8s Secrets, encrypted at rest |

---

## 8. API Specification

### 8.1 GPROD Oracle Module — REST API

Base URL: `https://api.gprod.build.infra.gyber.org/api/v1/oracle`

#### 8.1.1 Get Oracle Status

```
GET /status
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...

Response 200:
{
  "state": "active" | "provisioning" | "suspended" | "none",
  "tier": "self-hosted" | "community" | null,
  "server": {
    "provider": "digitalocean" | "gcp" | "community",
    "region": "fra1",
    "ip": "185.xxx.xxx.42",
    "nodeStatus": "Ready",
    "monthlyCost": 24,
    "nextPaymentDate": "2026-04-10T00:00:00Z"
  },
  "agent": {
    "namespace": "oracle-0xabc123",
    "podStatus": "Running",
    "uptime": "72h15m",
    "lastHeartbeat": "2026-03-10T14:30:00Z",
    "activeModel": "qwen3-coder",
    "telegramPaired": true,
    "installedSkills": ["weather", "summarize", "session-logs"],
    "vaultSize": "128Mi"
  },
  "stats": {
    "totalMessages": 1247,
    "totalSessions": 89,
    "createdAt": "2026-02-15T10:00:00Z"
  }
}

Response 200 (no oracle):
{
  "state": "none",
  "profileComplete": false,
  "missingFields": ["bio", "specialisation"]
}
```

#### 8.1.2 Initialize Oracle (Self-Hosted)

```
POST /init/self-hosted
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...
Content-Type: application/json

Request:
{
  "provider": "digitalocean",
  "oauthToken": "dop_v1_xxx...",
  "region": "fra1",
  "size": "s-2vcpu-4gb"
}

Response 202:
{
  "provisioningId": "prov_abc123",
  "estimatedTime": 900,
  "phases": [
    { "name": "server_creation", "status": "in_progress" },
    { "name": "security_hardening", "status": "pending" },
    { "name": "k8s_join", "status": "pending" },
    { "name": "agent_deploy", "status": "pending" },
    { "name": "health_check", "status": "pending" }
  ]
}
```

#### 8.1.3 Initialize Oracle (Community)

```
POST /init/community
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...

Response 202 (if MemberStatus >= Dev):
{
  "provisioningId": "prov_def456",
  "estimatedTime": 120,
  "phases": [
    { "name": "on_chain_verify", "status": "in_progress" },
    { "name": "namespace_create", "status": "pending" },
    { "name": "agent_deploy", "status": "pending" },
    { "name": "health_check", "status": "pending" }
  ]
}

Response 403:
{
  "error": "INSUFFICIENT_STATUS",
  "required": "Dev (2)",
  "current": "Unit (1)",
  "message": "Community tier requires MemberStatus >= Dev"
}
```

#### 8.1.4 Provisioning Status (SSE)

```
GET /provisioning/{provisioningId}/stream
Authorization: Bearer {jwt}
Accept: text/event-stream

event: phase_update
data: {"phase": "server_creation", "status": "completed", "duration": 45}

event: phase_update
data: {"phase": "security_hardening", "status": "in_progress", "step": "Disabling password auth"}

event: phase_update
data: {"phase": "security_hardening", "status": "completed", "duration": 120}

event: completed
data: {"state": "active", "telegramPairingUrl": "https://t.me/GyberOracle_bot?start=pair_abc123"}
```

#### 8.1.5 Suspend / Resume / Destroy

```
POST /suspend
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...

POST /resume
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...

DELETE /destroy
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...
X-Confirm: "I understand this will permanently delete my Oracle and all data"

Response 200: { "state": "destroyed", "dataExportUrl": "..." }
```

#### 8.1.6 Add API Key

```
POST /config/api-key
Authorization: Bearer {jwt}
X-Wallet-Address: 0x...
Content-Type: application/json

{
  "provider": "anthropic",
  "apiKey": "sk-ant-xxx..."
}

Response 200:
{
  "provider": "anthropic",
  "models": ["claude-sonnet-4-6", "claude-opus-4-6"],
  "status": "verified"
}
```

### 8.2 SmartOracle Internal API

Communication between GPROD and SmartOracle via authenticated gRPC:

```protobuf
service OracleOrchestrator {
  // Server lifecycle
  rpc ProvisionServer(ProvisionRequest) returns (stream ProvisionEvent);
  rpc SuspendAgent(AgentRef) returns (AgentStatus);
  rpc ResumeAgent(AgentRef) returns (AgentStatus);
  rpc DestroyAgent(AgentRef) returns (DestroyResult);

  // Health & monitoring
  rpc GetAgentHealth(AgentRef) returns (HealthReport);
  rpc StreamHealthEvents(Empty) returns (stream HealthEvent);

  // Registry
  rpc ListAgents(ListFilter) returns (AgentList);
  rpc GetAgentConfig(AgentRef) returns (AgentConfig);
}

message ProvisionRequest {
  string unit_address = 1;
  string provider = 2;        // "digitalocean" | "gcp" | "community"
  string oauth_token = 3;     // encrypted
  string region = 4;
  string tier = 5;
  UnitProfile profile = 6;    // for workspace generation
}

message ProvisionEvent {
  string phase = 1;
  string status = 2;          // "in_progress" | "completed" | "failed"
  string detail = 3;
  int32 progress_percent = 4;
}
```

---

## 9. Data Models & Types

### 9.1 Oracle Types (TypeScript — shared)

```typescript
// src/shared/types/oracle.ts

export type OracleState =
  | 'none'
  | 'provisioning'
  | 'active'
  | 'suspended'
  | 'decommissioning'
  | 'destroyed';

export type OracleTier = 'self-hosted' | 'community';
export type CloudProvider = 'digitalocean' | 'gcp';
export type ProvisioningPhase =
  | 'server_creation'
  | 'security_hardening'
  | 'k8s_join'
  | 'namespace_create'
  | 'agent_deploy'
  | 'health_check'
  | 'on_chain_verify';

export interface OracleStatus {
  state: OracleState;
  tier: OracleTier | null;
  server: OracleServer | null;
  agent: OracleAgent | null;
  stats: OracleStats;
  provisioningId?: string;
  suspendReason?: 'payment_lapse' | 'server_unreachable' | 'manual' | 'security';
}

export interface OracleServer {
  provider: CloudProvider | 'community';
  region: string;
  ip: string;              // masked in frontend
  nodeStatus: 'Ready' | 'NotReady' | 'Unknown';
  monthlyCost: number;     // 0 for community
  nextPaymentDate: string | null;
  createdAt: string;
}

export interface OracleAgent {
  namespace: string;
  podStatus: 'Running' | 'Pending' | 'Failed' | 'Unknown';
  uptime: string;
  lastHeartbeat: string;
  activeModel: string;
  telegramPaired: boolean;
  telegramPairingUrl?: string;
  installedSkills: string[];
  vaultSize: string;
}

export interface OracleStats {
  totalMessages: number;
  totalSessions: number;
  createdAt: string;
}

export interface ProvisioningStatus {
  provisioningId: string;
  estimatedTime: number;
  phases: ProvisioningPhaseStatus[];
}

export interface ProvisioningPhaseStatus {
  name: ProvisioningPhase;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  duration?: number;
  detail?: string;
  error?: string;
}

export interface OracleInitRequest {
  tier: OracleTier;
  provider?: CloudProvider;
  oauthToken?: string;
  region?: string;
  size?: string;
}
```

### 9.2 UnitProfile Extension

Extend existing `UnitProfile` type:

```typescript
// Addition to src/shared/types/unit-profile.ts

export interface UnitProfile {
  // ... existing fields ...

  // Oracle integration
  oracle?: {
    state: OracleState;
    tier: OracleTier | null;
    initAt?: number;
    namespace?: string;
  };
}
```

### 9.3 Database Schema (Supabase)

```sql
-- Oracle instances registry
CREATE TABLE oracle_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_address VARCHAR(42) NOT NULL UNIQUE,
  state VARCHAR(20) NOT NULL DEFAULT 'provisioning',
  tier VARCHAR(20) NOT NULL,                    -- 'self-hosted' | 'community'
  provider VARCHAR(20),                          -- 'digitalocean' | 'gcp' | null
  server_ip INET,
  server_region VARCHAR(20),
  k8s_namespace VARCHAR(63) NOT NULL,
  k8s_node_name VARCHAR(63),
  monthly_cost DECIMAL(10,2) DEFAULT 0,
  vault_secret_path VARCHAR(255),               -- Vault path for SSH key
  telegram_paired BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  suspended_at TIMESTAMPTZ,
  suspend_reason VARCHAR(50),
  last_heartbeat TIMESTAMPTZ,
  CONSTRAINT fk_unit FOREIGN KEY (unit_address)
    REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Provisioning logs
CREATE TABLE oracle_provisioning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oracle_id UUID REFERENCES oracle_instances(id),
  phase VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL,
  detail TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Oracle health history
CREATE TABLE oracle_health_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oracle_id UUID REFERENCES oracle_instances(id),
  event_type VARCHAR(30) NOT NULL,            -- 'heartbeat' | 'down' | 'up' | 'error'
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE oracle_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY oracle_own_instance ON oracle_instances
  FOR SELECT USING (unit_address = current_setting('app.wallet_address'));

CREATE POLICY oracle_system_manage ON oracle_instances
  FOR ALL USING (current_setting('app.role') = 'system');
```

---

## 10. K8s Cluster Architecture

### 10.1 Cluster Topology

```
┌─────────────────────────────────────────────────────┐
│                    K3s MASTER NODE                    │
│                (Hetzner/Oracle Cloud)                 │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ API Server   │  │ etcd         │  │ Scheduler  │ │
│  │ Controller   │  │ (embedded)   │  │            │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                      │
│  System Namespaces:                                  │
│  ┌─────────────────┐  ┌────────────────┐            │
│  │ ns: openclaw     │  │ ns: vault      │            │
│  │ (SmartOracle)    │  │ (HashiCorp)    │            │
│  └─────────────────┘  └────────────────┘            │
│  ┌─────────────────┐  ┌────────────────┐            │
│  │ ns: gprod        │  │ ns: monitoring │            │
│  │ (Backend API)    │  │ (Prometheus)   │            │
│  └─────────────────┘  └────────────────┘            │
└──────────────────────┬──────────────────────────────┘
                       │ K3s Agent Join
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ WORKER 1   │ │ WORKER 2   │ │ WORKER N   │
│ (DO, fra1) │ │ (GCP, eu)  │ │ (DO, nyc1) │
│            │ │            │ │            │
│ ns: oracle-│ │ ns: oracle-│ │ ns: oracle-│
│  0xABC...  │ │  0xDEF...  │ │  0x789...  │
│ (PicoClaw) │ │ (PicoClaw) │ │ (PicoClaw) │
└────────────┘ └────────────┘ └────────────┘

┌──────────────────────────┐
│ COMMUNITY WORKERS (2-3)  │  ◄── Shared nodes for Dev+ tier
│ (Hetzner, Gybernaty-owned)│
│                          │
│ ns: oracle-community-001 │
│ ns: oracle-community-002 │
│ ns: oracle-community-... │
└──────────────────────────┘
```

### 10.2 Node Affinity Rules

```yaml
# Self-hosted: PicoClaw runs on user's own node
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gybernaty.org/unit
              operator: In
              values: ["{{ unit_address }}"]

# Community: PicoClaw runs on community nodes
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gybernaty.org/role
              operator: In
              values: ["community-worker"]
```

### 10.3 Health Monitoring

SmartOracle Health Monitor проверяет каждые 5 минут:

1. **Node status** — `kubectl get node oracle-{address}` → Ready/NotReady
2. **Pod status** — `kubectl get pod -n oracle-{address}` → Running/Failed
3. **Heartbeat** — last OpenClaw heartbeat timestamp (30-min interval)
4. **Server reachability** — TCP probe to server IP port 22

```
Health Check Decision Tree:
                              ┌──────────────┐
                              │ Node Ready?  │
                              └──────┬───────┘
                           YES ──────┼────── NO
                              ┌──────▼───────┐
                              │ Pod Running? │    → 3 failures: SUSPEND
                              └──────┬───────┘
                           YES ──────┼────── NO
                              ┌──────▼───────┐
                              │ Heartbeat    │    → restart pod
                              │  < 1 hour?   │
                              └──────┬───────┘
                           YES ──────┼────── NO
                              ┌──────▼───────┐
                              │   HEALTHY    │    → investigate/alert
                              └──────────────┘
```

---

## 11. Tier System & Economics

### 11.1 Tier Matrix

| Parameter | Community (Dev+) | Self-Hosted |
|-----------|-----------------|-------------|
| **Cost** | Free | ~$24-25/mo (user pays provider directly) |
| **Eligibility** | MemberStatus ≥ Dev (on-chain) | Any registered Unit |
| **CPU** | 250m req / 500m limit | 500m req / 1000m limit |
| **RAM** | 512Mi req / 1Gi limit | 1Gi req / 2Gi limit |
| **Storage** | 2Gi PVC | 5Gi PVC |
| **Pods max** | 2 | 3 |
| **AI Models** | Free only (Qwen3) | Free + user's own keys |
| **Browser** | No | Yes (Chromium sidecar) |
| **GitHub** | Read-only | Full access |
| **Custom Skills** | No | Yes |
| **Audio (STT)** | No | Yes (with user's Deepgram key) |
| **Telegram** | Shared bot | Shared bot |
| **SLA** | Best-effort | User-managed server |

### 11.2 On-Chain Verification

```typescript
// Verify MemberStatus for community tier eligibility
// Reads directly from UnitManager.sol on BSC

import { readContract } from 'wagmi/actions';
import { unitManagerABI } from '@/shared/abi/UnitManager';

const UNIT_MANAGER_ADDRESS = '0x...'; // BSC deployment

async function getMemberStatus(address: `0x${string}`): Promise<number> {
  const member = await readContract({
    address: UNIT_MANAGER_ADDRESS,
    abi: unitManagerABI,
    functionName: 'members',
    args: [address],
    chainId: 56, // BSC
  });

  // member.status: 0=None, 1=Unit, 2=Dev, 3=LeadDev, 4=ArchDev
  return Number(member.status);
}

function isEligibleForCommunity(status: number): boolean {
  return status >= 2; // Dev or higher
}
```

### 11.3 Economics Model

```
Revenue / Cost Analysis:

Self-hosted (per unit):
  - Revenue to Gybernaty: $0 (user pays provider directly)
  - Infra cost to Gybernaty: $0 (user's server)
  - Operational cost: ~$2/mo (monitoring, Vault storage, K3s overhead)
  - Net: -$2/mo (covered by ecosystem value)

Community (per unit):
  - Revenue: $0 (free for Dev+ contributors)
  - Infra cost: ~$5/mo per agent (shared node amortized)
  - Funded by: ecosystem treasury (GBR token allocation)

Break-even:
  - Community nodes (Hetzner CAX21: 4vCPU, 8GB, €5.5/mo)
  - ~8 PicoClaw agents per community node (with resource limits)
  - Cost per agent: ~€0.69/mo
  - 100 community agents = ~€69/mo = manageable

Incentive alignment:
  - Dev+ members contribute code → earn community tier
  - Self-hosted members pay their own infra → zero cost to ecosystem
  - Both models are sustainable at scale
```

---

## 12. Agent Social Network

### 12.1 Vision: Oracle Social Layer

Все Unit Oracles образуют **социальную сеть агентов** — каждый PicoClaw может взаимодействовать с другими агентами, обмениваться публичными знаниями и координировать действия. Пользователь полностью контролирует приватность.

```
┌──────────────────────────────────────────────────────────────┐
│                   ORACLE SOCIAL NETWORK                       │
│                                                               │
│  ┌──────────┐     libp2p gossipsub      ┌──────────┐        │
│  │ Oracle-A  │◄────────────────────────►│ Oracle-B  │        │
│  │ (0xABC)   │    /gybernaty/agents/v1  │ (0xDEF)   │        │
│  │           │                          │           │        │
│  │ Public:   │                          │ Public:   │        │
│  │ - skills  │                          │ - skills  │        │
│  │ - projects│     Encrypted P2P        │ - projects│        │
│  │ Private:  │◄──── (user's crypto ────►│ Private:  │        │
│  │ - vault   │       key required)      │ - vault   │        │
│  └─────┬─────┘                          └─────┬─────┘        │
│        │                                      │              │
│        │        ┌──────────┐                  │              │
│        └───────►│ Oracle-C  │◄────────────────┘              │
│                 │ (0x789)   │                                 │
│                 └──────────┘                                  │
│                                                               │
│  SmartOracle = Network Coordinator (NOT gateway)              │
│  - Agent discovery & registry                                 │
│  - Topic management                                           │
│  - Does NOT see private data                                  │
└──────────────────────────────────────────────────────────────┘
```

### 12.2 Communication Protocol

```
Transport: libp2p (noise encryption + yamux multiplexing)
Discovery: SmartOracle publishes agent registry (public keys + capabilities)
Topics (gossipsub):
  /gybernaty/agents/v1/announce    — agent online/offline, capability updates
  /gybernaty/agents/v1/collab      — collaboration requests (code review, pair work)
  /gybernaty/agents/v1/knowledge   — public knowledge sharing (opt-in)

Direct Messages:
  libp2p direct stream, encrypted with recipient's public key
  Only possible if recipient agent has DM enabled in privacy settings
```

### 12.3 Privacy Control Model

Пользователь определяет доступность данных через Privacy Settings в Unit Profile:

```typescript
// src/shared/types/oracle.ts

export interface OraclePrivacySettings {
  // What other agents can see
  publicProfile: boolean;          // unitname, specialisation, skills visible
  publicProjects: boolean;         // project list visible
  publicVaultFolders: string[];    // specific vault folders shared publicly

  // Communication permissions
  allowAgentDM: boolean;           // other agents can send DMs
  allowCollabRequests: boolean;    // other agents can request collaboration
  allowKnowledgeSharing: boolean;  // participate in knowledge topic

  // Encryption
  encryptAllPrivateData: boolean;  // IPFS data encrypted by default
  shareKeyWith: string[];          // wallet addresses that can decrypt private data
}
```

### 12.4 Agent Capabilities Advertisement

Каждый Oracle публикует свой capability manifest в сеть:

```json
{
  "agentId": "oracle-0xABC123",
  "unitname": "CyberPioneer",
  "publicKey": "ed25519:...",
  "capabilities": {
    "specialisation": "fullstack",
    "skills": ["react", "typescript", "solidity"],
    "models": ["qwen3-coder"],
    "canReview": ["typescript", "solidity"],
    "canTeach": ["react", "web3"]
  },
  "privacy": {
    "dmEnabled": true,
    "collabEnabled": true,
    "knowledgeSharing": true
  },
  "status": "online",
  "lastSeen": "2026-03-10T14:30:00Z"
}
```

### 12.5 Collaboration Flows

```
Scenario: Agent-A needs Solidity code review

1. Agent-A searches network: "agents with solidity review capability"
2. SmartOracle registry returns: [Oracle-B (LeadDev), Oracle-C (Dev)]
3. Agent-A sends collab request to Oracle-B:
   {
     "type": "code_review",
     "language": "solidity",
     "context": "UnitManager upgrade",
     "encrypted_diff": "..." // encrypted with Oracle-B's public key
   }
4. Oracle-B's owner gets notification in Telegram/Web Chat
5. Oracle-B owner approves → Oracle-B reviews code
6. Review result sent back via encrypted DM
7. Both agents log interaction in their vaults
```

---

## 13. Data Sovereignty — DDP (Decentralized Data Platform) Integration

### 13.1 Principle

Oracle интегрируется с существующим проектом **DDP (Decentralized Data Platform)** — полноценной платформой децентрализованного хранения данных для DSP. Все данные Oracle хранятся в **IPFS (обязательно)** + **GitHub private repo (опционально)**. Пользователь контролирует что открыто, что зашифровано. Расшифровать может только владелец крипто-ключа.

> **Reference**: `CSC/docs/system-architecture/04-DDP-REQUIREMENTS.md` — полная спецификация DDP
> **Reference**: `CSC/DSP/promts/decentralized-data-platform/WHITEPAPER_AND_SPEC.md` — whitepaper
> **Types**: `CSC/DSP/src/shared/types/ipfs-storage.ts` — уже определены

### 13.2 DDP Architecture (Oracle Layer)

Oracle использует **DDPDataService** (Phase 2 абстракция) вместо отдельной IPFS реализации:

```
┌─────────────────────────────────────────────────────────┐
│                    Oracle / PicoClaw                      │
│               (DataService abstraction)                   │
└────────┬──────────────┬──────────────────┬──────────────┘
         │              │                  │
    Supabase SDK   GPROD API          IPFS Client
    (кеш/index)    (DDP proxy)        (Helia direct)
         │              │                  │
┌────────▼──────┐ ┌─────▼──────┐   ┌──────▼──────────┐
│   SUPABASE    │ │   GPROD    │   │      IPFS       │
│  sessions     │ │ DDP proxy  │   │  vault data      │
│  search index │ │ encryption │   │  agent config    │
│  activity_log │ │ pinning    │   │  chat history    │
└───────────────┘ └─────┬──────┘   │  capability      │
                        │          │  manifest         │
              ┌─────────▼──────┐   └──────────────────┘
              │  BSC Blockchain │
              │ ContentRegistry │ ← CID ownership & versions
              │ ACLContract     │ ← encrypted key distribution
              │ Monetization    │ ← paid content (Phase 3)
              └────────────────┘
```

### 13.3 Data Storage Model

```
Unit's Oracle Data
├── PUBLIC (plaintext on IPFS, CID → ContentRegistry.sol)
│   ├── Unit Profile (bio, skills, projects)
│   ├── Public vault folders (user-selected)
│   ├── Agent capability manifest
│   └── Published knowledge (opt-in shared research)
│
├── ENCRYPTED (AES-GCM on IPFS, keys via ACLContract.sol)
│   ├── Private vault folders
│   ├── Chat history (agent conversations)
│   ├── API keys (double-encrypted: AES-256-GCM + wallet key)
│   ├── Personal notes & research
│   ├── Agent configuration & preferences
│   └── Agent-to-agent DM history
│
├── SHARED (encrypted, per-recipient key via ACLContract)
│   ├── Collaboration data (shared with specific agents)
│   ├── Code review results
│   └── Knowledge sharing contributions
│
└── OPTIONAL MIRROR (GitHub private repo)
    ├── Full vault backup (encrypted)
    └── Config snapshots (via vault-sync.sh)
```

### 13.4 DDP DataService Integration

Oracle использует тот же DataService interface что и DSP:

```typescript
// Oracle extends the DSP DataService abstraction
// Reference: CSC/docs/system-architecture/04-DDP-REQUIREMENTS.md §2.1

interface IDataService {
  // Profiles
  getProfile(address: string): Promise<UserProfile>;
  updateProfile(address: string, data: Partial<UserProfile>): Promise<void>;

  // Content (vault data, agent output)
  publishContent(content: ContentPayload): Promise<string>;
  getContent(contentId: string): Promise<Content>;

  // Files (vault files, attachments)
  uploadFile(file: File, encrypted: boolean): Promise<string>;
  getFile(fileId: string): Promise<Blob>;
  shareFile(fileId: string, recipients: string[]): Promise<void>;

  // Messages (agent chat history)
  sendMessage(chatId: string, message: MessagePayload): Promise<string>;
  getMessages(chatId: string, pagination: Pagination): Promise<Message[]>;
}

// Oracle-specific extension
interface IOracleDataService extends IDataService {
  // Vault operations
  syncVault(namespace: string): Promise<void>;
  exportVault(encrypted: boolean): Promise<string>;  // returns manifest CID
  importVault(manifestCid: string): Promise<void>;

  // Agent capability manifest
  publishCapabilities(manifest: AgentCapabilityManifest): Promise<string>;
  getAgentCapabilities(agentId: string): Promise<AgentCapabilityManifest>;
}
```

### 13.5 Existing Types (ipfs-storage.ts)

Типы уже определены в `src/shared/types/ipfs-storage.ts`:

```typescript
// Already exists — Oracle reuses these directly:
EncryptedData        // { data, iv, salt, algorithm: 'AES-GCM' | 'AES-CBC' }
IPFSUserProfile      // { unitname, avatar, bio, publicKey, walletAddress, ... }
IPFSMessage          // { id, from, to, content, messageType, signature, ... }
IPFSChat             // { id, name, type, participants, encryptionKey, ... }
DecentralizedDBEntry // { id, type, ipfsHash, owner, sharedWith, isEncrypted }
GroupChatAccess      // { chatId, participantAddress, encryptedGroupKey, permissions }
CryptoKeys           // { publicKey, privateKey, keyType: 'secp256k1' | 'ed25519' }
IPFSStorageConfig    // { gateway, apiEndpoint, pinataApiKey, ... }
```

### 13.6 Smart Contracts for Oracle Data

Oracle использует DDP смарт-контракты для on-chain управления данными:

**ContentRegistry.sol** (DDP Phase 2.2):
```solidity
// Каждый объект в vault Oracle = запись в ContentRegistry
registerContent(cid, contentType, aclAddress) → contentId
updateContent(contentId, newCid)  // vault update → new CID, previousCid сохраняется
getContentsByOwner(owner) → contentId[]  // все данные пользователя

ContentType: Post | File | Profile | MessageBatch | Album
```

**ACLContract.sol** (DDP Phase 2.2):
```solidity
// Управление доступом к encrypted данным
grantAccess(contentId, subject, level, encryptedKey, expiresAt)
// encryptedKey = симметричный AES ключ, зашифрованный publicKey получателя
// Используется для agent-to-agent data sharing

revokeAccess(contentId, subject)
hasAccess(contentId, subject, requiredLevel) → bool
```

### 13.7 Encryption Layer

```typescript
// Reference: 04-DDP-REQUIREMENTS.md §4.2
// Uses existing DSP dependencies: @noble/secp256k1, @noble/hashes, crypto-js

// Key derivation from wallet (deterministic, not stored):
deriveKeyFromWallet(signMessage) → CryptoKey
  // User signs deterministic message → derive AES-256-GCM key
  // Key bound to wallet — no separate storage needed

// Content encryption:
encryptContent(data, key) → EncryptedData  // AES-GCM with random IV
decryptContent(encryptedData, key) → Uint8Array

// Per-recipient key sharing (for ACLContract):
encryptKeyForRecipient(symmetricKey, recipientPublicKey) → string  // ECIES
decryptKeyWithPrivateKey(encryptedKey, privateKey) → CryptoKey
```

### 13.8 IPFS Client (Helia)

```typescript
// Reference: 04-DDP-REQUIREMENTS.md §4.1
// Already in DSP dependencies: helia ^5.4.2, @helia/json, @helia/unixfs, @helia/http

// Oracle IPFS operations:
uploadToIPFS(data, { encrypted: boolean }) → CID
  // If encrypted: client-side AES-GCM → upload ciphertext
  // Pin via GPROD → Pinata/self-hosted

downloadFromIPFS(cid) → Uint8Array
  // Fetch via gateway, decrypt on client if encrypted

// GPROD DDP proxy endpoints:
POST /ddp/pin          // Pin CID on server-side IPFS/Pinata
POST /ddp/unpin        // Unpin CID
GET  /ddp/content/:cid // Proxy to IPFS gateway
GET  /ddp/search       // Search via Supabase index
```

### 13.9 Data Lifecycle on Oracle Destroy

```
1. Export ALL vault data → IPFS (encrypted with user's wallet key)
2. Register manifest in ContentRegistry (all CIDs + structure)
3. Encrypt manifest CID → IPFS (only user can decrypt)
4. Optionally push encrypted backup → user's GitHub private repo
5. Return manifest CID to user (永久 recoverable via wallet)
6. Delete K8s namespace, PVC, secrets
7. Remove node from cluster
8. IPFS data persists indefinitely (pinned by community nodes)
9. User can restore full Oracle from manifest CID + wallet signature
```

### 13.10 DDP Integration Roadmap for Oracle

Oracle DDP integration follows the DSP DDP roadmap:

| DDP Phase | Oracle Integration |
|-----------|-------------------|
| **Phase 2.1** (IPFS Storage) | Oracle vault → IPFS, agent config → IPFS encrypted |
| **Phase 2.2** (Smart Contracts) | ContentRegistry for vault entries, ACLContract for agent sharing |
| **Phase 2.3** (Migration) | Existing PVC vault data → IPFS + ContentRegistry |
| **Phase 2.4** (P2P Messaging) | Agent-to-agent messages via DDP E2E encrypted protocol |

---

## 14. Web Chat — Oracle Panel in DSP

### 14.1 Design Vision

В Unit Profile справа выезжает **Oracle Chat Panel** — прогрессивный интерфейс для взаимодействия с персональным агентом прямо в браузере. Не просто чат, а **командный центр** для управления агентной системой.

### 14.2 UI Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Unit Profile Page                        │
│  ┌─────────────────────────┐  ┌───────────────────────────┐ │
│  │                         │  │   ORACLE PANEL (slide-in)  │ │
│  │    Profile Content      │  │  ┌─────────────────────┐  │ │
│  │    (Dashboard/Edit)     │  │  │ Agent Status Bar    │  │ │
│  │                         │  │  │ ● Online | qwen3    │  │ │
│  │                         │  │  ├─────────────────────┤  │ │
│  │                         │  │  │                     │  │ │
│  │                         │  │  │   Chat Messages     │  │ │
│  │                         │  │  │   (markdown render) │  │ │
│  │                         │  │  │                     │  │ │
│  │                         │  │  │   Agent thinking... │  │ │
│  │                         │  │  │                     │  │ │
│  │                         │  │  ├─────────────────────┤  │ │
│  │                         │  │  │ ┌─────┐ ┌────────┐ │  │ │
│  │                         │  │  │ │ 📎  │ │ Send ▶ │ │  │ │
│  │                         │  │  │ └─────┘ └────────┘ │  │ │
│  │                         │  │  ├─────────────────────┤  │ │
│  │                         │  │  │ Quick Actions:      │  │ │
│  │                         │  │  │ [Skills] [Vault]    │  │ │
│  │                         │  │  │ [Agents] [Settings] │  │ │
│  │                         │  │  └─────────────────────┘  │ │
│  └─────────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 14.3 Oracle Panel Component

```tsx
// src/features/UnitProfile/ui/OraclePanel/OraclePanel.tsx

interface OraclePanelProps {
  isOpen: boolean;
  onClose: () => void;
  oracleStatus: OracleStatus;
}

export const OraclePanel: FC<OraclePanelProps> = ({ isOpen, onClose, oracleStatus }) => {
  const [messages, setMessages] = useState<OracleMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'skills' | 'vault' | 'network'>('chat');
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection to Oracle agent via GPROD gateway
  useEffect(() => {
    if (oracleStatus.state !== 'active') return;

    const ws = new WebSocket(
      `wss://api.gprod.build.infra.gyber.org/ws/oracle/${oracleStatus.agent.namespace}`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'response') {
        setMessages(prev => [...prev, {
          role: 'oracle',
          content: msg.content,
          timestamp: Date.now(),
          model: msg.model,
        }]);
      }
      if (msg.type === 'thinking') {
        // Show thinking indicator with partial content
      }
    };

    wsRef.current = ws;
    return () => ws.close();
  }, [oracleStatus]);

  return (
    <motion.div
      className={styles.panel}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Agent Status Header */}
      <div className={styles.header}>
        <div className={styles.agentInfo}>
          <StatusDot status={oracleStatus.state} />
          <span className={styles.agentName}>Oracle</span>
          <span className={styles.model}>{oracleStatus.agent?.activeModel}</span>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
          Chat
        </TabButton>
        <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>
          Skills
        </TabButton>
        <TabButton active={activeTab === 'vault'} onClick={() => setActiveTab('vault')}>
          Vault
        </TabButton>
        <TabButton active={activeTab === 'network'} onClick={() => setActiveTab('network')}>
          Network
        </TabButton>
      </div>

      {/* Content Area */}
      {activeTab === 'chat' && (
        <OracleChatView
          messages={messages}
          onSend={(msg) => {
            wsRef.current?.send(JSON.stringify({ type: 'message', content: msg }));
            setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: Date.now() }]);
          }}
        />
      )}

      {activeTab === 'skills' && (
        <OracleSkillsView
          installedSkills={oracleStatus.agent?.installedSkills || []}
          onInstall={handleInstallSkill}
        />
      )}

      {activeTab === 'vault' && (
        <OracleVaultBrowser
          namespace={oracleStatus.agent?.namespace}
        />
      )}

      {activeTab === 'network' && (
        <OracleNetworkView
          connectedAgents={connectedAgents}
          privacySettings={privacySettings}
          onUpdatePrivacy={handleUpdatePrivacy}
        />
      )}
    </motion.div>
  );
};
```

### 14.4 Network Tab — Agent Discovery

```tsx
// src/features/UnitProfile/ui/OraclePanel/OracleNetworkView.tsx

export const OracleNetworkView: FC<Props> = ({ connectedAgents, privacySettings, onUpdatePrivacy }) => (
  <div className={styles.network}>
    {/* Privacy Controls */}
    <div className={styles.privacy}>
      <h4>Privacy Settings</h4>
      <Toggle label="Public Profile" value={privacySettings.publicProfile} onChange={...} />
      <Toggle label="Allow Agent DMs" value={privacySettings.allowAgentDM} onChange={...} />
      <Toggle label="Allow Collab Requests" value={privacySettings.allowCollabRequests} onChange={...} />
      <Toggle label="Knowledge Sharing" value={privacySettings.allowKnowledgeSharing} onChange={...} />
    </div>

    {/* Online Agents */}
    <div className={styles.agents}>
      <h4>Network ({connectedAgents.length} online)</h4>
      {connectedAgents.map(agent => (
        <AgentCard
          key={agent.agentId}
          unitname={agent.unitname}
          specialisation={agent.capabilities.specialisation}
          skills={agent.capabilities.skills}
          status={agent.status}
          onChat={() => openAgentDM(agent.agentId)}
          onCollab={() => requestCollab(agent.agentId)}
        />
      ))}
    </div>
  </div>
);
```

### 14.5 Design System Integration

Oracle Panel следует DSP Design System:

- **Dark-First**: Deep cosmos background (#001019) с glassmorphism
- **Accent Colors**: Cyan energy (#42b8f3) для Oracle status, Golden (#d49d32) для actions
- **Spring Animations**: Framer Motion `type: spring, damping: 25` для slide-in
- **Glassmorphism**: `backdrop-filter: blur(16px)` для panel background
- **Typography**: Montserrat для UI, monospace для code/agent output
- **OKLCH**: Perceptually uniform цвета для status indicators

---

## 15. Observability & Monitoring

### 15.1 Metrics (Prometheus)

```yaml
# Custom metrics exposed by Oracle system

# Per-agent metrics
oracle_agent_uptime_seconds{namespace, tier}
oracle_agent_messages_total{namespace, tier}
oracle_agent_model_requests_total{namespace, model}
oracle_agent_vault_size_bytes{namespace}
oracle_agent_last_heartbeat_timestamp{namespace}

# System metrics
oracle_provisioning_duration_seconds{provider, phase}
oracle_provisioning_failures_total{provider, phase, error}
oracle_agents_total{state, tier}
oracle_nodes_total{provider, status}
oracle_vault_secrets_total
```

### 15.2 Alerts

```yaml
# AlertManager rules

- alert: OracleAgentDown
  expr: time() - oracle_agent_last_heartbeat_timestamp > 3600
  for: 15m
  labels:
    severity: warning
  annotations:
    summary: "Oracle agent {{ $labels.namespace }} heartbeat stale"

- alert: OracleNodeNotReady
  expr: kube_node_status_condition{condition="Ready",status="true",node=~"oracle-.*"} == 0
  for: 10m
  labels:
    severity: critical
  annotations:
    summary: "Oracle worker node {{ $labels.node }} is NotReady"

- alert: OracleProvisioningStuck
  expr: oracle_provisioning_duration_seconds > 900
  labels:
    severity: warning
  annotations:
    summary: "Provisioning {{ $labels.namespace }} exceeds 15 minutes"
```

### 15.3 Dashboards

Grafana dashboards:

1. **Oracle Fleet Overview** — total agents, states, tiers, provisioning queue
2. **Per-Agent Detail** — uptime, messages, model usage, vault size, health timeline
3. **Infrastructure** — nodes by provider, resource utilization, network traffic
4. **Security** — Vault access logs, SSH key rotation status, NetworkPolicy violations

---

## 16. Roadmap

### Phase 1: Foundation (4 weeks)

| Week | Deliverable |
|------|-------------|
| W1 | GPROD Oracle Module (REST API skeleton, DB schema, migrations) |
| W1 | Oracle types in shared-types package |
| W2 | DigitalOcean provisioning flow (OAuth + Droplet API) |
| W2 | Ansible hardening playbook (SSH + K3s agent) |
| W3 | HashiCorp Vault setup + DevOps Agent skill |
| W3 | PicoClaw Helm values template + workspace generator |
| W4 | SmartOracle ↔ GPROD gRPC communication |
| W4 | Health monitoring + heartbeat system |

### Phase 2: DSP Integration (3 weeks)

| Week | Deliverable |
|------|-------------|
| W5 | Init Oracle UI component in Unit Profile |
| W5 | Provider selection flow (DO + GCP) |
| W6 | Provisioning progress UI (SSE streaming) |
| W6 | Oracle Dashboard component |
| W7 | Telegram pairing integration (shared bot) |
| W7 | Community tier + on-chain verification |

### Phase 3: Hardening (3 weeks)

| Week | Deliverable |
|------|-------------|
| W8 | Security audit (full Security Team scan) |
| W8 | Key rotation automation |
| W9 | Prometheus metrics + Grafana dashboards |
| W9 | Suspend/resume/destroy flows |
| W10 | Load testing (50 concurrent provisions) |
| W10 | Documentation, runbooks, incident procedures |

### Phase 4: Agent Social Network (3 weeks)

| Week | Deliverable |
|------|-------------|
| W11 | libp2p transport layer between Oracle agents |
| W11 | Agent capability manifest + registry in SmartOracle |
| W12 | Privacy settings UI in Oracle Panel (Network tab) |
| W12 | Agent discovery + DM protocol |
| W13 | Collaboration request flow (code review, pair) |
| W13 | Knowledge sharing topic (opt-in gossipsub) |

### Phase 5: Scale & Polish (ongoing)

| Milestone | Deliverable |
|-----------|-------------|
| M5.1 | GCP provider integration |
| M5.2 | Custom skills marketplace |
| M5.3 | Vault federation (cross-agent knowledge sharing) |
| M5.4 | Enterprise tier (dedicated nodes, priority models) |
| M5.5 | Mobile Oracle (responsive panel + Telegram fallback) |
| M5.6 | Agent reputation system (quality of collaboration) |

---

## 17. Resolved Decisions

Все архитектурные вопросы закрыты:

| # | Decision | Resolution | Rationale |
|---|----------|------------|-----------|
| D1 | PicoClaw = separate framework? | **No — lightweight OpenClaw config** | Reuse existing platform, reduce maintenance |
| D2 | Telegram: per-user bot or shared? | **Shared bot @GyberOracle_bot** (MVP) | Simpler, no BotFather automation needed |
| D3 | Secrets storage | **HashiCorp Vault OSS** | Industry standard, K8s integration, audit logs |
| D4 | K8s topology | **Single master + user worker nodes** | Simpler than federation, manageable at <1000 nodes |
| D5 | MemberStatus verification | **On-chain from UnitManager.sol** | Source of truth, no centralized override |
| D6 | Default AI model for PicoClaw | **Qwen3-coder free (OpenRouter)** | Zero cost, decent quality, user can add own keys |
| D7 | Server provisioning flow | **OAuth auto-create (fully automated)** | Безопасная автоматизация: OAuth → Cloud API → DevOps Agent. Пользователь не касается серверов вручную |
| D8 | Data on destroy | **IPFS (mandatory, encrypted) + GitHub private repo (optional)** | Данные в IPFS зашифрованы ключом кошелька. Только владелец может расшифровать. GitHub как опциональный mirror |
| D9 | Agent communication | **Social network of agents (libp2p P2P)** | Все агенты общаются как соцсеть. Пользователь контролирует приватность. SmartOracle = coordinator, не gateway |
| D10 | Community nodes funding | **Adaptive: community org → GBR treasury → DUNA** | Зависит от стадии развития эксперимента. Система стабилизируется до полной автономности |
| D11 | Max agents per community node | **~8 agents** (Hetzner CAX21: 4vCPU, 8GB) | €0.69/agent/mo — устойчивая модель |
| D12 | Web chat in DSP | **Yes — Oracle Panel slides from right in Unit Profile** | Прогрессивный интерфейс: chat + skills + vault + agent network. Революционный UX |
| D13 | PicoClaw vault storage | **GitHub private repo** (like SmartOracle) | Consistent with existing pattern, auto-sync via vault-sync.sh |
| D14 | Key rotation trigger | **Automated CronJob** (90 days) | Zero human intervention, DevOps Agent executes |

---

## Appendix A: File Structure

```
ORACLE/
├── PRD-ORACLE-DSP-INTEGRATION.md          ← this document
├── GYBERNATY_ECOSYSTEM_AGENT.md           ← SmartOracle init prompt
├── openclaw-k8s/                          ← current SmartOracle deployment
│   ├── helm/values.yaml
│   ├── k8s/
│   ├── scripts/
│   ├── workspace/
│   └── .github/workflows/
│
├── picoclaw/                              ← NEW: PicoClaw module
│   ├── helm/
│   │   ├── values-template.yaml.hbs       ← Handlebars template
│   │   └── values-community.yaml          ← Community tier override
│   ├── workspace-templates/               ← Workspace file generators
│   │   ├── USER.md.hbs
│   │   ├── IDENTITY.md.hbs
│   │   └── TOOLS.md.hbs
│   └── skills/                            ← Default PicoClaw skills
│       └── dsp-integration/SKILL.md
│
├── devops-agent/                          ← NEW: DevOps Agent
│   ├── SKILL.md                           ← OpenClaw skill definition
│   ├── playbooks/
│   │   ├── harden-server.yml
│   │   ├── join-cluster.yml
│   │   ├── deploy-picoclaw.yml
│   │   ├── rotate-keys.yml
│   │   └── decommission.yml
│   └── templates/
│       ├── namespace.yaml.j2
│       ├── networkpolicy.yaml.j2
│       ├── resourcequota.yaml.j2
│       └── rbac.yaml.j2
│
├── vault-config/                          ← NEW: HashiCorp Vault
│   ├── policies/
│   │   ├── smartoracle.hcl
│   │   ├── devops-agent.hcl
│   │   └── unit-readonly.hcl
│   └── k8s/
│       ├── vault-deployment.yaml
│       └── vault-injector.yaml
│
└── monitoring/                            ← NEW: Observability
    ├── prometheus/
    │   └── oracle-rules.yaml
    ├── grafana/
    │   ├── fleet-overview.json
    │   └── agent-detail.json
    └── alertmanager/
        └── oracle-alerts.yaml
```

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **SmartOracle** | System-level AI orchestrator (@SmartOracle_bot), manages all Unit Oracles |
| **PicoClaw** | Lightweight OpenClaw instance for individual Unit participants |
| **Unit** | Any registered participant of DSP with a wallet and profile |
| **Unit Oracle** | PicoClaw instance belonging to a specific Unit |
| **DevOps Agent** | Specialized SmartOracle sub-agent for infrastructure automation |
| **Init Oracle** | Process of creating a personal PicoClaw for a Unit |
| **Community Tier** | Free PicoClaw on shared infrastructure for Dev+ members |
| **Self-Hosted Tier** | PicoClaw on user's own cloud server |
| **MemberStatus** | On-chain role from UnitManager.sol (None→Unit→Dev→LeadDev→ArchDev) |
| **Vault** | HashiCorp Vault for secrets management (SSH keys, API tokens) |
| **Knowledge Vault** | Obsidian-based personal knowledge base in PicoClaw workspace |

---

## Appendix C: New DSP Components Map

```
src/features/UnitProfile/ui/
├── InitOracle/
│   ├── InitOracle.tsx              — Main Init Oracle button + flow
│   ├── ProviderSelect.tsx          — DO/GCP OAuth selection
│   ├── ProvisioningProgress.tsx    — SSE streaming progress UI
│   ├── PaymentWarning.tsx          — Server responsibility notice
│   └── RequirementChecklist.tsx    — Profile completeness check
│
├── OracleDashboard/
│   ├── OracleDashboard.tsx         — Post-init dashboard
│   ├── StatusIndicator.tsx         — Agent health display
│   ├── ServerInfo.tsx              — Provider/region/cost info
│   └── OracleSettings.tsx          — API keys, skills, Telegram
│
└── OraclePanel/
    ├── OraclePanel.tsx             — Slide-in panel container
    ├── OracleChatView.tsx          — WebSocket chat interface
    ├── OracleSkillsView.tsx        — Installed skills management
    ├── OracleVaultBrowser.tsx      — Knowledge vault explorer
    └── OracleNetworkView.tsx       — Agent social network + privacy

src/shared/types/
├── oracle.ts                       — Oracle types (OracleStatus, etc.)
└── oracle-privacy.ts               — Privacy settings types

src/shared/hooks/
├── useOracle.ts                    — Oracle status + actions hook
├── useOracleChat.ts                — WebSocket chat hook
└── useOracleNetwork.ts             — Agent discovery hook

src/shared/lib/
└── oracle-ipfs.ts                  — IPFS encryption/storage
```

---

> **Status**: All decisions resolved. PRD v1.1 approved for implementation.
> **Next Steps:**
> 1. Begin Phase 1: GPROD Oracle Module + Ansible playbooks
> 2. Security review by Oracle Security Team before any production deployment
> 3. Phase 2 parallel: Oracle Panel UI components in DSP
