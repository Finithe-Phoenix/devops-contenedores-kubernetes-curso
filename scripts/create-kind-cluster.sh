#!/usr/bin/env bash
# Crea un clúster local de Kubernetes con kind.
# Uso:  bash scripts/create-kind-cluster.sh [nombre]
set -euo pipefail
CLUSTER="${1:-devops-course}"

echo "🚢 Creando clúster kind '$CLUSTER'..."
kind create cluster --name "$CLUSTER"

echo "🔎 Información del clúster:"
kubectl cluster-info --context "kind-$CLUSTER"
kubectl get nodes
echo "✅ Clúster '$CLUSTER' listo."
