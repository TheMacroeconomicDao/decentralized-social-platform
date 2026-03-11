---
tags: [security, audit, cicd, kubernetes, secrets]
created: 2026-03-09
source: analysis
status: remediated
---

# Security Audit — openclaw-k8s — 2026-03-09

## Executive Summary

Full security audit of the `TheMacroeconomicDao/openclaw-k8s` repository conducted 2026-03-09.
System: OpenClaw v2026.3.2 on K3s, deployed via GitHub Actions.

**Total findings:** 28 (CRITICAL: 4, HIGH: 9, MEDIUM: 10, LOW: 5)
**Remediated in session:** 12 (all CRITICAL + 4 HIGH + 4 MEDIUM + 1 LOW)

---

## 🔴 CRITICAL Findings

### SEC-2026-03-09-001: `extract-secrets.yml` dumps all API keys to CI logs
- **File:** `.github/workflows/extract-secrets.yml`
- **Description:** Workflow designed to "extract and save pod secrets" literally printed `.env` file contents — including Anthropic, Telegram, OpenRouter, Deepgram API keys — to GitHub Actions logs visible to all repo collaborators.
- **Impact:** Full credential compromise for all integrated services.
- **Fix:** File deleted. ✅ **FIXED**

### SEC-2026-03-09-002: BOT_GITHUB_TOKEN embedded in git remote URL
- **File:** `.github/workflows/deploy.yml:162`, `scripts/vault-sync.sh:9`
- **Description:** `https://x-access-token:${TOKEN}@github.com/...` stored the GitHub token in `.git/config` on the pod PVC — persisted across restarts, readable by any process with file access.
- **Impact:** Token exfiltration from PVC compromise.
- **Fix:** Replaced with `git config credential.helper '!f() { echo password=$BOT_GITHUB_TOKEN; }; f'` — token sourced from env at use time, never stored. ✅ **FIXED**

### SEC-2026-03-09-003: Command injection in `install-skills.yml`
- **File:** `.github/workflows/install-skills.yml:28`
- **Description:** `for SKILL in ${{ github.event.inputs.skills }}` — GitHub expression interpolated directly into shell. Attacker with workflow_dispatch access could execute arbitrary commands on the pod.
- **Impact:** Remote code execution on K8s pod.
- **Fix:** Input moved to `env: SKILLS_INPUT: ${{ ... }}`, validated against `^[a-zA-Z0-9/_@:. -]+$`. ✅ **FIXED**

### SEC-2026-03-09-004: Command injection in `pair.yml`
- **File:** `.github/workflows/pair.yml:35`
- **Description:** `openclaw pairing approve telegram ${{ github.event.inputs.pairing_code }}` — pairing code directly in shell, allows shell metacharacter injection.
- **Impact:** Remote code execution via malformed pairing code.
- **Fix:** Input moved to `env: PAIRING_CODE`, validated against `^[a-zA-Z0-9_-]+$`. ✅ **FIXED**

---

## 🟠 HIGH Findings

