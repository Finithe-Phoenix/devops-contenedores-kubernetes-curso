#!/usr/bin/env bash
# Borra el clúster local de kind.
# Uso:  bash scripts/delete-kind-cluster.sh [nombre]
set -euo pipefail
CLUSTER="${1:-devops-course}"

echo "🗑️  Borrando clúster kind '$CLUSTER'..."
kind delete cluster --name "$CLUSTER"
echo "✅ Clúster eliminado."
