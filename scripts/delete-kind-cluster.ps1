# delete-kind-cluster.ps1 - Borra el cluster local de kind (Windows, SIN bash).
# Uso:  pwsh scripts/delete-kind-cluster.ps1 [nombre]   (default: devops-course)
param([string]$Cluster = "devops-course")
Write-Host "Borrando cluster kind '$Cluster'..." -ForegroundColor Cyan
kind delete cluster --name $Cluster
Write-Host "OK: cluster eliminado." -ForegroundColor Green
