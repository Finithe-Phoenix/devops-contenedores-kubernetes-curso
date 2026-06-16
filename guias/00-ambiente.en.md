> 🌐 **English** · [Español](00-ambiente.md)

# 🎯 Step-by-step guide — Lab 0: Validate your environment

**Mission:** get your machine ready for the course · **XP:** +30 · **Badge:** 🧰 Kit Ready · **Time:** ~10 min · **Difficulty:** ★☆☆

## 🎒 Before you start

**Prerequisites**

- This repository cloned, with a terminal open at its root.
- **Docker Desktop installed and running** (look for the little whale 🐳 in your taskbar).
- Git, Node.js (v20 or higher) and npm installed. Don't have them? → [`00-prework/instalacion.en.md`](../00-prework/instalacion.en.md).

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

**Where it fits in the DevOps cycle**

Before *coding*, *building*, *testing* or *deploying* anything, the whole team needs the **same reproducible environment**. This Lab is the "Plan → Setup" stage: we kill the classic *"works on my machine"* by validating every tool up front.

## 🧭 What you'll achieve

- Verify that git, Docker, Node and npm respond on your machine.
- Confirm the Docker **daemon** is running (not just the client).
- Unlock your first course badge: 🧰 **Kit Ready** (+30 XP).

## 👣 Steps

### Step 1 — Move to the repo root

```bash
cd devops-contenedores-kubernetes-curso
```

**What you'll see:** (the prompt switches to the course folder)

```
~/devops-contenedores-kubernetes-curso$
```

**What happened?** Every command in this Lab runs from the repository root, because the `check-env.sh` script lives under `scripts/`.

### Step 2 — Run the environment validator

```bash
bash scripts/check-env.sh
```

> 🪟 **Windows (PowerShell):** `pwsh scripts/check-env.ps1`

**What you'll see:**

```
=================================================
  Lab 0 — Validación de ambiente (Misión 🧰)
=================================================

Imprescindibles:
  ✅ git                    git version 2.43.0
  ✅ docker                 Docker version 28.1.1, build 4eba377
  ✅ node                   v22.22.3
  ✅ npm                    10.9.0

Para los días de Kubernetes:
  ✅ kubectl                Client Version: v1.30.0
  ✅ helm                   v3.15.0+g...
  ✅ kind                   kind v0.23.0

Opcionales (ruta Java):
  ❌ java                   (no encontrado)
  ❌ maven                  (no encontrado)

-------------------------------------------------
  Listos: 7    Faltantes: 2
-------------------------------------------------
  🐳 Docker daemon: CORRIENDO
  🎉 Ambiente completo. +30 XP — medalla 🧰 Kit Listo desbloqueada.
```

**What happened?** The script queried each tool and printed its version. Java and Maven are **optional** (only for the Java track), so their ❌ won't break the mission: what counts is the `🎉 Ambiente completo` line.

### Step 3 — Check Node and Docker by hand

```bash
node --version
docker --version
```

**What you'll see:**

```
v22.22.3
Docker version 28.1.1, build 4eba377
```

**What happened?** You confirmed the two core tools of the course yourself: Node runs the app, and Docker will containerize it in Lab 1. Any Node `v20.x` or higher, and Docker `28.x`, works fine.

### Step 4 — Confirm the Docker daemon responds

```bash
docker info
```

**What you'll see:** (a long block; the key is that NO connection error appears)

```
Client: Docker Engine - Community
 ...
Server:
 Containers: 0
 Images: 0
 Server Version: 28.1.1
 ...
```

**What happened?** `docker info` talks to the **server** (the daemon), not just the client. If it answers with the `Server:` section, Docker Desktop is alive and ready to build images.

## ✅ Checkpoint

You've completed Lab 0 when:

- `bash scripts/check-env.sh` ends with `🐳 Docker daemon: CORRIENDO` and `🎉 Ambiente completo. +30 XP`.
- `node --version` shows **v20 or higher** and `docker --version` shows **28.x**.

**Evidence for your achievement card:** a screenshot of the final `check-env.sh` output.

## 🧯 If something fails

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `🐳 Docker daemon: ⚠️ NO responde` | Docker Desktop is off | Open Docker Desktop and wait for the whale 🐳 to stop animating |
| `❌ docker (no encontrado)` | Docker isn't installed or isn't on the `PATH` | Install it via [`00-prework/instalacion.en.md`](../00-prework/instalacion.en.md) and restart the terminal |
| `❌ node` or version below v20 | Old or missing Node | Install Node 20+ from [nodejs.org](https://nodejs.org) |
| `scripts/check-env.sh: not found` | You're in another folder | `cd` to the repo root (Step 1) |
| `Permission denied` running the script | Missing execute permission | Prefix it with `bash`: `bash scripts/check-env.sh` |
| 🪟 *"Windows Subsystem for Linux has no distributions installed"* | You used `bash` on Windows (it points to WSL) | Use `pwsh scripts/check-env.ps1` — see [cheat sheet](windows-powershell.en.md) |
| 🪟 `curl` returns a weird/long response | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe` (with `.exe`) or open the URL in the browser |

Still failing? → [`00-prework/troubleshooting.en.md`](../00-prework/troubleshooting.en.md)

## 🏆 Extra challenge (+10 XP)

Install **`kind`** (Kubernetes IN Docker) and create an empty cluster to confirm everything fits together:

```bash
kind create cluster --name academia
kubectl get nodes
```

When you're done, delete it to free up resources: `kind delete cluster --name academia`.

## 🎓 How to teach it to your students

- **Open with the classic question:** *"who's had the 'it works on my machine' moment?"* and connect the chaos of mismatched environments to the point of this Lab.
- **Make the check screenshot the entry ticket:** nobody advances to Lab 1 without their `🎉 Ambiente completo`. You'll spot stragglers before they get stuck.
- **Turn a ❌ into a demo:** switch Docker Desktop off on purpose and show the difference between client and daemon. It's a memorable "aha".
- **Hand out the badge out loud:** naming 🧰 *Kit Ready* when you close the Lab reinforces the XP system from minute one.

## ⏭️ Next

➡️ [Lab 1: Your first Docker image](01-docker.en.md)
