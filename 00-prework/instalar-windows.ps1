# ============================================================================
#  instalar-windows.ps1  —  Instalador automatico del Curso DevOps (Windows)
#  Instala y configura TODO: WSL2 + Docker + Git + Node + kubectl + kind +
#  Helm + Trivy + VS Code, y clona el repo del curso.
#
#  COMO USARLO (el alumno):
#    1) Guarda este archivo.
#    2) Clic derecho sobre el archivo -> "Ejecutar con PowerShell"
#       (o abre PowerShell y corre:  powershell -ExecutionPolicy Bypass -File instalar-windows.ps1 )
#    3) Acepta el aviso de Administrador. Al terminar, REINICIA la PC.
# ============================================================================

# --- 0) Reabrir como Administrador si hace falta ---------------------------
$esAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $esAdmin) {
  Write-Host "Reabriendo como Administrador..." -ForegroundColor Yellow
  Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  exit
}

$ErrorActionPreference = "Continue"
function Titulo($t) { Write-Host ""; Write-Host "==== $t ====" -ForegroundColor Cyan }

Write-Host ""
Write-Host "  ##############################################" -ForegroundColor Cyan
Write-Host "  #   Instalador del Curso DevOps (Windows)    #" -ForegroundColor Cyan
Write-Host "  #   Docker + Kubernetes + herramientas       #" -ForegroundColor Cyan
Write-Host "  ##############################################" -ForegroundColor Cyan

# --- 1) Verificar winget ----------------------------------------------------
Titulo "1/5  Verificando winget (gestor de paquetes)"
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  Write-Host "  [X] winget no esta disponible." -ForegroundColor Red
  Write-Host "      Instala 'App Installer' desde Microsoft Store y vuelve a correr este script:"
  Write-Host "      https://apps.microsoft.com/detail/9NBLGGH4NNS1"
  Read-Host "  Presiona Enter para salir"
  exit 1
}
Write-Host "  [OK] winget disponible"

# --- 2) WSL2 (motor de Docker en Windows) -----------------------------------
Titulo "2/5  Activando WSL2 (necesario para Docker)"
$wslOk = $false
try { wsl.exe --status 2>$null | Out-Null; if ($LASTEXITCODE -eq 0) { $wslOk = $true } } catch {}
if ($wslOk) {
  Write-Host "  [OK] WSL ya esta instalado"
} else {
  Write-Host "  [..] Instalando WSL2 (puede tardar)..."
  wsl.exe --install --no-distribution 2>$null
  if ($LASTEXITCODE -ne 0) { wsl.exe --install 2>$null }   # fallback para Windows mas viejos
  $script:requiereReinicio = $true
  Write-Host "  [OK] WSL2 activado (se completara tras reiniciar)"
}

# --- 3) Instalar las herramientas del curso ---------------------------------
Titulo "3/5  Instalando herramientas (Docker, Git, Node, k8s, Helm, Trivy, VS Code)"
$tools = @(
  @{ id = "Git.Git";                    name = "Git" },
  @{ id = "OpenJS.NodeJS.LTS";          name = "Node.js LTS" },
  @{ id = "Docker.DockerDesktop";       name = "Docker Desktop" },
  @{ id = "Microsoft.VisualStudioCode"; name = "VS Code" },
  @{ id = "Kubernetes.kubectl";         name = "kubectl" },
  @{ id = "Kubernetes.kind";            name = "kind" },
  @{ id = "Helm.Helm";                  name = "Helm" },
  @{ id = "AquaSecurity.Trivy";         name = "Trivy" }
)
foreach ($t in $tools) {
  Write-Host ("  [..] {0,-16} " -f $t.name) -NoNewline
  winget install --id $t.id -e --source winget --accept-source-agreements --accept-package-agreements --silent 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Host "instalado" -ForegroundColor Green }
  else                     { Write-Host "ya estaba / procesado" -ForegroundColor DarkGray }
}

# --- 4) Clonar el repositorio del curso -------------------------------------
Titulo "4/5  Descargando el material del curso"
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
$destino = Join-Path $env:USERPROFILE "Documents\devops-curso"
if (Test-Path $destino) {
  Write-Host "  [OK] Ya existe en: $destino"
} elseif (Get-Command git -ErrorAction SilentlyContinue) {
  git clone https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso.git "$destino" 2>$null
  if (Test-Path $destino) { Write-Host "  [OK] Repo clonado en: $destino" -ForegroundColor Green }
  else { Write-Host "  [!] No se pudo clonar (reinicia y prueba 'git clone' manual)." -ForegroundColor Yellow }
} else {
  Write-Host "  [!] git aun no esta en el PATH; clona el repo despues de reiniciar." -ForegroundColor Yellow
}

# --- 5) Verificacion --------------------------------------------------------
Titulo "5/5  Verificacion"
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
foreach ($c in @("git","node","npm","docker","kubectl","kind","helm","trivy","code")) {
  $cmd = Get-Command $c -ErrorAction SilentlyContinue
  if ($cmd) { Write-Host ("  [OK] {0}" -f $c) -ForegroundColor Green }
  else      { Write-Host ("  [ ] {0}  (estara disponible tras reiniciar)" -f $c) -ForegroundColor DarkGray }
}

# --- Cierre -----------------------------------------------------------------
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "   INSTALACION TERMINADA" -ForegroundColor Cyan
Write-Host "   1) REINICIA la computadora." -ForegroundColor Yellow
Write-Host "   2) Abre 'Docker Desktop' y espera la ballena."
Write-Host "   3) Material del curso en: $destino"
Write-Host "   4) Valida todo:  cd '$destino'  ;  bash scripts/check-env.sh"
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "  Presiona Enter para cerrar"
