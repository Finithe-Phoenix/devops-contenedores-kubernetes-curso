# ============================================================================
#  instalar-windows.ps1  -  Instalador del Curso DevOps (Windows)
#  Instala y configura TODO: WSL2 + Docker + Git + Node + kubectl + kind +
#  Helm + Trivy + VS Code, clona el repo del curso y verifica.
#
#  COMO USARLO (el alumno):
#    Clic derecho sobre el archivo  ->  "Ejecutar con PowerShell"
#    (o:  powershell -ExecutionPolicy Bypass -File instalar-windows.ps1 )
#    Acepta el aviso de Administrador. Al terminar, REINICIA la PC.
# ============================================================================

# --- 0) Reabrir como Administrador si hace falta ---------------------------
$esAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $esAdmin) {
  Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  exit
}

$ErrorActionPreference = "Continue"
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}
$TOTAL = 5

# --- Helpers visuales -------------------------------------------------------
function Linea { Write-Host ("─" * 62) -ForegroundColor DarkCyan }
function Banner {
  Write-Host ""
  Linea
  Write-Host "   🚀  ACADEMIA DEVOPS  ·  Instalador de Clase (Windows)" -ForegroundColor Cyan
  Write-Host "       Docker · Kubernetes · CI/CD · DevSecOps · gamificado" -ForegroundColor DarkGray
  Linea
}
function Paso($n, $titulo) {
  Write-Host ""
  Write-Host ("▸ Paso {0}/{1} · {2}" -f $n, $TOTAL, $titulo) -ForegroundColor Cyan
  $w = 34; $fill = [int]($w * $n / $TOTAL)
  $bar = ("█" * $fill) + ("░" * ($w - $fill))
  Write-Host ("  [{0}] {1}%" -f $bar, [int](100 * $n / $TOTAL)) -ForegroundColor DarkCyan
}
function Ok($m)   { Write-Host ("    ✔ " + $m) -ForegroundColor Green }
function Info($m) { Write-Host ("    · " + $m) -ForegroundColor Gray }
function Warn($m) { Write-Host ("    ! " + $m) -ForegroundColor Yellow }
function Err($m)  { Write-Host ("    ✗ " + $m) -ForegroundColor Red }

Banner

# --- 1) winget --------------------------------------------------------------
Paso 1 "Verificando winget (gestor de paquetes)"
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  Err "winget no esta disponible en este Windows."
  Info "Instala 'App Installer' desde Microsoft Store y vuelve a correr el script:"
  Info "https://apps.microsoft.com/detail/9NBLGGH4NNS1"
  Read-Host "`n  Presiona Enter para salir"; exit 1
}
Ok "winget disponible"

# --- 2) WSL2 ----------------------------------------------------------------
Paso 2 "Activando WSL2 (motor de Docker en Windows)"
$wslOk = $false
try { wsl.exe --status 2>$null | Out-Null; if ($LASTEXITCODE -eq 0) { $wslOk = $true } } catch {}
if ($wslOk) {
  Ok "WSL ya esta instalado"
} else {
  Info "Instalando WSL2 (puede tardar)..."
  wsl.exe --install --no-distribution 2>$null
  if ($LASTEXITCODE -ne 0) { wsl.exe --install 2>$null }   # fallback Windows mas viejos
  wsl.exe --set-default-version 2 2>$null
  Ok "WSL2 activado (se completa tras reiniciar)"
}

# --- 3) Herramientas --------------------------------------------------------
Paso 3 "Instalando herramientas del curso"
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
  Write-Host ("    ⏳ {0,-16} instalando..." -f $t.name) -ForegroundColor DarkGray -NoNewline
  winget install --id $t.id -e --source winget --accept-source-agreements --accept-package-agreements --silent 2>$null | Out-Null
  Write-Host ("`r    ✔ {0,-16} listo            " -f $t.name) -ForegroundColor Green
}

# --- 4) Configurar + clonar el repo ----------------------------------------
Paso 4 "Configurando y descargando el material del curso"
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
if (Get-Command git -ErrorAction SilentlyContinue) {
  git config --global init.defaultBranch main 2>$null   # rama main por defecto
  Ok "git configurado (rama por defecto: main)"
}
$destino = Join-Path $env:USERPROFILE "Documents\devops-curso"
if (Test-Path $destino) {
  Ok "Material ya presente: $destino"
} elseif (Get-Command git -ErrorAction SilentlyContinue) {
  git clone https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso.git "$destino" 2>$null
  if (Test-Path $destino) { Ok "Repo clonado en: $destino" }
  else { Warn "No se pudo clonar; reinicia y prueba 'git clone' a mano." }
} else {
  Warn "git aun no esta en el PATH; clona el repo despues de reiniciar."
}

# --- 5) Verificacion --------------------------------------------------------
Paso 5 "Verificacion"
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
foreach ($c in @("git","node","npm","docker","kubectl","kind","helm","trivy","code")) {
  if (Get-Command $c -ErrorAction SilentlyContinue) { Ok $c }
  else { Info ("{0}  (estara disponible tras reiniciar)" -f $c) }
}

# --- Cierre -----------------------------------------------------------------
Write-Host ""
Linea
Write-Host "   ✅  INSTALACION TERMINADA — siguientes pasos:" -ForegroundColor Green
Write-Host ""
Write-Host "   1) " -NoNewline; Write-Host "REINICIA la computadora." -ForegroundColor Yellow
Write-Host "   2) Abre 'Docker Desktop' y espera la ballena 🐳."
Write-Host "   3) Material del curso:  $destino"
Write-Host "   4) Valida todo:  " -NoNewline; Write-Host "cd `"$destino`"  ;  bash scripts/check-env.sh" -ForegroundColor Cyan
Linea
Write-Host ""
Read-Host "  Presiona Enter para cerrar"
