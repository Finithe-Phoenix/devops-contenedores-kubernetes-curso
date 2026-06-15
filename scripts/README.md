> 🌐 [English](README.en.md) · **Español**

# 🧰 Scripts del curso — ¿cuál uso?

Hay **dos versiones** de cada script para que funcione en cualquier sistema:

| Tu sistema | Usa | Ejemplo |
| ---------- | --- | ------- |
| 🪟 **Windows** | los `.ps1` (PowerShell) | `pwsh scripts/build-image.ps1` |
| 🐧 **Linux / 🍎 macOS / WSL** | los `.sh` (bash) | `bash scripts/build-image.sh` |

> ⚠️ **En Windows NO uses `bash scripts/algo.sh`.** En Windows, `bash` suele apuntar a **WSL**, y si WSL
> no tiene una distribución de Linux instalada verás: *"Subsistema de Windows para Linux no tiene
> distribuciones instaladas"*. **Usa los `.ps1`** (o el comando `docker`/`kubectl` directo).

## 📜 Scripts disponibles

| Acción | Windows | Linux/Mac |
| ------ | ------- | --------- |
| Validar ambiente (Lab 0) | `pwsh scripts/check-env.ps1` | `bash scripts/check-env.sh` |
| Construir la imagen (Lab 1) | `pwsh scripts/build-image.ps1` | `bash scripts/build-image.sh` |
| Crear cluster kind (Lab 5) | `pwsh scripts/create-kind-cluster.ps1` | `bash scripts/create-kind-cluster.sh` |
| Desplegar en k8s (Lab 5) | `pwsh scripts/deploy-k8s.ps1` | `bash scripts/deploy-k8s.sh` |
| Borrar cluster kind | `pwsh scripts/delete-kind-cluster.ps1` | `bash scripts/delete-kind-cluster.sh` |
| Reiniciar laboratorio | `pwsh scripts/reset-lab.ps1` | `bash scripts/reset-lab.sh` |
| Encender todo (clase) | `pwsh scripts/clase.ps1` | `bash scripts/clase.sh` |

> 💡 Todos funcionan **desde cualquier carpeta** (se mueven solos a la raíz del repo).

## ✋ ¿Sin scripts? También puedes usar los comandos directos

Construir la imagen (desde `01-app/node`):

```powershell
docker build -t academia-devops-app:1.0.0 .
```

No necesitas ningún script ni `bash` para eso — `docker` es nativo de Windows.
