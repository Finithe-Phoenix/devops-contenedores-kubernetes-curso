> 🌐 **English** · [Español](terminal-linux-wsl.md)

# 🐧 A real Linux terminal on Windows (WSL2) — Unix commands as-is

**Mission:** get a **real Linux inside Windows** so that **ALL** the commands in the guides
(`curl`, `grep`, `head`, `bash`, `cat`…) work **without translating anything**. · **Badge:** 🐧 *Penguin on Windows*

> 💡 **Why?** The guides use Linux/Mac-style commands. In PowerShell some of them change
> (see the [PowerShell cheat sheet](windows-powershell.en.md)). With **WSL2** you skip all that: you copy and
> paste the commands **exactly** as they appear in the guide. It's the most comfortable, "just like class" way.

## 🧭 What you'll achieve

- Install **WSL2** (Windows Subsystem for Linux) with a Linux distro.
- Run **native** `curl`, `grep`, `head`, `bash` — the same ones in the guides.
- Connect **Docker Desktop** to your Linux.
- Open the course repo from Linux.

## 👣 Steps

### Step 1 — Install WSL2 (one line, in PowerShell **as Administrator**)

```powershell
wsl --install
```

This installs WSL2 + **Ubuntu** (the recommended distro to start: Docker integrates automatically).
When it finishes, **reboot**. The first time you open Ubuntu it asks you to create a Linux **username and
password** (yours, local — write them down).

> ✅ **Already have WSL?** Check with `wsl --list --verbose`. If you see a distro in `Running` state, you're set.

### Step 2 (optional) — Want **Arch Linux**? You can too

```powershell
wsl --install archlinux
```

Arch is "rolling release" (always the newest). After installing it, initialize it once:

```bash
# inside Arch, as root:
pacman-key --init && pacman-key --populate archlinux
pacman -Syu --noconfirm
pacman -S --needed --noconfirm curl grep coreutils git
```

> 🐧 **Ubuntu vs Arch:** for the course, **Ubuntu** is the simplest (Docker integrated by default, everything
> preinstalled). **Arch** is great if you want the newest packages, but it needs the Docker toggle in Step 3
> and a couple of `pacman -S`. Either one gives you the Unix commands the guides use.

### Step 3 — Connect Docker Desktop to your Linux

1. Open **Docker Desktop** → **Settings** (⚙️) → **Resources** → **WSL Integration**.
2. Turn on **"Enable integration with my default WSL distro"**.
3. Also enable your distro in the list (e.g. `Ubuntu` or `archlinux`).
4. **Apply & restart**.

Verify inside your Linux:

```bash
docker --version
docker ps
```

### Step 4 — Open the course repo from Linux

Your `C:` drive is mounted at `/mnt/c`. If you cloned the course on Windows:

```bash
cd /mnt/c/Users/YOUR_USER/path/to/devops-contenedores-kubernetes-curso
```

> ⚡ **Performance tip:** for Docker and `npm` to fly, clone the repo **inside** Linux
> (in your `~`) instead of `/mnt/c`:
> ```bash
> git clone https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso.git
> cd devops-contenedores-kubernetes-curso
> ```

### Step 5 — Check that EVERYTHING works (the guide commands, as-is)

```bash
curl --version | head -1
grep --version | head -1
cd 01-app/node && npm install && npm test
bash ../../scripts/build-image.sh 1.0.0
curl http://localhost:8080/health
```

If this runs, you can now do **any course lab by copy-pasting the guide commands without changing a thing**. 🎉

## ✅ Checkpoint

- `wsl --list --verbose` shows your distro `Running`.
- Inside Linux: `curl --version` and `grep --version` respond.
- `docker ps` works inside Linux.
- You unlock 🐧 **Penguin on Windows**.

## 🧯 If something fails

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `wsl: command not found` | WSL not installed | Run `wsl --install` in PowerShell **as Administrator** and reboot |
| *"has no distributions installed"* | WSL with no distro | `wsl --install Ubuntu` (or `wsl --install archlinux`) |
| `docker: command not found` inside Linux | Missing integration | Docker Desktop → Settings → Resources → WSL Integration → enable your distro → Apply & restart |
| Everything is **slow** under `/mnt/c` | Repo lives on the Windows disk | Clone it inside `~` (Step 4, tip) |
| `pacman-key` fails on Arch | Keyring not initialized | `pacman-key --init && pacman-key --populate archlinux` |

## 🎓 How to teach it to your students

- **Recommend Ubuntu by default.** It's one `wsl --install` and you're working; Docker integrates on its own.
  Leave Arch as a challenge for the curious.
- **VS Code + WSL:** install Microsoft's **"WSL"** extension. They open the course folder with `code .` from
  Linux and edit on Windows while it runs on Linux. Best of both worlds.
- **Plan B always available:** anyone who doesn't want WSL can follow the guides with the
  [PowerShell cheat sheet](windows-powershell.en.md). Nobody gets stuck.

➡️ Back to your labs: **[Step-by-step guides](README.en.md)**.
