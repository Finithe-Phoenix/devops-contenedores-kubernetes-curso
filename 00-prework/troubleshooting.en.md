> 🌐 **English** · [Español](troubleshooting.md)

# 🛟 Environment troubleshooting

The most common problems and their quick fix. (The full course ships a
troubleshooting guide per lab; this is just the getting-started one.)

## Docker

| Symptom | Solution |
| ------- | -------- |
| `Cannot connect to the Docker daemon` / `pipe/dockerDesktopLinuxEngine` | Open **Docker Desktop** and wait until the whale 🐳 icon stops animating. |
| Docker Desktop won't open on Windows | Check that **WSL2** and **virtualization (VT-x)** are enabled in the BIOS. |
| `port is already allocated` (8080 or 5432) | Something is already using that port: `docker rm -f <contenedor>` or change the mapping `-p 8081:8080`. |
| Very slow build the first time | Normal: it downloads the base image. Subsequent ones use the cache. |

## Node / npm

| Symptom | Solution |
| ------- | -------- |
| `node: command not found` after installing | Restart the terminal (the `PATH` is updated when you reopen it). |
| `npm ci` fails due to a missing lockfile | Run `npm install` once to generate `package-lock.json`. |
| Node version too old | Install Node 22 LTS; use `nvm` to switch between versions. |

## Git

| Symptom | Solution |
| ------- | -------- |
| `.sh` scripts fail on Linux with `end of file unexpected` | They're CRLF. This repo prevents it with `.gitattributes`. If it already happened: `git add --renormalize .` |
| `git clone` asks for credentials | Use a personal token or set up SSH; or clone via public HTTPS. |

## Kubernetes (days 3-4)

| Symptom | Solution |
| ------- | -------- |
| `kubectl` won't connect | There's no cluster yet. Create it: `kind create cluster --name devops-course`. |
| The local image doesn't show up in kind | kind doesn't see your local Docker; you have to load it: `kind load docker-image academia-devops-app:1.0.0`. |

## Universal Plan B

If your machine is locked down by the institution:
1. Work **in pairs** with someone who does have the environment.
2. Follow the instructor's **projected demo** and write down the commands.
3. Use **GitHub Codespaces** if available (Docker in the cloud).
4. Leave the installation as homework and submit the evidence afterward.
