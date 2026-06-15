#!/usr/bin/env bash
# check-env.sh — Lab 0: valida que el ambiente del curso esté listo.
# Uso:  bash scripts/check-env.sh
set -u

ok=0
fail=0

check() {
  local nombre="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf '  ✅ %-22s %s\n' "$nombre" "$("$@" 2>&1 | head -1)"
    ok=$((ok + 1))
  else
    printf '  ❌ %-22s (no encontrado)\n' "$nombre"
    fail=$((fail + 1))
  fi
}

echo "================================================="
echo "  Lab 0 — Validación de ambiente (Misión 🧰)"
echo "================================================="
echo
echo "Imprescindibles:"
check "git"     git --version
check "docker"  docker --version
check "node"    node --version
check "npm"     npm --version
echo
echo "Para los días de Kubernetes:"
check "kubectl" kubectl version --client
check "helm"    helm version --short
check "kind"    kind --version
echo
echo "Opcionales (ruta Java):"
check "java"    java -version
check "maven"   mvn -version
echo
echo "-------------------------------------------------"
echo "  Listos: $ok    Faltantes: $fail"
echo "-------------------------------------------------"

# Comprobación extra: ¿el daemon de Docker responde?
if docker info >/dev/null 2>&1; then
  echo "  🐳 Docker daemon: CORRIENDO"
else
  echo "  ⚠️  Docker daemon: NO responde (abre Docker Desktop)"
fi

if [ "$fail" -eq 0 ]; then
  echo "  🎉 Ambiente completo. +30 XP — medalla 🧰 Kit Listo desbloqueada."
else
  echo "  📋 Revisa 00-prework/instalacion.md para instalar lo que falta."
fi
