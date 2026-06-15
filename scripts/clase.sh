#!/usr/bin/env bash
# clase.sh — Enciende TODO para tu clase con un solo comando (Linux / macOS / WSL).
# Uso (desde la raíz del repo):  bash scripts/clase.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
COMPOSE="03-compose/docker-compose.yml"

echo ""
echo "  Encendiendo la Academia DevOps..."

# 1) Docker
if ! docker info >/dev/null 2>&1; then
  echo "  [X] Docker no responde. Abre Docker Desktop / inicia el daemon y reintenta."
  exit 1
fi
echo "  [OK] Docker corriendo"

# 2) Imágenes base pre-descargadas
echo "  [..] Pre-descargando imágenes base (node, postgres)..."
docker pull -q node:22-alpine    >/dev/null 2>&1 || true
docker pull -q postgres:16-alpine >/dev/null 2>&1 || true

# 3) Levantar app + base de datos
echo "  [..] Levantando app + PostgreSQL..."
docker compose -f "$COMPOSE" up -d --build --force-recreate >/dev/null 2>&1

# 4) Esperar a la app
echo "  [..] Esperando a que la app responda..."
ok=0
for i in $(seq 1 30); do
  if curl -s http://localhost:8080/health 2>/dev/null | grep -q '"db":"ok"'; then ok=1; break; fi
  sleep 2
done
[ "$ok" -eq 1 ] && echo "  [OK] App lista." || echo "  [!] La app tardó. Revisa: docker compose -f $COMPOSE logs app"

# 5) Abrir el navegador (si hay entorno gráfico)
command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:8080/ >/dev/null 2>&1 || true
command -v open      >/dev/null 2>&1 && open http://localhost:8080/      >/dev/null 2>&1 || true

echo ""
echo "  ============================================"
echo "   LISTO PARA LA CLASE"
echo "   Centro de Mando : http://localhost:8080/"
echo "   Estado (/health): http://localhost:8080/health"
echo "   Apagar al final : docker compose -f $COMPOSE down"
echo "  ============================================"
echo ""
