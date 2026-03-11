#!/bin/bash
set -e

URL="${1:-https://api.dev.gprod.build.infra.gyber.org/api/v1/health}"
RETRIES="${2:-5}"
SLEEP="${3:-10}"

command -v jq >/dev/null 2>&1 || { echo >&2 "jq is required but not installed."; exit 1; }
command -v curl >/dev/null 2>&1 || { echo >&2 "curl is required but not installed."; exit 1; }

for i in $(seq 1 "$RETRIES"); do
  RESPONSE=$(curl -s -w '%{http_code}' -o /tmp/health.json "$URL" || echo "000")
  CODE=$(tail -c 3 <<< "$RESPONSE")
  BODY=$(head -c -3 <<< "$RESPONSE")
  STATUS=$(jq -r .status < /tmp/health.json 2>/dev/null || echo "parse_error")
  if [[ "$CODE" == "200" && "$STATUS" == "ok" ]]; then
    echo "$BODY"
    exit 0
  fi
  sleep "$SLEEP"
done

echo "Healthcheck failed: code=$CODE, status=$STATUS, body=$(cat /tmp/health.json)" >&2
exit 1 