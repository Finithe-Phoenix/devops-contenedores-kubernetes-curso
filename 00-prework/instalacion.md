> 🌐 [English](instalacion.en.md) · **Español**

# 🧰 Prework — Instalación de herramientas

> Hazlo **antes** del día 1. Si algo falla, no te preocupes: el día 1 empieza con
> el **Lab 0** para validar todo en grupo. Pero llegar con esto listo te da ventaja.

## 🚀 Instalación automática (Windows) — la forma rápida

¿No quieres instalar a mano? Un **instalador deja todo listo**: WSL2 + Docker + Git + Node +
kubectl + kind + Helm + Trivy + VS Code, y clona el material del curso. Pide permiso de **Administrador**.

**Opción A — una sola línea** (pega en PowerShell y Enter):

```powershell
powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/main/00-prework/instalar-windows.ps1 -OutFile $env:TEMP\instalar.ps1; & $env:TEMP\instalar.ps1"
```

**Opción B — descarga el archivo** [`instalar-windows.ps1`](instalar-windows.ps1) → clic derecho → *Ejecutar con PowerShell*.

Al terminar: **reinicia la PC**, abre **Docker Desktop** (espera la ballena 🐳) y valida con
`bash scripts/check-env.sh`. ¿Docker pide **WSL2**? El instalador ya lo activa; si lo haces a mano:
`wsl --install` en PowerShell como Administrador + reiniciar.

> 🪟 **Windows:** corre los scripts con **PowerShell** (`pwsh scripts/build-image.ps1`), **NO** con
> `bash scripts/...sh`. En Windows `bash` apunta a WSL y falla con *"Subsistema de Windows para Linux
> no tiene distribuciones instaladas"* si no hay distro. Más detalle: [`scripts/README.md`](../scripts/README.md).
> O simplemente usa `docker` directo: desde `01-app/node`, `docker build -t academia-devops-app:1.0.0 .`
>
> 🐧 **¿Quieres una terminal Linux real?** Con **[WSL2 (Ubuntu o Arch)](../guias/terminal-linux-wsl.md)**
> corres los comandos de las guías **idénticos**, sin traducir nada.
>
> 🍎🐧 **macOS / Linux:** usa `brew` / el gestor de tu distro (tablas abajo) + Docker Desktop o Docker Engine.

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
