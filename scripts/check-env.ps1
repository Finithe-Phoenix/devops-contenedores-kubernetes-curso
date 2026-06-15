# check-env.ps1 - Lab 0: valida el ambiente del curso (Windows, SIN bash).
# Uso:  pwsh scripts/check-env.ps1
Write-Host ""
Write-Host "== Lab 0 - Validacion de ambiente ==" -ForegroundColor Cyan
Write-Host ""
Write-Host "Imprescindibles (dias 1 y 2):"
foreach ($t in @("git","docker","node","npm")) {
  if (Get-Command $t -ErrorAction SilentlyContinue) { Write-Host ("  [OK] " + $t) -ForegroundColor Green }
  else { Write-Host ("  [  ] " + $t + "  (no encontrado)") -ForegroundColor DarkGray }
}
Write-Host ""
Write-Host "Para los dias 3 y 4 (Kubernetes):"
foreach ($t in @("kubectl","helm","kind")) {
  if (Get-Command $t -ErrorAction SilentlyContinue) { Write-Host ("  [OK] " + $t) -ForegroundColor Green }
  else { Write-Host ("  [  ] " + $t + "  (no encontrado)") -ForegroundColor DarkGray }
}
Write-Host ""
docker info *> $null
if ($?) { Write-Host "  [OK] Docker daemon: CORRIENDO" -ForegroundColor Green }
else    { Write-Host "  [!]  Docker daemon: NO responde (abre Docker Desktop)" -ForegroundColor Yellow }
Write-Host ""
