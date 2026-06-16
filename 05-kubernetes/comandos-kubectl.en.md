> 🌐 **English** · [Español](comandos-kubectl.md)

# ☸️ Lab 5-7 — Kubernetes: essential commands

> **Missions:** deploy (Lab 5 ☸️), configure (Lab 6 🔐), scale and roll back (Lab 7 📈).

> 🪟 **On Windows (PowerShell):** some Unix commands change (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`, `head`→`Select-Object -First`). See the **[PowerShell cheat sheet](../guias/windows-powershell.en.md)**.

## 0) Create the cluster (kind) and load the image

```bash
# From the repo root
bash scripts/create-kind-cluster.sh devops-course
bash scripts/build-image.sh 1.0.0
kind load docker-image academia-devops-app:1.0.0 --name devops-course
```

> 🪟 **Windows (PowerShell):** use the `.ps1` scripts: `pwsh scripts/create-kind-cluster.ps1 devops-course` and `pwsh scripts/build-image.ps1 1.0.0`. The `kind load ...` line is identical.

> 🔑 **Key point with kind:** the cluster does NOT see your local Docker. You must **load** the image
> with `kind load docker-image`, or you'll get an `ImagePullBackOff`.

## 1) Deploy (Lab 5 — ☸️ Cluster Helmsman)

```bash
kubectl apply -f 05-kubernetes/namespace.yaml
kubectl apply -f 05-kubernetes/configmap.yaml
kubectl apply -f 05-kubernetes/secret-example.yaml
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl apply -f 05-kubernetes/service.yaml

# (or all in one go)
bash scripts/deploy-k8s.sh devops-course
```

> 🪟 **Windows (PowerShell):** `pwsh scripts/deploy-k8s.ps1 devops-course`

Validate:

```bash
kubectl -n academia get deployments,pods,svc
kubectl -n academia describe deployment academia-app
kubectl -n academia rollout status deployment/academia-app
```

Test with port-forward:

```bash
kubectl -n academia port-forward service/academia-app-service 8080:80
# in another terminal:
curl http://localhost:8080/health
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/health` (with `.exe`; in PowerShell `curl` is a different command). Or open the URL in your browser.

## 2) Configuration and secrets (Lab 6 — 🔐)

```bash
kubectl -n academia get configmap academia-config -o yaml
kubectl -n academia get secret academia-secret -o yaml

# Demonstration: base64 is NOT encryption
kubectl -n academia get secret academia-secret -o jsonpath='{.data.DB_PASSWORD}' | base64 -d
```

## 3) Scale, update and roll back (Lab 7 — 📈)

```bash
# Scale to 4 replicas
kubectl -n academia scale deployment academia-app --replicas=4
kubectl -n academia get pods

# Update to a new version (rolling update)
kubectl -n academia set image deployment/academia-app academia-app=academia-devops-app:1.0.1
kubectl -n academia rollout status deployment/academia-app
kubectl -n academia rollout history deployment/academia-app

# Roll back to the previous version
kubectl -n academia rollout undo deployment/academia-app
```

> 💡 For v1.0.1: `bash scripts/build-image.sh 1.0.1` and `kind load docker-image academia-devops-app:1.0.1 --name devops-course`.

> 🪟 **Windows (PowerShell):** `pwsh scripts/build-image.ps1 1.0.1` (the `kind load ...` line is identical).

## 4) Version with probes + limits + security (DevSecOps, day 4)

```bash
kubectl -n academia apply -f 05-kubernetes/deployment-with-probes.yaml
kubectl -n academia describe pod -l app=academia-app | grep -A5 -i liveness
```

> 🪟 **Windows (PowerShell):** `kubectl -n academia describe pod -l app=academia-app | Select-String -Context 0,5 liveness` (`Select-String` replaces `grep`; `-Context 0,5` mimics `-A5`).

## ❗ Troubleshooting

| Pod state | Meaning | Fix |
| -------------- | ----------- | -------- |
| `ImagePullBackOff` | Can't find the image | `kind load docker-image ...` (local image not loaded) |
| `CrashLoopBackOff` | The container starts and dies | `kubectl logs <pod> -n academia` |
| `Pending` | No resources / node | `kubectl describe pod <pod>` and check Events |
| `0/2 Ready` | The Pod isn't passing readiness | Check that `/health` returns 200 |
| Service not responding | Selector doesn't match | The Pod's labels must match the Service's `selector` |

## Cleanup

```bash
bash scripts/reset-lab.sh                 # deletes the academia namespace
bash scripts/delete-kind-cluster.sh devops-course
```

> 🪟 **Windows (PowerShell):** `pwsh scripts/reset-lab.ps1` and `pwsh scripts/delete-kind-cluster.ps1 devops-course`.
