#!/usr/bin/env bash
# Construye la imagen Docker de la app.
# Uso:  bash scripts/build-image.sh [tag]   (default: 1.0.0)
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1   # funciona desde cualquier carpeta (se mueve a la raiz del repo)
TAG="${1:-1.0.0}"

echo "🐳 Construyendo academia-devops-app:$TAG ..."
docker build -t "academia-devops-app:$TAG" 01-app/node
echo "✅ Imagen academia-devops-app:$TAG construida."
docker images | grep academia-devops-app || true
