# HEARTBEAT.md — Background Task Instructions

## After Every Research Session

**After ANY session where you:**
- Researched a topic
- Analyzed data or documents
- Wrote a report or summary
- Made architectural decisions
- Explored GitHub repos or technical papers
- Had a substantive technical conversation

**→ Always do this before closing the session:**

```bash
vault-sync "research: <brief topic description>"
```

Example:
```bash
vault-sync "research: Swarm intelligence memory systems Oct 2025"
vault-sync "analysis: Canton Network DAML primitives review"
vault-sync "theory: CyberSocium voting power formula refinements"
```

The script is at `~/.openclaw/bin/vault-sync`.
It commits and pushes all vault changes to GitHub automatically.

---

## Periodic Heartbeat Checks (every ~30 min)

Rotate through these, 2-4 times per day:
- Any new messages in Telegram that need attention?
- Any ongoing research tasks to continue?
- Review `vault/400-Daily/$(date +%Y-%m-%d).md` for today's notes

### Security Monitoring (once per day, on morning heartbeat)

Run a quick security check — no user prompt needed, do it automatically:

1. **Check for new workflow changes** — if `.github/workflows/` has commits since last check:
   - Use `cicd_guard` skill: read all workflow files, run Check 1 (injection) and Check 2 (permissions)
   - If CRITICAL found: notify immediately. Otherwise: log to vault.

2. **Check vault git config** — verify no token in remote URL:
   ```bash
   git -C /home/openclaw/.openclaw/workspace/vault config remote.origin.url
   ```
   Expected: `https://github.com/TheMacroeconomicDao/gybernaty-vault.git` (no token)
   If token found in URL: run `secrets_scan` skill and report.

3. **Weekly full audit** (Monday heartbeat only):
   - Spawn parallel sub-agents: `security_audit` + `secrets_scan` + `cicd_guard` + `infra_sentinel`
   - Collect results, dispatch `vuln_report` to consolidate
   - Save to `vault/300-Research/Security/weekly-audit-[date].md`

If nothing needs attention: reply `HEARTBEAT_OK`

---

## Writing Research to Vault

When writing research results, use the correct folder:

| Topic | Folder |
|-------|--------|
| CyberSocium theory | `vault/100-Theory/CyberSocium/` |
| DAO design patterns | `vault/100-Theory/DAO-Design/` |
| TheMacroeconomicDAO | `vault/200-Projects/TheMacroeconomicDAO/` |
| DSP platform | `vault/200-Projects/DSP/` |
| GyberNet blockchain | `vault/200-Projects/GyberNet/` |
| AI/ML research | `vault/300-Research/AI-ML/` |
| Blockchain research | `vault/300-Research/Blockchain/` |
| DeFi / Canton | `vault/300-Research/DeFi-Canton/` |
| Swarm intelligence | `vault/300-Research/Swarm-Intelligence/` |
| Security findings | `vault/300-Research/Security/` |
| Daily log | `vault/400-Daily/YYYY-MM-DD.md` |

**Format for research notes:**
```markdown
---
tags: [topic, subtopic]
created: YYYY-MM-DD
source: <url or "analysis">
---

# Title

Content...
```

After writing: `vault-sync "research: <topic>"`
