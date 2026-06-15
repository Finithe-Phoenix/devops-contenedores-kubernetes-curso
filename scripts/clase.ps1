# clase.ps1 — Enciende TODO para tu clase con un solo comando (Windows / PowerShell).
# Uso (desde la raíz del repo):  pwsh scripts/clase.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root
$compose = "03-compose/docker-compose.yml"

Write-Host ""
Write-Host "  Encendiendo la Academia DevOps..." -ForegroundColor Cyan

# 1) Docker
try { docker info *> $null } catch {
  Write-Host "  [X] Docker no responde. Abre Docker Desktop, espera la ballena y reintenta." -ForegroundColor Red
  exit 1
}
Write-Host "  [OK] Docker corriendo"

# 2) Imagenes base pre-descargadas (sin esperas en clase)
Write-Host "  [..] Pre-descargando imagenes base (node, postgres)..."
docker pull -q node:22-alpine    *> $null
docker pull -q postgres:16-alpine *> $null

# 3) Levantar app + base de datos (force-recreate evita el contenedor viejo)
Write-Host "  [..] Levantando app + PostgreSQL..."
docker compose -f $compose up -d --build --force-recreate *> $null

# 4) Esperar a que la app este lista
Write-Host "  [..] Esperando a que la app responda..."
$ok = $false
for ($i = 0; $i -lt 30; $i++) {
  try { if ((Invoke-WebRequest -UseBasicParsing "http://localhost:8080/health" -TimeoutSec 2).Content -match '"db":"ok"') { $ok = $true; break } } catch {}
  Start-Sleep -Seconds 2
}
if ($ok) { Write-Host "  [OK] App lista." -ForegroundColor Green }
else { Write-Host "  [!] La app tardo. Revisa: docker compose -f $compose logs app" -ForegroundColor Yellow }

# 5) Abrir el Centro de Mando
Start-Process "http://localhost:8080/"

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "   LISTO PARA LA CLASE" -ForegroundColor Cyan
Write-Host "   Centro de Mando : http://localhost:8080/"
Write-Host "   Estado (/health): http://localhost:8080/health"
Write-Host "   Apagar al final : docker compose -f $compose down" -ForegroundColor DarkGray
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""
