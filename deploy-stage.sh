#!/bin/bash

# DSP Stage Deployment Script

set -e

echo "🚀 Starting DSP Stage deployment..."

# Build Docker image
echo "📦 Building Docker image..."
sudo docker build -t dsp-stage:latest .

# Apply Kubernetes manifests
echo "☸️  Applying Kubernetes manifests..."
kubectl apply -f k8s/stage/

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s

# Get service status
echo "📊 Getting service status..."
kubectl get pods -l app=dsp-stage,environment=stage
kubectl get service dsp-stage-service
kubectl get ingress dsp-stage-ingress

echo "✅ DSP Stage deployment completed!"
echo "🌐 Application should be available at: https://stage.dsp.build.infra.gyber.org" 