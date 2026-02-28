# GYBERNATOMY — The Neural Core

## Deep Conceptual Architecture of the Gybernaty Internal Circle

The Gybernaty ecosystem operates on a **three-layer neural architecture** — a self-regulating system where information flows like biological neurons firing through synapses. At the heart of this system lies the **Internal Circle** — the core infrastructure that powers every external product, every DeFi protocol, every AI agent, every wallet integration.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        THE GYBERNATOMY                                   │
│                  Neural Constellation Architecture                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         ╭──────────────╮                                │
│                         │    DDP       │                                │
│                         │  (IPFS)       │                                │
│                         │  Phase 2      │                                │
│                         ╰──────┬───────╯                                │
│                                │                                         │
│              ┌─────────────────┼─────────────────┐                      │
│              │                 │                 │                      │
│        ╭─────▼─────╮    ╭──────▼──────╮   ╭─────▼─────╮               │
│        │CONTRACTS │    │   GPROD     │   │  SUPABASE  │               │
│        │  (BSC)   │◄──►│  (Backend)  │◄─►│   (DB)     │               │
│        └─────┬─────┘    └──────┬──────╯   └─────┬─────┘               │
│              │                 │                 │                      │
│              └─────────────────┼─────────────────┘                      │
│                                │                                         │
│                         ╭──────▼──────╮                                 │
│                         │    DSP      │                                 │
│                         │ (Frontend)  │                                 │
│                         │  gyber.org  │                                 │
│                         ╰─────────────╯                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. THE CORE NERVE CENTER

### 1.1 DSP — The Sensory Cortex

**DSP (Decentralized Social Platform)** is not merely a frontend — it is the **sensory cortex** of the entire ecosystem. Like the human brain receiving signals from the outside world, DSP interprets user intentions and translates them into meaningful actions across the entire system.

**What DSP truly is:**

- **The Translator** — Converts human intent into machine-readable operations across all layers
- **The Observer** — Uses wagmi hooks to directly read blockchain state without intermediaries (view functions are free, no gas fees)
- **The Communicator** — Maintains Supabase Realtime subscriptions for instant updates when anyone in the ecosystem changes their profile, creates a project, or initiates a recovery
- **The AI Interface** — Where users interact with the Gybernaty AI Assistant (powered by Claude 3.7 Sonnet via Puter.js)

**Technical Reality:**

- **Next.js 15.3.2** with Feature-Sliced Design (FSD) — modular architecture where every component has explicit dependencies
- **wagmi + RainbowKit** — Wallet connection abstraction layer supporting 20+ chains
- **TanStack Query** — Intelligent caching layer that deduplicates requests and keeps UI in sync with blockchain
- **Framer Motion** — Animation system creating the "living" feel of the platform

**Why it matters:**

DSP is the **only public-facing interface**. Every external product (MAXIMUS, CAG-Chains, CantonFi, G-Wallet, SUMMUM) ultimately connects through DSP's identity system. Your wallet address is your universal key — one identity across 14 projects.

---

### 1.2 GPROD — The Processing Brain

**GPROD (Gybernaty Production)** is the **processing brain** — the neural center that handles everything too complex or sensitive for the frontend to manage directly. It is a NestJS monorepo containing the middleware logic that bridges off-chain and on-chain worlds.

**What GPROD truly is:**

- **The Gatekeeper** — Verifies every wallet connection via SIWE (Sign-In with Ethereum) signatures
- **The Activity Signer** — Holds a secure private key that signs EIP-712 activity proofs, proving to the blockchain that a user was actually active (not just holding tokens)
- **The Event Indexer** — Continuously listens to blockchain events (MemberApplied, MemberApproved, RewardsClaimed) and updates Supabase in real-time
- **The Recovery Orchestrator** — Coordinates the entire social recovery flow: initiating requests, verifying guarantor votes, executing on-chain changes
- **The AI Proxy** — Routes AI requests (OpenAI, Claude) through rate-limited endpoints with usage tracking

**Technical Reality:**

- **NestJS** — Enterprise-grade backend framework with dependency injection, making it testable and maintainable
- **Supabase Admin SDK** — Bypasses Row Level Security for privileged operations
- **Ethers.js / Viem** — Blockchain interaction libraries for reading events and constructing transactions
- **gRPC** — High-performance internal communication between microservices
- **Redis** — Caching layer for frequently accessed data

**Architecture Pattern:**