### SEC-2026-03-09-005: PyNaCl shell injection in `persist-secret.sh`
- **File:** `scripts/persist-secret.sh:46-49`
- **Description:** `b'$PUB_KEY'` and `b'$VALUE'` interpolated shell variables directly into Python string literals. Values containing `'` or `\` break the string and can inject arbitrary Python.
- **Fix:** Variables passed via `os.environ`, Python reads from environment. ✅ **FIXED**

### SEC-2026-03-09-006: No `permissions:` blocks in workflows
- **Files:** All 5 `.github/workflows/*.yml`
- **Description:** Absence of `permissions:` means GITHUB_TOKEN has default permissions (varies by repo settings, can be `contents: write` or worse).
- **Fix:** Added `permissions: contents: read` to all workflows. ✅ **FIXED**

### SEC-2026-03-09-007: `/tmp/secret-values.yaml` never deleted
- **File:** `.github/workflows/deploy.yml:64`
- **Description:** Helm values file with all API keys written to hardcoded `/tmp/secret-values.yaml` with no cleanup — persists for the lifetime of the runner.
- **Fix:** `mktemp` + `trap "rm -f $SECRET_FILE" EXIT`. ✅ **FIXED**

### SEC-2026-03-09-008: Unpinned GitHub Actions (`@v4` tags)
- **Files:** All workflows — `actions/checkout@v4`, `azure/setup-kubectl@v4`, `azure/setup-helm@v4`
- **Description:** Tag-pinned actions can be silently updated (or a tag can be moved to point to malicious code). SHA pinning guarantees immutability.
- **Status:** ⚠️ **OPEN** — requires looking up current SHA for each action
- **Fix:** Pin to commit SHA: `actions/checkout@{SHA}`, etc.
- **Recommended action:** Create GitHub Issue #SEC-008

### SEC-2026-03-09-009: `dangerouslyAllowHostHeaderOriginFallback: true`
- **File:** `helm/values.yaml`
- **Description:** Disables Host header validation on the control UI — opens SSRF/CSRF attack surface.
- **Status:** ⚠️ **OPEN** — required for current LAN setup without proper ingress
- **Mitigation:** Add `allowedOrigins` list to restrict to known hostnames
- **Fix:** Configure proper ingress with TLS and set explicit `allowedOrigins`

### SEC-2026-03-09-010: `groupPolicy: "open"` — any Telegram group can add bot
- **File:** `helm/values.yaml`
- **Description:** Any Telegram group that adds the bot can interact with it, potentially exposing research data and R&D context.
- **Status:** ⚠️ **OPEN**
- **Fix:** Change to `groupPolicy: "allowlist"` with explicit group IDs

---

## 🟡 MEDIUM Findings (top items)

### SEC-2026-03-09-011: IDENTITY.md check logic inverted (always overwrites)
- **Fix:** Changed to `test -f` existence check. ✅ **FIXED**

### SEC-2026-03-09-012: POD lookup without `--field-selector=status.phase=Running`
- **Fix:** Added to all `kubectl get pod` calls. ✅ **FIXED**

### SEC-2026-03-09-013: No kubeconfig cleanup on failure
- **Fix:** Added `if: always()` cleanup step to all workflows. ✅ **FIXED**

### SEC-2026-03-09-014: Missing `set -u -o pipefail` in shell scripts
- **Fix:** Added to `vault-sync.sh`. `persist-secret.sh` uses `set -euo pipefail`. ✅ **FIXED**

---

## 🟢 LOW / INFO

### SEC-2026-03-09-015: No PodDisruptionBudget
- **Status:** Cannot set via current Helm chart — document as architecture recommendation.

### SEC-2026-03-09-016: No PVC backup strategy
- **Status:** Recommend Velero or periodic `kubectl cp` snapshot to object storage.

---

## Remediation Summary

| ID | Description | Severity | Status |
|---|---|---|---|
| SEC-001 | extract-secrets.yml deleted | CRITICAL | ✅ Fixed |
| SEC-002 | Token removed from git URL | CRITICAL | ✅ Fixed |
| SEC-003 | Injection in install-skills.yml | CRITICAL | ✅ Fixed |
| SEC-004 | Injection in pair.yml | CRITICAL | ✅ Fixed |
| SEC-005 | PyNaCl injection | HIGH | ✅ Fixed |
| SEC-006 | No permissions blocks | HIGH | ✅ Fixed |
| SEC-007 | /tmp secret cleanup | HIGH | ✅ Fixed |
| SEC-008 | Unpinned actions | HIGH | ⚠️ Open |
| SEC-009 | dangerouslyAllow... | HIGH | ⚠️ Open |
| SEC-010 | groupPolicy open | HIGH | ⚠️ Open |
| SEC-011 | IDENTITY.md logic | MEDIUM | ✅ Fixed |
| SEC-012 | POD lookup selector | MEDIUM | ✅ Fixed |
| SEC-013 | kubeconfig cleanup | MEDIUM | ✅ Fixed |
| SEC-014 | set -u pipefail | MEDIUM | ✅ Fixed |
| SEC-015 | No PDB | LOW | ⚠️ Accepted |
| SEC-016 | No PVC backup | LOW | ⚠️ Open |

## Next Actions

1. Pin GitHub Actions to SHA hashes (SEC-008) — create GitHub Issue
2. Implement `groupPolicy: "allowlist"` with Telegram group IDs (SEC-010)
3. Set up proper ingress with TLS to remove `dangerouslyAllowHostHeaderOriginFallback` (SEC-009)
4. Configure Velero or PVC backup strategy (SEC-016)

## Security Team Architecture Deployed

Following this audit, a permanent security monitoring team was deployed as OpenClaw skills:
- `security_audit` — CodeGuard: full static analysis
- `secrets_scan` — SecretsWatchdog: credential hygiene
- `cicd_guard` — CICDGuardian: workflow security
- `infra_sentinel` — InfraSentinel: K8s posture
- `vuln_report` — VulnReporter: findings consolidation

Weekly automated audits configured via HEARTBEAT.md.
