# OpenClaw on Kubernetes

Personal AI assistant (OpenClaw) deployed on k3s cluster with Telegram + Claude Code subscription.

## Secrets required in GitHub repo

| Secret | Description |
|--------|-------------|
| `KUBECONFIG` | base64-encoded kubeconfig |
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather |
| `CLAUDE_SETUP_TOKEN` | From `claude setup-token` command |

## First deploy

1. Add all secrets to GitHub repo
2. Push to main → GitHub Actions deploys automatically
3. Approve Telegram pairing: `kubectl exec -n openclaw deploy/openclaw -- openclaw pairing approve telegram <CODE>`
