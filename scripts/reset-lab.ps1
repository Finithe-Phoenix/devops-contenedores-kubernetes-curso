# reset-lab.ps1 - Reinicia el laboratorio (Windows, SIN bash).
# Borra el namespace 'academia' y el contenedor local. No borra el cluster.
# Uso:  pwsh scripts/reset-lab.ps1
Write-Host "Borrando namespace 'academia'..." -ForegroundColor Cyan
kubectl delete namespace academia --ignore-not-found
Write-Host "Borrando contenedor local 'academia' (si existe)..." -ForegroundColor Cyan
docker rm -f academia 2>$null
Write-Host "OK: laboratorio reiniciado." -ForegroundColor Green
