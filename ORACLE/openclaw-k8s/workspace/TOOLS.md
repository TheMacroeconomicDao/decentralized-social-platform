# TOOLS.md — Infrastructure & API Reference

## AI Models Available

| Alias | Model | Use Case | Cost |
|-------|-------|----------|------|
| `sonnet` (default) | anthropic/claude-sonnet-4-6 | General R&D, coding, analysis | Paid |
| `opus` | anthropic/claude-opus-4-6 | Deep theoretical analysis, complex reasoning | Paid (expensive) |
| `qwen` / `free` | openrouter/qwen/qwen3-coder:free | Quick tasks, drafts, cost savings | FREE (480B) |
| `fast` | openrouter/qwen/qwen3-4b:free | Trivial tasks, tests | FREE (4B) |
| `vision` | openrouter/qwen/qwen3-vl-235b-a22b-thinking | Image analysis, screenshots | FREE (235B) |

**Switch model in chat:** tell me "use opus" or "switch to qwen" or "use fast model"

**When to use Opus:** CyberSocium theory review, complex DAO mechanism design,
formal proofs, deep architecture decisions. Worth the cost.

**When to use Qwen:** Quick lookups, drafts, summarization, code snippets,
any task where speed and cost matter more than depth.

---

## Voice Transcription

- **Provider:** Deepgram nova-3
- **Language:** Russian (ru)
- **Usage:** Send voice message in Telegram → auto-transcribed

---

## Browser Automation

- **Chromium** sidecar available for full web browsing
- Can: search web, scrape pages, fill forms, take screenshots, interact with web apps
- Use for: researching papers, checking GitHub, reading docs, monitoring sites

---

## GitHub Access (BOT_GITHUB_TOKEN)

The bot has a GitHub token with access to `TheMacroeconomicDao/openclaw-k8s`.
For accessing other Gybernaty repos, the `gh` CLI may be available.

**What the bot can do:**
- Read/write files in repos with access
- Create/update GitHub Secrets via API
- Trigger GitHub Actions workflows

---

## Knowledge Base (Obsidian Vault)

Location on PVC: `~/workspace/vault/`

Structure:
```
vault/
├── 000-Overview/          # Project overview, MOC (Maps of Content)
├── 100-Theory/
│   ├── CyberSocium/       # Cybersocial economics research
│   └── DAO-Design/        # DAO governance mechanisms
├── 200-Projects/
│   ├── TheMacroeconomicDAO/
│   ├── DSP/               # Decentralized Social Platform
│   ├── GyberNet/          # Custom blockchain
│   ├── AiC/               # AI+Blockchain division
│   └── SUMMUM/            # Canton Network + TEE
├── 300-Research/
│   ├── AI-ML/             # AI/ML research notes
│   ├── Blockchain/        # Blockchain research
│   ├── DeFi-Canton/       # Canton Network / DeFi
│   └── Swarm-Intelligence/
├── 400-Daily/             # Daily notes (YYYY-MM-DD.md)
└── 500-Archive/           # Completed/archived
```

**To write research results:** Create/update markdown files in the appropriate vault folder.
**Format:** Standard Obsidian markdown with YAML frontmatter + wikilinks `[[note-name]]`

---

## Infrastructure

- **Cluster:** K3s Kubernetes
- **Namespace:** openclaw
- **Region:** Moscow timezone (Europe/Moscow)
- **PVC:** 5Gi persistent storage at `/home/openclaw/.openclaw/`
- **Bot:** @SmartOracle_bot (Telegram)

---

## Scheduled Tasks (Cron)

To add a cron job: `openclaw cron add --name "name" --cron "0 9 * * *" --message "..." --announce`

---

_Keep this file updated as new tools, APIs, and infrastructure are added._
