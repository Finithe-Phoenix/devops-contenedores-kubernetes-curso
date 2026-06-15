> 🌐 [English](instalacion.en.md) · **Español**

# 🧰 Prework — Instalación de herramientas

> Hazlo **antes** del día 1. Si algo falla, no te preocupes: el día 1 empieza con
> el **Lab 0** para validar todo en grupo. Pero llegar con esto listo te da ventaja.

## Lo imprescindible (días 1 y 2)

| Herramienta | Para qué | Windows | macOS | Linux |
| ----------- | -------- | ------- | ----- | ----- |
| **Git** | Versionar | [git-scm.com](https://git-scm.com) | `brew install git` | `apt install git` |
| **Docker Desktop** | Contenedores | [docker.com](https://www.docker.com/products/docker-desktop/) | Docker Desktop | Docker Engine |
| **Node.js 22 LTS** | La app demo | [nodejs.org](https://nodejs.org) | `brew install node@22` | `nvm install 22` |
| **VS Code** | Editor | [code.visualstudio.com](https://code.visualstudio.com) | idem | idem |

## Para los días 3 y 4 (Kubernetes)

| Herramienta | Para qué | Instalación rápida |
| ----------- | -------- | ------------------ |
| **kubectl** | Hablar con Kubernetes | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/) |
| **kind** | Clúster local en Docker | [kind.sigs.k8s.io](https://kind.sigs.k8s.io/docs/user/quick-start/) |
| **helm** | Empaquetar despliegues | [helm.sh/docs/intro/install](https://helm.sh/docs/intro/install/) |
| **Trivy** | Escaneo de seguridad | [trivy.dev](https://trivy.dev/latest/getting-started/installation/) |

## 🪟 Nota para Windows

- Activa **WSL2** y úsalo como backend de Docker Desktop (Settings → General).
- Trabaja dentro de WSL2 o PowerShell; evita rutas con espacios raros.
- ⚠️ **OneDrive + scripts `.sh`:** si clonas dentro de OneDrive, los `.sh` pueden
  convertirse a CRLF y romperse en Linux. Este repo ya trae un `.gitattributes`
  que lo previene (`*.sh eol=lf`).

## Verifica que todo quedó

```bash
bash scripts/check-env.sh
```

Si ves ✅ en git, docker y node, ya puedes empezar. El resto se instala el día que toca.
