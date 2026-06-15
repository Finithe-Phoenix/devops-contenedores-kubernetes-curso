# deploy-k8s.ps1 - Despliega la app en kind (Windows, SIN bash).
# Uso:  pwsh scripts/deploy-k8s.ps1 [nombre-cluster]   (default: devops-course)
param([string]$Cluster = "devops-course")
$ErrorActionPreference = "Stop"
$root  = Split-Path -Parent $PSScriptRoot
$IMAGE = "academia-devops-app:1.0.0"

Write-Host "Cargando $IMAGE en el cluster '$Cluster'..." -ForegroundColor Cyan
kind load docker-image $IMAGE --name $Cluster

Write-Host "Aplicando manifiestos..." -ForegroundColor Cyan
foreach ($f in @("namespace","configmap","secret-example","deployment","service")) {
  kubectl apply -f (Join-Path $root "05-kubernetes\$f.yaml")
}

Write-Host "Esperando el rollout..." -ForegroundColor Cyan
kubectl -n academia rollout status deployment/academia-app

Write-Host "OK: desplegado. Para probar:" -ForegroundColor Green
Write-Host "   kubectl -n academia port-forward service/academia-app-service 8080:80"
Write-Host "   curl http://localhost:8080/health"
