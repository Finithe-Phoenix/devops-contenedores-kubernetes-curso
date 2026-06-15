# build-image.ps1 - Construye la imagen Docker de la app (Windows, SIN bash/WSL).
# Uso:  pwsh scripts/build-image.ps1 [tag]     (default tag: 1.0.0)
#   o:  clic derecho sobre el archivo -> "Ejecutar con PowerShell"
# Funciona desde cualquier carpeta.
param([string]$Tag = "1.0.0")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot          # raiz del repo (scripts/ esta un nivel abajo)
$ctx  = Join-Path $root "01-app\node"

Write-Host "Construyendo academia-devops-app:$Tag ..." -ForegroundColor Cyan
docker build -t "academia-devops-app:$Tag" $ctx
Write-Host "OK: imagen academia-devops-app:$Tag construida." -ForegroundColor Green
docker images | Select-String "academia-devops-app"
