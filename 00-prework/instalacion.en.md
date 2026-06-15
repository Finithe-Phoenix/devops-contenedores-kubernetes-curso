> 🌐 **English** · [Español](instalacion.md)

# 🧰 Prework — Installing the tools

> Do this **before** day 1. If something fails, don't worry: day 1 starts with
> **Lab 0** to validate everything as a group. But arriving with this ready gives you an edge.

## The essentials (days 1 and 2)

| Tool | What for | Windows | macOS | Linux |
| ----------- | -------- | ------- | ----- | ----- |
| **Git** | Version control | [git-scm.com](https://git-scm.com) | `brew install git` | `apt install git` |
| **Docker Desktop** | Containers | [docker.com](https://www.docker.com/products/docker-desktop/) | Docker Desktop | Docker Engine |
| **Node.js 22 LTS** | The demo app | [nodejs.org](https://nodejs.org) | `brew install node@22` | `nvm install 22` |
| **VS Code** | Editor | [code.visualstudio.com](https://code.visualstudio.com) | same | same |

## For days 3 and 4 (Kubernetes)

| Tool | What for | Quick install |
| ----------- | -------- | ------------------ |
| **kubectl** | Talk to Kubernetes | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/) |
| **kind** | Local cluster in Docker | [kind.sigs.k8s.io](https://kind.sigs.k8s.io/docs/user/quick-start/) |
| **helm** | Package deployments | [helm.sh/docs/intro/install](https://helm.sh/docs/intro/install/) |
| **Trivy** | Security scanning | [trivy.dev](https://trivy.dev/latest/getting-started/installation/) |

## 🪟 Note for Windows

- Enable **WSL2** and use it as the Docker Desktop backend (Settings → General).
- Work inside WSL2 or PowerShell; avoid paths with unusual spaces.
- ⚠️ **OneDrive + `.sh` scripts:** if you clone inside OneDrive, the `.sh` files may
  be converted to CRLF and break on Linux. This repo already ships a `.gitattributes`
  that prevents it (`*.sh eol=lf`).

## Verify everything is in place

```bash
bash scripts/check-env.sh
```

If you see ✅ on git, docker and node, you can get started. The rest is installed on the day it's needed.
