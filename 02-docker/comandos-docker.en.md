> 🌐 **English** · [Español](comandos-docker.md)

# 🐳 Lab 1 — Docker: essential commands

> **Mission:** containerize the DevOps Academy App. **Reward:** +100 XP and the 🐳 *Container Captain* badge.

> 🪟 **On Windows (PowerShell):** some Unix commands change (`curl`→`curl.exe`, `grep`→`Select-String`, `head`→`Select-Object -First`). See the **[PowerShell cheat sheet](../guias/windows-powershell.en.md)**.

## Before you start

```bash
docker version          # client + server (daemon)
docker info             # engine info; fails if Docker Desktop is off
```

## Build the image

```bash
# From 01-app/node/
docker build -t academia-devops-app:1.0.0 .

docker images           # does your image show up?
```

## Run the container

```bash
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0

docker ps               # is it running?
curl http://localhost:8080/health
docker logs academia
docker logs -f academia # follow the logs live (Ctrl+C to exit)
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/health` (with `.exe`; in PowerShell `curl` is a different command). Or open the URL in your browser.

## Inspect and step inside

```bash
docker inspect academia
docker exec -it academia sh        # open a shell inside the container
docker stats academia              # live CPU / memory
```

## Stop and clean up

```bash
docker stop academia
docker rm academia
docker rmi academia-devops-app:1.0.0
docker system df                   # how much space Docker uses
docker system prune                # ⚠️ removes unused containers/images
```

## Image vs Container (the golden question)

| Image | Container |
| ------ | ---------- |
| Immutable template (the recipe) | Running instance (the dish) |
| Built with `docker build` | Created with `docker run` |
| One image → many containers | Each one has its own state |

## Bonus challenge (+20 XP): compare images

```bash
# Build the insecure version and measure the size difference
docker build -f ../02-docker/Dockerfile.insecure -t academia-app:inseguro ../01-app/node
docker images | grep academia
```

> 🪟 **Windows (PowerShell):** the last line is `docker images | Select-String academia`

Question for class: **why is the insecure image so much heavier?**

## ❗ Common errors (and how to rescue yourself)

| Error | Likely cause | Fix |
| ----- | -------------- | -------- |
| `Cannot connect to the Docker daemon` | Docker Desktop is off | Open Docker Desktop and wait for the whale 🐳 |
| `port is already allocated` | Port 8080 is already taken | `docker rm -f academia` or use `-p 8081:8080` |
| `npm ci` fails during the build | Missing `package-lock.json` | Run `npm install` once to generate it |
| The container starts and dies | Error in the code / missing variable | `docker logs academia` |
