> 🌐 [English](windows-powershell.en.md) · **Español**

# 🪟 Chuleta de PowerShell (Windows) — para no atorarte en los labs

Las guías muestran comandos estilo **Linux/Mac** (bash). En **Windows con PowerShell** algunos cambian.
Esta es tu tabla de traducción. Tenla a un lado mientras haces los labs.

> 💡 **Regla rápida:** lo que pongas con `docker`, `kubectl`, `helm`, `git`, `node`, `npm` funciona **igual**
> en Windows. Lo que cambia son las *herramientas de Unix* (`bash`, `curl`, `grep`, `head`, `tail`).

## 🔁 Tabla de traducción

| 🐧 Linux / Mac / WSL (lo que ves en la guía) | 🪟 Windows (PowerShell) |
| -------------------------------------------- | ----------------------- |
| `bash scripts/build-image.sh 1.0.0` | `pwsh scripts/build-image.ps1 1.0.0` |
| `bash ../../scripts/build-image.sh 1.0.0` | `pwsh ../../scripts/build-image.ps1 1.0.0` |
| `curl http://localhost:8080/health` | `curl.exe http://localhost:8080/health` |
| `docker images \| grep academia` | `docker images \| Select-String academia` |
| `... \| head -n 5` | `... \| Select-Object -First 5` |
| `... \| tail -n 5` | `... \| Select-Object -Last 5` |
| `kubectl ... \| grep -A3 "texto"` | `kubectl ... \| Select-String -Context 0,3 "texto"` |
| `export DB_HOST=postgres` | `$env:DB_HOST = "postgres"` |
| `cat archivo.txt` | `Get-Content archivo.txt` |
| `rm -rf carpeta` | `Remove-Item -Recurse -Force carpeta` |
| `\` al final de línea (continuar comando) | backtick `` ` `` al final, o **todo en una sola línea** |

## ⚠️ Las 3 trampas que más confunden

### 1. `curl` en PowerShell **NO** es el `curl` de verdad
En PowerShell, `curl` es un **alias** de `Invoke-WebRequest` y se comporta distinto (otra salida, otros
flags). Por eso en Windows escribe **`curl.exe`** (con `.exe`) para usar el curl real que ya trae Windows 10/11:

```powershell
curl.exe http://localhost:8080/health
```

Para peticiones POST con cuerpo JSON, lo más simple en PowerShell es:

```powershell
curl.exe -X POST http://localhost:8080/courses -H "Content-Type: application/json" -d '{\"name\":\"Docker 101\"}'
```

> 👉 Si prefieres, abre la URL en el **navegador** (`http://localhost:8080/health`) — funciona en cualquier sistema.

### 2. `bash` en Windows abre **WSL**, no bash
Si corres `bash scripts/algo.sh` y ves *"Subsistema de Windows para Linux no tiene distribuciones
instaladas"*, es porque `bash` en Windows llama a WSL. **Usa el `.ps1`** o el comando `docker`/`kubectl` directo.
Más detalle: [`scripts/README.md`](../scripts/README.md).

### 3. `\` no continúa líneas en PowerShell
En bash, un `\` al final permite partir un comando en varias líneas. En PowerShell eso **falla**. Opciones:
- Pon **todo el comando en una sola línea**, o
- Usa el **backtick** `` ` `` al final de cada línea.

## ✅ Lo más a prueba de balas

Si algo de la sintaxis te marea, casi siempre puedes:
- **Construir la imagen** sin scripts: desde `01-app/node`, `docker build -t academia-devops-app:1.0.0 .`
- **Ver respuestas** abriendo la URL en el navegador en vez de `curl`.
- **Usar los `.ps1`** que el curso ya trae: ver [`scripts/README.md`](../scripts/README.md).

➡️ Vuelve a tu lab: **[Guías paso a paso](README.md)**.
