> 🌐 **English** · [Español](windows-powershell.md)

# 🪟 PowerShell cheat sheet (Windows) — so you don't get stuck in the labs

The guides show **Linux/Mac**-style commands (bash). On **Windows with PowerShell** some of them change.
This is your translation table. Keep it next to you while you do the labs.

> 💡 **Quick rule:** anything with `docker`, `kubectl`, `helm`, `git`, `node`, `npm` works **the same**
> on Windows. What changes are the *Unix tools* (`bash`, `curl`, `grep`, `head`, `tail`).

## 🔁 Translation table

| 🐧 Linux / Mac / WSL (what the guide shows) | 🪟 Windows (PowerShell) |
| ------------------------------------------- | ----------------------- |
| `bash scripts/build-image.sh 1.0.0` | `pwsh scripts/build-image.ps1 1.0.0` |
| `bash ../../scripts/build-image.sh 1.0.0` | `pwsh ../../scripts/build-image.ps1 1.0.0` |
| `curl http://localhost:8080/health` | `curl.exe http://localhost:8080/health` |
| `docker images \| grep academia` | `docker images \| Select-String academia` |
| `... \| head -n 5` | `... \| Select-Object -First 5` |
| `... \| tail -n 5` | `... \| Select-Object -Last 5` |
| `kubectl ... \| grep -A3 "text"` | `kubectl ... \| Select-String -Context 0,3 "text"` |
| `export DB_HOST=postgres` | `$env:DB_HOST = "postgres"` |
| `cat file.txt` | `Get-Content file.txt` |
| `rm -rf folder` | `Remove-Item -Recurse -Force folder` |
| `\` at end of line (continue command) | backtick `` ` `` at end, or **everything on one line** |

## ⚠️ The 3 traps that confuse people most

### 1. `curl` in PowerShell is **NOT** the real `curl`
In PowerShell, `curl` is an **alias** for `Invoke-WebRequest` and behaves differently (different output,
different flags). So on Windows type **`curl.exe`** (with `.exe`) to use the real curl that Windows 10/11 already ships:

```powershell
curl.exe http://localhost:8080/health
```

For POST requests with a JSON body, the simplest thing in PowerShell is:

```powershell
curl.exe -X POST http://localhost:8080/courses -H "Content-Type: application/json" -d '{\"name\":\"Docker 101\"}'
```

> 👉 If you prefer, open the URL in your **browser** (`http://localhost:8080/health`) — works on any system.

### 2. `bash` on Windows opens **WSL**, not bash
If you run `bash scripts/something.sh` and see *"Windows Subsystem for Linux has no distributions
installed"*, it's because `bash` on Windows calls WSL. **Use the `.ps1`** or the direct `docker`/`kubectl` command.
More detail: [`scripts/README.en.md`](../scripts/README.en.md).

### 3. `\` does not continue lines in PowerShell
In bash, a trailing `\` lets you split a command across lines. In PowerShell that **fails**. Options:
- Put **the whole command on one line**, or
- Use the **backtick** `` ` `` at the end of each line.

## ✅ The most bulletproof options

If the syntax ever trips you up, you can almost always:
- **Build the image** without scripts: from `01-app/node`, `docker build -t academia-devops-app:1.0.0 .`
- **See responses** by opening the URL in your browser instead of `curl`.
- **Use the `.ps1`** the course already ships: see [`scripts/README.en.md`](../scripts/README.en.md).

➡️ Back to your lab: **[Step-by-step guides](README.en.md)**.
