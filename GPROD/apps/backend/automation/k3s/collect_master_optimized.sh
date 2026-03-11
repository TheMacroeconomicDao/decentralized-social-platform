#!/bin/bash
OUTPUT_FILE="/tmp/configx_master.txt"
> "$OUTPUT_FILE"
add_section() {
  echo "=== $1 ===" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
}
add_section "K3S Service Configuration"
systemctl cat k3s >> "$OUTPUT_FILE"
add_section "K3S Version"
k3s --version >> "$OUTPUT_FILE"
add_section "K3S Config File"
if [ -f /etc/rancher/k3s/config.yaml ]; then
  cat /etc/rancher/k3s/config.yaml >> "$OUTPUT_FILE"
else
  echo "Config file not found" >> "$OUTPUT_FILE"
fi
add_section "Kubeconfig"
if [ -f /etc/rancher/k3s/k3s.yaml ]; then
  cat /etc/rancher/k3s/k3s.yaml >> "$OUTPUT_FILE"
else
  echo "Kubeconfig file not found" >> "$OUTPUT_FILE"
fi
add_section "Namespaces"
k3s kubectl get namespaces -o yaml | grep -v "kube-system\\|kube-public\\|kube-node-lease" >> "$OUTPUT_FILE"
add_section "Custom Resources"
k3s kubectl get deployments,services,configmaps,secrets,ingresses --all-namespaces -o yaml | grep -v "namespace: kube-system" >> "$OUTPUT_FILE"
add_section "RBAC"
k3s kubectl get clusterroles,clusterrolebindings,roles,rolebindings --all-namespaces -o yaml | grep -v "namespace: kube-system" >> "$OUTPUT_FILE"
add_section "Network Settings"
k3s kubectl get pods -n kube-system | grep flannel >> "$OUTPUT_FILE"
k3s kubectl get pods -n kube-system | grep coredns >> "$OUTPUT_FILE"
k3s kubectl get configmap -n kube-system coredns -o yaml >> "$OUTPUT_FILE"
add_section "Storage"
k3s kubectl get storageclass -o yaml >> "$OUTPUT_FILE"
k3s kubectl get pvc --all-namespaces -o yaml >> "$OUTPUT_FILE"
add_section "Additional Files"
if [ -f k3s-dashboard.yaml ]; then
  cat k3s-dashboard.yaml >> "$OUTPUT_FILE"
else
  echo "k3s-dashboard.yaml not found" >> "$OUTPUT_FILE"
fi
if [ -f kubeconfig.yaml ]; then
  cat kubeconfig.yaml >> "$OUTPUT_FILE"
else
  echo "kubeconfig.yaml not found" >> "$OUTPUT_FILE"
fi
echo "Data collection completed. Result saved to $OUTPUT_FILE"
cat "$OUTPUT_FILE"