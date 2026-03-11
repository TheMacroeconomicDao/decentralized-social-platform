#!/bin/bash

# Файл для сбора данных
OUTPUT_FILE="configx_master.txt"

# Очистка файла, если он уже существует
> "$OUTPUT_FILE"

# Функция для добавления заголовка секции
add_section() {
  echo "=== $1 ===" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
}

# 1. Конфигурация сервиса K3S
add_section "K3S Service Configuration"
systemctl cat k3s >> "$OUTPUT_FILE"

# 2. Версия K3S
add_section "K3S Version"
k3s --version >> "$OUTPUT_FILE"

# 3. Конфигурационный файл /etc/rancher/k3s/config.yaml
add_section "K3S Config File"
if [ -f /etc/rancher/k3s/config.yaml ]; then
  cat /etc/rancher/k3s/config.yaml >> "$OUTPUT_FILE"
else
  echo "Config file not found" >> "$OUTPUT_FILE"
fi

# 4. Kubeconfig /etc/rancher/k3s/k3s.yaml
add_section "Kubeconfig"
if [ -f /etc/rancher/k3s/k3s.yaml ]; then
  cat /etc/rancher/k3s/k3s.yaml >> "$OUTPUT_FILE"
else
  echo "Kubeconfig file not found" >> "$OUTPUT_FILE"
fi

# 5. Kubernetes кластерные ресурсы
add_section "Cluster Resources"
k3s kubectl api-resources --verbs=list --namespaced=false -o name | xargs -n 1 k3s kubectl get --show-kind --ignore-not-found -o yaml >> "$OUTPUT_FILE"

# 6. Kubernetes namespaced ресурсы
add_section "Namespaced Resources"
k3s kubectl api-resources --verbs=list --namespaced -o name | xargs -n 1 k3s kubectl get --show-kind --ignore-not-found -A -o yaml >> "$OUTPUT_FILE"

# 7. Сетевые настройки
add_section "Network Settings"
k3s kubectl get pods -n kube-system | grep flannel >> "$OUTPUT_FILE"
k3s kubectl get pods -n kube-system | grep coredns >> "$OUTPUT_FILE"
k3s kubectl get configmap -n kube-system coredns -o yaml >> "$OUTPUT_FILE"

# 8. Хранилища
add_section "Storage"
k3s kubectl get storageclass -o yaml >> "$OUTPUT_FILE"
k3s kubectl get pv -o yaml >> "$OUTPUT_FILE"
k3s kubectl get pvc --all-namespaces -o yaml >> "$OUTPUT_FILE"

# 9. Дополнительные файлы
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

echo "Сбор данных с мастер-ноды завершен. Результат сохранен в $OUTPUT_FILE"