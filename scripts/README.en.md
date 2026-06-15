> 🌐 **English** · [Español](README.md)

# 🧰 Course scripts — which one do I use?

There are **two versions** of each script so it works on any system:

| Your system | Use | Example |
| ----------- | --- | ------- |
| 🪟 **Windows** | the `.ps1` (PowerShell) | `pwsh scripts/build-image.ps1` |
| 🐧 **Linux / 🍎 macOS / WSL** | the `.sh` (bash) | `bash scripts/build-image.sh` |

> ⚠️ **On Windows do NOT use `bash scripts/something.sh`.** On Windows, `bash` usually points to **WSL**,
> and if WSL has no Linux distribution installed you'll see: *"Windows Subsystem for Linux has no
> distributions installed"*. **Use the `.ps1`** (or the direct `docker`/`kubectl` command).

## 📜 Available scripts

| Action | Windows | Linux/Mac |
| ------ | ------- | --------- |
| Validate environment (Lab 0) | `pwsh scripts/check-env.ps1` | `bash scripts/check-env.sh` |
| Build the image (Lab 1) | `pwsh scripts/build-image.ps1` | `bash scripts/build-image.sh` |
| Create kind cluster (Lab 5) | `pwsh scripts/create-kind-cluster.ps1` | `bash scripts/create-kind-cluster.sh` |
| Deploy to k8s (Lab 5) | `pwsh scripts/deploy-k8s.ps1` | `bash scripts/deploy-k8s.sh` |
| Delete kind cluster | `pwsh scripts/delete-kind-cluster.ps1` | `bash scripts/delete-kind-cluster.sh` |
| Reset the lab | `pwsh scripts/reset-lab.ps1` | `bash scripts/reset-lab.sh` |
| Start everything (class) | `pwsh scripts/clase.ps1` | `bash scripts/clase.sh` |

> 💡 They all work **from any folder** (they move themselves to the repo root).

## ✋ No scripts? You can also use the direct commands

Build the image (from `01-app/node`):

```powershell
docker build -t academia-devops-app:1.0.0 .
```

You don't need any script or `bash` for that — `docker` is native to Windows.
