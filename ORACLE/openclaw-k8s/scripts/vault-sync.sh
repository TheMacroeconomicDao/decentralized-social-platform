#!/bin/sh
# vault-sync.sh — Commit & push vault changes to gybernaty-vault GitHub repo
# Usage: vault-sync.sh [commit message]
# Called by Oracle bot after writing research notes

set -eu

VAULT_DIR="/home/openclaw/.openclaw/workspace/vault"
VAULT_REMOTE="https://github.com/TheMacroeconomicDao/gybernaty-vault.git"
COMMIT_MSG="${1:-"chore: vault update $(date '+%Y-%m-%d %H:%M')"}"

if [ -z "${BOT_GITHUB_TOKEN:-}" ]; then
  echo "ERROR: BOT_GITHUB_TOKEN not set" >&2
  exit 1
fi

cd "$VAULT_DIR"

# Initialize git if needed
if [ ! -d ".git" ]; then
  git init -b main
  git remote add origin "$VAULT_REMOTE"
  git config user.email "oracle@gyber.org"
  git config user.name "Oracle (SmartOracle Bot)"
  echo "Git initialized in vault"
fi

# Configure credential helper — token never stored in .git/config
git config credential.helper \
  '!f() { echo "username=x-access-token"; echo "password='"$BOT_GITHUB_TOKEN"'"; }; f'

# Set clean remote URL (no token embedded)
git remote set-url origin "$VAULT_REMOTE"

# Pull latest (ignore errors on empty remote)
git pull origin main --rebase 2>/dev/null || true

# Stage all changes
git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo "No vault changes to sync"
  exit 0
fi

# Commit and push
git commit -m "$COMMIT_MSG"
git push -u origin main

echo "Vault synced: $COMMIT_MSG"
