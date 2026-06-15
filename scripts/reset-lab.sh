#!/usr/bin/env bash
# Reinicia el laboratorio: borra el namespace y el contenedor local de la app.
# (No borra el clúster; para eso usa delete-kind-cluster.sh)
# Uso:  bash scripts/reset-lab.sh
set -uo pipefail

echo "🧹 Borrando namespace 'academia'..."
kubectl delete namespace academia --ignore-not-found

echo "🧹 Borrando contenedor local 'academia' (si existe)..."
docker rm -f academia 2>/dev/null || true

echo "✅ Laboratorio reiniciado. Listo para empezar limpio."
