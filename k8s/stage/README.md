# DSP Stage Environment Deployment

## Overview
This directory contains Kubernetes manifests for deploying the DSP application to the stage environment using best practices with GHCR and direct kubectl access.

## Domain
- **Stage URL**: https://stage.dsp.gyber.org
- **Environment**: stage  
- **Cluster**: k3s (31.129.105.180:6443)

## Container Registry
- **Registry**: GitHub Container Registry (GHCR)
- **Image**: `ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage`
- **Tags**: `latest`, `stage-{commit-sha}`

## DNS Configuration
```
stage.dsp.build.infra.gyber.org
A     31.129.105.180
MX    20 mx2.beget.com.
MX    10 mx1.beget.com.
TXT   v=spf1 redirect=beget.com
```

## Deployment Process

### Automatic Deployment (GitHub Actions)
1. Push changes to `stage` branch
2. GitHub Actions workflow:
   - Builds Docker image
   - Pushes to GHCR
   - Updates Kubernetes deployment via kubectl
   - Sends Telegram notification

### Manual Deployment
```bash
# From project root (requires Docker login to GHCR)
docker login ghcr.io -u <username> -p <token>
./deploy-stage.sh
```

## Kubernetes Resources
- **Deployment**: `dsp-stage-deployment` (2 replicas)
- **Service**: `dsp-stage-service` (ClusterIP)
- **Ingress**: `dsp-stage-ingress` (with TLS)

## Required GitHub Secrets

### Container Registry
- `GHCR_USERNAME`: GitHub username
- `GHCR_TOKEN`: GitHub Personal Access Token with packages:write scope

### Kubernetes Access
- `KUBE_CONFIG`: Base64 encoded kubeconfig file content

### Notifications
- `TELEGRAM_BOT_TOKEN`: Telegram bot token for notifications
- `TELEGRAM_CHAT_ID`: Telegram chat ID for notifications

## Setting up GHCR Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create token with `packages:write` scope
3. Login to GHCR: `docker login ghcr.io -u <username> -p <token>`

## Setting up KUBE_CONFIG Secret
```bash
# Get base64 encoded kubeconfig
kubectl config view --raw | base64 | tr -d '\n'
```

## Health Checks
- **Liveness Probe**: HTTP GET / on port 3000 (30s delay, 10s interval)
- **Readiness Probe**: HTTP GET / on port 3000 (5s delay, 5s interval)
- **Resources**: 256Mi-512Mi RAM, 250m-500m CPU

## Troubleshooting
```bash
# Check deployment status
kubectl get deployments -l environment=stage -n default

# Check pods
kubectl get pods -l app=dsp-stage -n default

# Check service
kubectl get service dsp-stage-service -n default

# Check ingress
kubectl get ingress dsp-stage-ingress -n default

# Check logs
kubectl logs -l app=dsp-stage --tail=50 -n default

# Manual image update
kubectl set image deployment/dsp-stage-deployment dsp-stage=ghcr.io/themacroeconomicdao/decentralized-social-platform/dsp-stage:latest -n default
```

## Security Features
- **Image Pull Policy**: Always (ensures latest image)
- **GHCR Authentication**: Secure token-based access
- **Kubernetes RBAC**: Direct API access via kubeconfig
- **TLS Termination**: Automatic certificates via Let's Encrypt
- **Network Policies**: Pod-to-pod communication restrictions

## Security Features
- **Image Pull Policy**: Always (ensures latest image)
- **GHCR Authentication**: Secure token-based access
- **Kubernetes RBAC**: Direct API access via kubeconfig
- **TLS Termination**: Automatic certificates via Let's Encrypt
- **Network Policies**: Pod-to-pod communication restrictions 