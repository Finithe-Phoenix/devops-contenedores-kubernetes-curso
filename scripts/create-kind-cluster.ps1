# create-kind-cluster.ps1 - Crea un cluster local con kind (Windows, SIN bash).
# Uso:  pwsh scripts/create-kind-cluster.ps1 [nombre]   (default: devops-course)
param([string]$Cluster = "devops-course")
$ErrorActionPreference = "Stop"
Write-Host "Creando cluster kind '$Cluster'..." -ForegroundColor Cyan
kind create cluster --name $Cluster
kubectl cluster-info --context "kind-$Cluster"
kubectl get nodes
Write-Host "OK: cluster '$Cluster' listo." -ForegroundColor Green
