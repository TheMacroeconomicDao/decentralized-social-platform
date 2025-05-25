# Gybernaty DSP (Decentralized Social Platform)

🚀 **Next.js + k3s + GitHub Actions (Stage & Prod)**

## Environments
| Branch | URL | CI Job |
|--------|-----|--------|
| `stage` | https://stage.dsp.build.infra.gyber.org | Stage CD |
| `main`  | https://gyber.org | Prod CD (manual approval) |

## Local Quick-Start
```bash
pnpm install          # или npm/yarn
pnpm dev              # http://localhost:3000
```

## Docker
```bash
docker build -t dsp:local .
docker run -p 3000:3000 dsp:local
```

## Infrastructure Sketch
```
k8s/
 ├─ cluster/          # Cluster-scope: ClusterIssuer, Istio TLS Cert
 ├─ addons/           # CronJobs: cleanup-old-rs, cert-monitor
 └─ overlays/
     ├─ stage/        # Traefik Ingress + Deployment/Service
     └─ prod/         # Istio Gateway / VirtualService + Canary + Deployment/Service
```

All manifests are applied via **Kustomize overlays**:
```bash
kubectl apply -k k8s/overlays/<stage|prod>
```

### Canary Releases (Prod)
Flagger gradually shifts traffic (10 % → 50 % → 100 %) and rolls back on < 99 % success-rate or >500 ms p99 latency.

## CI / CD
| Reusable WF | Purpose |
|-------------|---------|
| `_build-image.yml` | Build, cache, push image ➜ GHCR & verify tag with `skopeo` |
| `_deploy.yml`      | `kubectl apply -k …`, `kubectl set image`, `kubectl rollout status`, optional Flagger wait |

**Stage CD**
1. Trigger: push to `stage`.
2. Build image `dsp-stage:stage-<sha>` + `latest`.
3. Deploy overlay `k8s/overlays/stage`.
4. Telegram notify success / failure.

**Prod CD**
1. Trigger: push to `main` (requires GitHub *environment* approval).
2. Build image `dsp-prod:main-<sha>` + `latest`.
3. Deploy overlay `k8s/overlays/prod` (includes Canary & addons & cluster resources).
4. Wait Flagger promotion (<=30 min).
5. Telegram notify.

Secrets required in repo:
```
GHCR_USERNAME          # ghcr.io user/org
GHCR_TOKEN             # PAT (packages:write)
KUBE_CONFIG            # base64-encoded kubeconfig
TELEGRAM_BOT_TOKEN     # bot API token
TELEGRAM_CHAT_ID       # chat / group id
```

## Tech Stack
* Next.js · React · TypeScript
* Feature-Sliced Design
* Docker · GHCR
* k3s · Istio · Traefik · Flagger · cert-manager
* GitHub Actions

---
MIT License — Gybernaty Community