```
GPROD receives request
        │
        ▼
┌───────────────────┐
│  Auth Middleware  │ ◄── Validates JWT, checks auth level
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Business Logic   │ ◄── Routes to appropriate module
└────────┬──────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Web3   │ │Data   │ ◄── GPROD connects to:
│Module │ │Module │     - BSC (blockchain)
└───┬───┘ └───┬───┘     - Supabase (database)
    │         │         - Redis (cache)
    ▼         ▼         - External AI APIs
  BSC    Supabase
```

**Why it matters:**

GPROD is the **trust layer**. It ensures that when a user submits an activity proof, the signature is valid. When a recovery request needs execution, GPROD coordinates the guarantees. When blockchain events occur, GPROD ensures Supabase stays synchronized.

---

### 1.3 SUPABASE — The Hippocampus

**Supabase** is not just a database — it is the **hippocampus** of the system, the memory layer that stores all contextual information, session data, and cached on-chain state.

**What Supabase truly is:**

- **The Memory Bank** — Stores user profiles, preferences, activity history, project metadata — everything needed for quick retrieval
- **The Session Manager** — Handles JWT refresh tokens, tracks active sessions, enforces Row Level Security (RLS)
- **The Event Buffer** — Caches blockchain events before they're processed by the indexer (acts as a buffer for 800+ events)
- **The Real-time Bus** — Uses WebSockets to push updates instantly: when someone's profile changes, when a recovery request is submitted, when a new project appears

**Technical Reality:**

- **PostgreSQL** — Enterprise-grade relational database with full SQL capabilities
- **Row Level Security** — Fine-grained access control: users can only modify their own data, but anyone can read public profiles
- **Auth** — Email/password authentication plus custom Web3 provider for wallet-based login
- **Storage** — File bucket for avatars and uploaded content
- **Realtime** — PostgreSQL CDC (Change Data Capture) streaming to WebSocket clients

**Schema Core:**

```sql
-- Users: The unified identity record
users: wallet_address, unitname, email, avatar, bio, preferences, 
       member_status (cached from blockchain), gbr_balance (cached)

-- Activity Log: Proof of work
activity_log: user_id, activity_type, metadata, timestamp

-- Recovery: Social recovery orchestration  
recovery_requests: old_address, new_address, guarantors[], status

-- Projects: Ecosystem projects
projects: title, description, owner_id, status, metadata
```

**Why it matters:**

Supabase provides the **operational speed** that blockchain cannot. Reading from a smart contract costs gas and takes seconds. Reading from Supabase is instantaneous. GPROD keeps Supabase synchronized with blockchain, giving users the best of both worlds: blockchain-verified truth + database speed.

---

## 2. THE CHAIN LAYER

### 2.1 CONTRACTS — The Spinal Cord

**Smart Contracts on BSC (Binance Smart Chain)** form the **spinal cord** — the immutable backbone that carries all critical governance decisions and token transfers.

**What CONTRACTS truly is:**

- **The Source of Truth** — Membership status, rewards, voting power — all verified on-chain. No one can falsify this data.
- **The Governance Engine** — Proposals, votes, status upgrades — all executed through smart contracts
- **The Vault** — Holds GBR tokens, handles transfers, staking, and reward claims

**Contract Suite:**

| Contract | Purpose |
|----------|---------|
| `UnitManager.sol` | Core membership logic: applications, approvals, status changes, recovery execution |
| `GBRtoken.sol` | ERC-20 utility token with transfer, approval, delegation |
| `GBRVotingWrapper.sol` | Wraps GBR into voting power (wGBR) for governance |
| `UnitManagerGovernor.sol` | DAO governance: proposals, voting, timelocks |
| `UnitManagerDAO.sol` | UUPS proxy pattern for upgradeable governance |

**The MemberStatus Hierarchy:**

```
0: None     ──── Not a member (guest)
1: Unit     ──── Basic member (1 week inactivity → None)
2: Dev      ──── Developer (1 week → Unit, 2 weeks → None)
3: LeadDev  ──── Lead Developer (1 week → Dev)
4: ArchDev  ──── Architect (1 week → LeadDev)
5: GybernatyCore ──── The founding scientists (NEVER degrades)
```

**Why it matters:**

The blockchain is **inviolable**. Even if Supabase crashes, even if GPROD goes down, even if DSP is hacked — the smart contracts preserve the truth. Your membership, your voting power, your rewards — all cryptographically secured.

---

### 2.2 DDP — The Future Neural Pathway

**DDP (Decentralized Data Platform) on IPFS** represents Phase 2 — the **future neural pathway** that will enable true decentralization of user data.

**What DDP will be:**

- **The Permanent Archive** — Content stored on IPFS with ContentRegistry contracts tracking CID-to-owner mappings
- **The Privacy Layer** — End-to-end encryption for files and messages, with ACL (Access Control List) contracts
- **The P2P Transport** — Direct wallet-to-wallet messaging without central servers

