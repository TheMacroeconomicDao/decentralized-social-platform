# DSP Stage Environment Deployment

## Overview
This directory contains Kubernetes manifests for deploying the DSP application to the stage environment.

## Domain
- **Stage URL**: https://stage.dsp.build.infra.gyber.org
- **Environment**: stage  
- **Cluster**: k3s

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
2. GitHub Actions workflow automatically builds and deploys

### Manual Deployment
```bash
# From project root
./deploy-stage.sh
```

## Kubernetes Resources
- **Deployment**: `dsp-stage-deployment` (2 replicas)
- **Service**: `dsp-stage-service` (ClusterIP)
- **Ingress**: `dsp-stage-ingress` (with TLS)

## Required Secrets (GitHub Actions)
- `K3S_HOST`: k3s cluster host
- `K3S_USERNAME`: SSH username for k3s cluster
- `K3S_SSH_KEY`: SSH private key for k3s cluster  
- `K3S_PORT`: SSH port (usually 22)

## Health Checks
- **Liveness Probe**: HTTP GET / on port 3000
- **Readiness Probe**: HTTP GET / on port 3000
- **Resources**: 256Mi-512Mi RAM, 250m-500m CPU

## Troubleshooting
```bash
# Check deployment status
kubectl get deployments -l environment=stage

# Check pods
kubectl get pods -l app=dsp-stage

# Check service
kubectl get service dsp-stage-service

# Check ingress
kubectl get ingress dsp-stage-ingress

# Check logs
kubectl logs -l app=dsp-stage --tail=50
``` 