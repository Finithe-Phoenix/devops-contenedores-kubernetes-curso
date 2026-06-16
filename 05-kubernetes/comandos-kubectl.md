> 🌐 [English](comandos-kubectl.en.md) · **Español**

# ☸️ Lab 5-7 — Kubernetes: comandos esenciales

> **Misiones:** desplegar (Lab 5 ☸️), configurar (Lab 6 🔐), escalar y hacer rollback (Lab 7 📈).

> 🪟 **En Windows (PowerShell):** algunos comandos Unix cambian (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`, `head`→`Select-Object -First`). Ver la **[chuleta de PowerShell](../guias/windows-powershell.md)**.

## 0) Crear el clúster (kind) y cargar la imagen

```bash
# Desde la raíz del repo
bash scripts/create-kind-cluster.sh devops-course
bash scripts/build-image.sh 1.0.0
kind load docker-image academia-devops-app:1.0.0 --name devops-course
```

> 🪟 **Windows (PowerShell):** usa los `.ps1`: `pwsh scripts/create-kind-cluster.ps1 devops-course` y `pwsh scripts/build-image.ps1 1.0.0`. La línea `kind load ...` es idéntica.

> 🔑 **Clave en kind:** el clúster NO ve tu Docker local. Hay que **cargar** la imagen
> con `kind load docker-image`, o verás un `ImagePullBackOff`.

## 1) Desplegar (Lab 5 — ☸️ Timonel del Clúster)

```bash
kubectl apply -f 05-kubernetes/namespace.yaml
kubectl apply -f 05-kubernetes/configmap.yaml
kubectl apply -f 05-kubernetes/secret-example.yaml
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl apply -f 05-kubernetes/service.yaml

# (o todo de un jalón)
bash scripts/deploy-k8s.sh devops-course
```

> 🪟 **Windows (PowerShell):** `pwsh scripts/deploy-k8s.ps1 devops-course`

Validar:

```bash
kubectl -n academia get deployments,pods,svc
kubectl -n academia describe deployment academia-app
kubectl -n academia rollout status deployment/academia-app
```

Probar con port-forward:

```bash
kubectl -n academia port-forward service/academia-app-service 8080:80
# en otra terminal:
curl http://localhost:8080/health
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/health` (con `.exe`; en PowerShell `curl` es otro comando). O abre la URL en el navegador.

## 2) Configuración y secretos (Lab 6 — 🔐)

```bash
kubectl -n academia get configmap academia-config -o yaml
kubectl -n academia get secret academia-secret -o yaml

# Demostración: base64 NO es cifrado
kubectl -n academia get secret academia-secret -o jsonpath='{.data.DB_PASSWORD}' | base64 -d
```

## 3) Escalar, actualizar y rollback (Lab 7 — 📈)

```bash
# Escalar a 4 réplicas
kubectl -n academia scale deployment academia-app --replicas=4
kubectl -n academia get pods

# Actualizar a una nueva versión (rolling update)
kubectl -n academia set image deployment/academia-app academia-app=academia-devops-app:1.0.1
kubectl -n academia rollout status deployment/academia-app
kubectl -n academia rollout history deployment/academia-app

# Rollback a la versión anterior
kubectl -n academia rollout undo deployment/academia-app
```

> 💡 Para la v1.0.1: `bash scripts/build-image.sh 1.0.1` y `kind load docker-image academia-devops-app:1.0.1 --name devops-course`.

> 🪟 **Windows (PowerShell):** `pwsh scripts/build-image.ps1 1.0.1` (la línea `kind load ...` es idéntica).

## 4) Versión con probes + límites + seguridad (DevSecOps, día 4)

```bash
kubectl -n academia apply -f 05-kubernetes/deployment-with-probes.yaml
kubectl -n academia describe pod -l app=academia-app | grep -A5 -i liveness
```

> 🪟 **Windows (PowerShell):** `kubectl -n academia describe pod -l app=academia-app | Select-String -Context 0,5 liveness` (`Select-String` reemplaza a `grep`; `-Context 0,5` imita `-A5`).

## ❗ Troubleshooting

| Estado del Pod | Significado | Solución |
| -------------- | ----------- | -------- |
| `ImagePullBackOff` | No encuentra la imagen | `kind load docker-image ...` (imagen local no cargada) |
| `CrashLoopBackOff` | El contenedor arranca y muere | `kubectl logs <pod> -n academia` |
| `Pending` | No hay recursos / nodo | `kubectl describe pod <pod>` y revisa Events |
| `0/2 Ready` | El Pod no pasa la readiness | Revisa que `/health` responda 200 |
| Service no responde | Selector no coincide | Las labels del Pod deben igualar el `selector` del Service |

## Limpiar

```bash
bash scripts/reset-lab.sh                 # borra el namespace academia
bash scripts/delete-kind-cluster.sh devops-course
```

> 🪟 **Windows (PowerShell):** `pwsh scripts/reset-lab.ps1` y `pwsh scripts/delete-kind-cluster.ps1 devops-course`.