**Technical Stack:**

- **Helia** — JavaScript IPFS implementation for browser and Node.js
- **Kubo** — Go-based IPFS node for pinning services
- **Pinata / web3.storage** — Third-party pinning for data persistence
- **ContentRegistry Contract** — Tracks who owns which content CID
- **ACL Contract** — Manages encrypted access keys

**Migration Plan (Phase 2):**

```
Phase 1 (Current):          Phase 2 (Future):
─────────────────           ─────────────────
Supabase: profiles         Supabase: search index + cache
Supabase: files            IPFS + ACL: actual files
Supabase: messages         DDP + E2E: encrypted messages
Blockchain: on-chain       Blockchain: on-chain + content registry
```

**Why it matters:**

DDP represents the **evolution toward full decentralization**. When complete, Gybernaty will operate without central points of failure — true Web3 infrastructure.

---

## 3. THE DATA FLOW

### 3.1 Authentication Flow (Wallet → System)

```
1. User connects wallet in DSP (RainbowKit)
   │
2. DSP generates SIWE message:
   "Sign this message to authenticate with Gybernaty.
    Address: 0xABC...
    Nonce: 12345
    Timestamp: 1700000000"
   │
3. User signs in wallet (MetaMask, Rabin, etc.)
   │
4. DSP → POST /auth/web3-login to GPROD
   Body: { message, signature, address }
   │
5. GPROD verifies signature
   │
6. GPROD reads blockchain: UnitManager.members(address)
   │
7. GPROD finds/creates user in Supabase
   │
8. GPROD returns JWT with:
   {
     sub: user.id,
     unitname: "alice",
     authLevel: "wallet",
     walletAddress: "0xABC...",
     memberStatus: 2  // from blockchain
   }
   │
9. DSP stores JWT, user is authenticated
```

### 3.2 Activity Proof Flow (Earning Rewards)

```
1. User performs activities:
   - commits code
   - votes on proposals
   - creates content
   - submits tasks
   │
2. GPROD logs activity in Supabase:
   activity_log INSERT { user_id, activity_type, metadata }
   │
3. Weekly (or on-demand):
   User → POST /activity/proof to GPROD
   │
4. GPROD:
   a) Queries activity_log for period
   b) Calculates total activity score
   c) Signs EIP-712 structure with ActivitySigner key
   d) Returns { signature, timestamp, activityScore }
   │
5. User (via DSP):
   → UnitManager.submitActivityProof(signature, timestamp)
   │
6. Contract verifies:
   a) Signature from authorized signer
   b) Updates lastActiveTimestamp
   c) Prevents degradation for active members
   │
7. Later (claimRewards):
   Contract calculates: (roleReward × weeksActive) / 4
   Transfers GBR to wallet
   │
8. GPROD indexer:
   Listens to RewardsClaimed event
   Updates Supabase users.gbr_balance
```

### 3.3 Social Recovery Flow (Lost Wallet)

```
Phase 1: Initiation
───────────────────
User (with old wallet accessible via email/password)
  → Logs into DSP (authLevel: password)
  → Sees "Wallet 0xOLD - Inaccessible ⚠️"
  → Clicks "Replace Main Wallet"
  → Connects NEW wallet
  → Signs SIWE: "I request recovery to 0xNEW"
  → DSP → POST /recovery/initiate
  
GPROD:
  → Verifies password auth
  → Creates RecoveryRequest in Supabase
  → Sets status: "voting"
  → Required: 3 guarantors (members with status > user.status)
  → Realtime notifies community

Phase 2: Voting
────────────────
3 senior members see notification
Each → POST /recovery/approve/{requestId}
GPROD verifies:
  • guarantor.status > requester.status
  • guarantor not already a guarantor
  
Once 3 approvals:
  → status: "approved"
  → timelock_until: now() + 48 hours

Phase 3: Timelock
─────────────────
48-hour security window:
  • Old wallet can cancel (if found)
  • Governor can veto (if suspicious)
  
Phase 4: Execution
──────────────────
After 48 hours:
  User (or GPROD) → UnitManager.executeRecovery(requestId)
  
Contract:
  • Copies Member struct: members[old] → members[new]
  • Transfers pendingRewards to new address
  • Nullifies old address
  • Emits RecoveryExecuted event

GPROD indexer:
  • Updates users.wallet_address
  • Sets recovery_requests.status: "executed"
```

---

## 4. THE SECURITY MODEL

### 4.1 Two-Level Authentication

