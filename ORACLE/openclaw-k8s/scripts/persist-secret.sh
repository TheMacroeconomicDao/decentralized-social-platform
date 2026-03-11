#!/bin/bash
# persist-secret KEY VALUE
# Saves a secret to:
#   1. Local .env (immediate effect)
#   2. GitHub Secrets (survives redeployment)

set -euo pipefail

KEY="$1"
VALUE="$2"

if [[ -z "$KEY" || -z "$VALUE" ]]; then
  echo "Usage: persist-secret KEY VALUE"
  exit 1
fi

# Validate key name — only allow safe env var names
if ! echo "$KEY" | grep -qE '^[A-Z][A-Z0-9_]*$'; then
  echo "[persist-secret] ✗ Invalid key name: $KEY" >&2
  exit 1
fi

ENV_FILE="/home/openclaw/.openclaw/.env"
REPO="TheMacroeconomicDao/openclaw-k8s"

# --- Layer 1: write to local .env ---
touch "$ENV_FILE"
TMPFILE=$(mktemp)
trap "rm -f $TMPFILE" EXIT
grep -v "^${KEY}=" "$ENV_FILE" > "$TMPFILE" || true
echo "${KEY}=${VALUE}" >> "$TMPFILE"
mv "$TMPFILE" "$ENV_FILE"
echo "[persist-secret] ✓ Saved to local .env"

# --- Layer 2: write to GitHub Secrets ---
if [[ -z "${BOT_GITHUB_TOKEN:-}" ]]; then
  echo "[persist-secret] ✗ BOT_GITHUB_TOKEN not set, skipping GitHub Secrets"
  exit 0
fi

# Get repo public key for secret encryption
KEY_DATA=$(curl -s -H "Authorization: token $BOT_GITHUB_TOKEN" \
  "https://api.github.com/repos/${REPO}/actions/secrets/public-key")
KEY_ID=$(echo "$KEY_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['key_id'])")
PUB_KEY=$(echo "$KEY_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['key'])")

# Encrypt secret value using libsodium (PyNaCl)
# Values passed via environment — never interpolated into Python string literals
ENCRYPTED=$(PUB_KEY="$PUB_KEY" SECRET_VALUE="$VALUE" python3 - << 'PYEOF'
import base64, os
from nacl import encoding, public

pub_key_bytes = base64.b64decode(os.environ['PUB_KEY'])
sealed_box = public.SealedBox(public.PublicKey(pub_key_bytes))
encrypted = sealed_box.encrypt(os.environ['SECRET_VALUE'].encode())
print(base64.b64encode(encrypted).decode())
PYEOF
)

if [[ -z "$ENCRYPTED" ]]; then
  echo "[persist-secret] ✗ Encryption failed (PyNaCl not available)"
  exit 0
fi

# Set GitHub Secret
PAYLOAD=$(python3 -c "
import json, os
print(json.dumps({'encrypted_value': os.environ['ENCRYPTED'], 'key_id': os.environ['KEY_ID']}))
" )

HTTP_STATUS=$(ENCRYPTED="$ENCRYPTED" KEY_ID="$KEY_ID" \
  python3 -c "
import json, os, urllib.request

payload = json.dumps({
  'encrypted_value': os.environ['ENCRYPTED'],
  'key_id': os.environ['KEY_ID']
}).encode()

repo = os.environ['REPO']
key_name = os.environ['SECRET_KEY']
token = os.environ['BOT_GITHUB_TOKEN']
url = f'https://api.github.com/repos/{repo}/actions/secrets/{key_name}'

req = urllib.request.Request(url, data=payload, method='PUT')
req.add_header('Authorization', f'token {token}')
req.add_header('Content-Type', 'application/json')
try:
    with urllib.request.urlopen(req) as r:
        print(r.status)
except urllib.error.HTTPError as e:
    print(e.code)
" REPO="$REPO" SECRET_KEY="$KEY")

if [[ "$HTTP_STATUS" == "201" || "$HTTP_STATUS" == "204" ]]; then
  echo "[persist-secret] ✓ Saved to GitHub Secrets (HTTP $HTTP_STATUS)"
else
  echo "[persist-secret] ✗ GitHub Secrets failed (HTTP $HTTP_STATUS)"
fi
