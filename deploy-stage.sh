#!/bin/bash

# DSP Stage Deployment Script

set -e

echo "🚀 Starting DSP Stage deployment..."

# Variables
REGISTRY="ghcr.io"
IMAGE_NAME="themacroeconomicdao/decentralized-social-platform/dsp-stage"
TAG="latest"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

# Check kubectl access
echo "☸️  Checking kubectl access..."
kubectl cluster-info --request-timeout=5s > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Error: Cannot connect to Kubernetes cluster"
    exit 1
fi

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t $FULL_IMAGE .

echo "📤 Pushing to GHCR..."
docker push $FULL_IMAGE

# Apply Kubernetes manifests
echo "☸️  Applying Kubernetes manifests..."
kubectl apply -f k8s/stage/

# Update deployment image
echo "🔄 Updating deployment image..."
kubectl set image deployment/dsp-stage-deployment dsp-stage=$FULL_IMAGE -n default

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/dsp-stage-deployment --timeout=300s

# Get service status
echo "📊 Getting service status..."
kubectl get pods -l app=dsp-stage,environment=stage -n default
kubectl get service dsp-stage-service -n default
kubectl get ingress dsp-stage-ingress -n default

echo "✅ DSP Stage deployment completed!"
echo "🌐 Application should be available at: https://stage.dsp.build.infra.gyber.org" 