| Level | Method | Capabilities |
|-------|--------|--------------|
| **Level 1** | Email + Password | View profiles, edit bio, read content, AI chat, initiate recovery |
| **Level 2** | Wallet + SIWE | Everything in Level 1 + blockchain transactions, voting, claiming rewards |

### 4.2 Defense Layers

```
┌─────────────────────────────────────────────┐
│            GYBERNATY SECURITY                │
├─────────────────────────────────────────────┤
│                                             │
│  Layer 1: User Device                       │
│  ───────────────────────                    │
│  • Wallet private key (hardware wallet      │
│    recommended)                             │
│  • Browser localStorage (session only)      │
│                                             │
│  Layer 2: DSP (Frontend)                    │
│  ───────────────────────                    │
│  • JWT in memory (not localStorage)        │
│  • HTTPS only                               │
│  • Input sanitization                       │
│                                             │
│  Layer 3: GPROD (Backend)                   │
│  ───────────────────────                    │
│  • JWT validation on every request         │
│  • Rate limiting                            │
│  • Activity Signer key in secure vault     │
│  • No database credentials in code          │
│                                             │
│  Layer 4: Supabase                          │
│  ───────────────────────                    │
│  • Row Level Security (RLS)                │
│  • No service_role in frontend code         │
│  • Anonymized analytics                     │
│                                             │
│  Layer 5: Blockchain                        │
│  ───────────────────────                    │
│  • Smart contract validation                │
│  • Multi-sig for admin operations          │
│  • Timelock for governance                  │
│  • Social recovery as last resort            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5. THE ECOSYSTEM NERVES

### 5.1 How External Products Connect

Every external project (MAXIMUS, CAG-Chains, CantonFi, G-Wallet, SUMMUM, etc.) connects to the core through specific **neural pathways**:

| External Product | Connection Type | Data Flow |
|------------------|----------------|-----------|
| **MAXIMUS** | DSP for identity, Supabase for content | User logs in via DSP auth → creates AI content → stored in Supabase |
| **CAG-Chains** | DSP for identity, GPROD for AI agent management | AI agents registered on blockchain via GPROD |
| **CantonFi** | DSP + GPROD for DeFi operations | Lending/borrowing via GPROD → contracts on BSC |
| **G-Wallet** | DSP for onboarding, LQD for key management | Wallet connects to DSP ecosystem |
| **SUMMUM** | Future: DDP integration | Private blockchain → IPFS → DSP |

### 5.2 The Dependency Graph

```
                    ┌─────────────┐
                    │  DDP        │  (Phase 2)
                    │  IPFS       │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │CONTRACTS│◄────►│  GPROD    │◄───►│ SUPABASE  │
    │  BSC    │      │  Backend  │     │   DB      │
    └────┬────┘      └─────┬─────┘     └─────┬─────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    ┌──────▼──────┐
                    │    DSP      │
                    │  Frontend   │
                    │ gyber.org   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │MAXIMUS  │      │ CAG-Chains│     │ CantonFi │
    │(AI)     │      │(AI Assets)│     │(DeFi)    │
    └─────────┘      └───────────┘     └───────────┘
    
    ┌─────────┐    ┌───────────┐    ┌───────────┐
    │G-Wallet │    │SUMMUM     │    │ Aura      │
    │(Wallet) │    │(Blockchain)│    │Domus     │
    └─────────┘    └───────────┘    └───────────┘
```

---

## 6. THE LIVING SYSTEM

The Gybernaty internal circle is not static infrastructure — it is a **living, breathing system** that:

1. **Self-Heals** — If Supabase goes down, blockchain preserves truth. If blockchain is slow, Supabase provides cached speed.

2. **Scales Organically** — New products plug into existing neural pathways rather than building parallel systems.

3. **Evolves** — Phase 2 (DDP/IPFS) will add permanent, decentralized storage without breaking existing architecture.

4. **Rewards Participation** — Activity proofs prevent inactivity degradation. Rewards flow to those who contribute.

5. **Protects Members** — Social recovery ensures no one loses access permanently. The community acts as a safety net.

---

## Summary: The Gybernatomy

| Component | Biological Analogy | Function |
|-----------|-------------------|----------|
| **DSP** | Sensory Cortex | User interface, intent translation |
| **GPROD** | Processing Brain | Authentication, indexing, orchestration |
| **SUPABASE** | Hippocampus | Memory, sessions, cached state |
| **CONTRACTS** | Spinal Cord | Immutable truth, governance, rewards |
| **DDP** | Neural Pathways (future) | Permanent storage, P2P communication |

Together, these five components form the **Gybernatomy** — a decentralized nervous system where trust is cryptographic, governance is democratic, and recovery is social.
