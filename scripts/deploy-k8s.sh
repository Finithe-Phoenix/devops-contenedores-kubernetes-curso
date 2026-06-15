#!/usr/bin/env bash
# Despliega la app en el clúster kind: carga la imagen y aplica los manifiestos.
# Uso:  bash scripts/deploy-k8s.sh [nombre-cluster]   (default: devops-course)
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1   # funciona desde cualquier carpeta (se mueve a la raiz del repo)
CLUSTER="${1:-devops-course}"
IMAGE="academia-devops-app:1.0.0"

echo "📦 Cargando $IMAGE en el clúster '$CLUSTER'..."
kind load docker-image "$IMAGE" --name "$CLUSTER"

echo "📜 Aplicando manifiestos..."
kubectl apply -f 05-kubernetes/namespace.yaml
kubectl apply -f 05-kubernetes/configmap.yaml
kubectl apply -f 05-kubernetes/secret-example.yaml
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl apply -f 05-kubernetes/service.yaml

echo "⏳ Esperando el rollout..."
kubectl -n academia rollout status deployment/academia-app

echo "✅ Desplegado. Para probar:"
echo "   kubectl -n academia port-forward service/academia-app-service 8080:80"
echo "   curl http://localhost:8080/health"
