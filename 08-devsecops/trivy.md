> 🌐 [English](trivy.en.md) · **Español**

# 🛡️ Lab 4 — DevSecOps con Trivy

> **Misión:** escanear la imagen e interpretar los hallazgos. **Recompensa:** +90 XP y la medalla 🛡️ *Guardián Shift-Left*.

## ¿Qué es "shift-left"?

Mover la seguridad **a la izquierda** = revisarla **temprano** (en el código y el pipeline),
no al final cuando ya está en producción. Cuesta menos y rompe menos.

```
  CÓDIGO ──► BUILD ──► IMAGEN ──► DEPLOY ──► PRODUCCIÓN
    ▲          ▲          ▲
    └──────────┴──────────┘  ← aquí queremos encontrar los problemas (shift-left)
```

## Instalar Trivy

```bash
# macOS
brew install trivy
# Windows (winget) / Linux: ver https://trivy.dev
```

## Escanear la imagen

```bash
# Reporte legible
trivy image academia-devops-app:1.0.0

# Solo lo grave (lo que de verdad importa primero)
trivy image --severity CRITICAL,HIGH academia-devops-app:1.0.0

# Solo vulnerabilidades con parche disponible (accionables)
trivy image --ignore-unfixed --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

## Cómo leer el reporte

| Columna | Qué te dice |
| ------- | ----------- |
| **Library** | El paquete vulnerable |
| **Vulnerability** | El identificador (CVE-AAAA-NNNN) |
| **Severity** | CRITICAL / HIGH / MEDIUM / LOW |
| **Installed** | Versión que tienes |
| **Fixed in** | Versión que lo corrige (si existe) |

> 🎯 **Regla práctica:** prioriza **CRITICAL/HIGH** con **"Fixed in"** disponible. Eso se arregla actualizando.

## Otros escaneos de Trivy (bonus)

```bash
trivy fs 01-app/node              # escanea dependencias del código (no la imagen)
trivy config 05-kubernetes/       # revisa malas configuraciones en los YAML de k8s
trivy image --scanners secret academia-devops-app:1.0.0   # busca secretos filtrados
```

## El reto de la misión

1. Escanea `academia-devops-app:1.0.0` (imagen buena).
2. Construye y escanea la **insegura**: `docker build -f 02-docker/Dockerfile.insecure -t academia-app:inseguro 01-app/node` y compara.
3. Detecta el **secreto quemado** (`DB_PASSWORD`) con `--scanners secret`.

## Lo que Trivy SÍ y NO hace

- ✅ Detecta CVEs conocidos, secretos en texto plano, malas configs.
- ❌ NO entiende la **lógica** de tu negocio ni si una vuln es explotable en TU caso.
  → Eso necesita **criterio humano**. La herramienta acelera; no reemplaza al ingeniero.
