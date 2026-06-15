> 🌐 **English** · [Español](01-docker.md)

# 🎯 Step-by-step guide — Lab 1: Your first Docker image

**Mission:** containerize the DevOps Academy App · **XP:** +100 · **Badge:** 🐳 Container Captain · **Time:** ~25 min · **Difficulty:** ★☆☆

## 🎒 Before you start

**Prerequisites**

- You've completed [Lab 0](00-ambiente.en.md): your 🧰 *Kit Ready* badge unlocked and the Docker daemon running.
- A terminal open at the repository root.

**Where it fits in the DevOps cycle**

This is the **Build → Package** stage. We take code that runs "on your machine" and package it into an **image**: an immutable, portable artifact that runs identically on your laptop, in CI, and in Kubernetes. It's the foundation every later Lab builds on.

## 🧭 What you'll achieve

- Install dependencies and run the app's **8 tests** locally.
- Build a **multi-stage** Docker image (~172 MB) of the DevOps Academy App.
- Start the container and confirm `/health` and `/version` respond.
- Watch the native **HEALTHCHECK** mark the container as `(healthy)`.
- Open the app's **web UI** in the browser and unlock 🐳 **Container Captain** (+100 XP).

## 👣 Steps

### Step 1 — Install the app's dependencies

```bash
cd 01-app/node
npm install
```

**What you'll see:**

```
added 108 packages, and audited 109 packages in 3s

found 0 vulnerabilities
```

**What happened?** npm read `package.json`, downloaded the dependencies, and generated/updated `package-lock.json`. That lockfile is exactly what the Dockerfile uses with `npm ci` for reproducible builds.

### Step 2 — Run the tests locally

```bash
npm test
```

**What you'll see:** (final lines)

```
# tests 8
# pass 8
# fail 0
```

**What happened?** You verified the app is healthy **before** containerizing it. Golden DevOps rule: never package something that doesn't pass its tests.

### Step 3 — Build the Docker image

```bash
bash ../../scripts/build-image.sh 1.0.0
```

**What you'll see:**

```
🐳 Construyendo academia-devops-app:1.0.0 ...
[+] Building 6.2s (15/15) FINISHED
 => => naming to docker.io/library/academia-devops-app:1.0.0
✅ Imagen academia-devops-app:1.0.0 construida.
academia-devops-app   1.0.0   a1b2c3d4e5f6   2 seconds ago   172MB
```

**What happened?** The script ran `docker build` against `01-app/node`. The Dockerfile is **multi-stage**: the `deps` stage installs only production dependencies with `npm ci --omit=dev`, and the `runtime` stage keeps just what's needed on top of `node:22-alpine`. That's why the image is only ~172 MB.

### Step 4 — Confirm the image on your machine

```bash
docker images
```

**What you'll see:**

```
REPOSITORY            TAG     IMAGE ID       CREATED          SIZE
academia-devops-app   1.0.0   a1b2c3d4e5f6   10 seconds ago   172MB
```

**What happened?** An **image** is the immutable template (the recipe). Nothing is running yet: it's the artifact we'll create containers from in the next step.

### Step 5 — Run the container

```bash
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
```

**What you'll see:**

```
3f9a2b1c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a
```

**What happened?** You created a **container** (the running instance, "the dish") from the image. `-d` runs it in the background and `-p 8080:8080` maps the container's port to your machine. The long string is the container ID.

### Step 6 — Ask the app if it's alive

```bash
curl http://localhost:8080/health
```

**What you'll see:**

```
{"status":"UP","store":"memory","db":"ok","uptime_s":8}
```

**What happened?** The app responded from inside the container. `"store":"memory"` confirms that, without `DB_HOST`, it uses the in-memory store (perfect for this simple Lab).

### Step 7 — Check the version

```bash
curl http://localhost:8080/version
```

**What you'll see:**

```
{"name":"academia-devops-app","version":"1.0.0","node":"v22.22.3"}
```

**What happened?** The `/version` endpoint reports the name, the version (the tag you built with), and the Node version **inside** the image. Handy for knowing exactly what you're running.

### Step 8 — Confirm the HEALTHCHECK

```bash
docker ps
```

**What you'll see:**

```
CONTAINER ID   IMAGE                       STATUS                   PORTS                    NAMES
3f9a2b1c8d7e   academia-devops-app:1.0.0   Up 20 seconds (healthy)  0.0.0.0:8080->8080/tcp   academia
```

**What happened?** The `(healthy)` comes from the `HEALTHCHECK` defined in the Dockerfile, which calls `/health` every 30s. Docker now **knows** whether your app is healthy, not just whether the process is alive. That signal will be key in Kubernetes.

### Step 9 — Open the web UI

Open in your browser: **http://localhost:8080/**

**What you'll see:** a web home page listing the DevOps Academy App's endpoints (not just JSON!).

**What happened?** The same image serves both the API and a web interface. You have a real app running inside a container you built.

## ✅ Checkpoint

You've completed Lab 1 when:

- `npm test` shows `# pass 8` / `# fail 0`.
- `docker images` lists `academia-devops-app:1.0.0` (~172 MB).
- `docker ps` shows the `academia` container as `Up ... (healthy)`.
- `curl http://localhost:8080/health` responds `{"status":"UP",...}` and the UI loads in the browser.

**Evidence for your achievement card:** screenshots of `docker ps` (with `(healthy)`) and of the `/health` response.

## 🧯 If something fails

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `Cannot connect to the Docker daemon` | Docker Desktop is off | Open Docker Desktop and wait for the whale 🐳 |
| `port is already allocated` | Port 8080 is already taken | `docker rm -f academia` or use `-p 8081:8080` |
| `npm ci` fails during the build | Missing `package-lock.json` | Run `npm install` once (Step 1) to generate it |
| The container starts and dies | Code error or missing variable | Check `docker logs academia` |
| `(health: starting)` and never reaches `(healthy)` | Still in the 5s `start-period` | Wait a few seconds and re-run `docker ps` |
| `curl: connection refused` | Container still booting, or port not mapped | Confirm `docker ps` and the `-p 8080:8080` flag |

Still failing? → [`02-docker/comandos-docker.en.md`](../02-docker/comandos-docker.en.md)

## 🏆 Extra challenge (+20 XP): compare with the insecure image

Build the "bad" version and measure the size difference:

```bash
# From 01-app/node/
docker build -f ../../02-docker/Dockerfile.insecure -t academia-app:insecure .
docker images | grep academia
```

**Question for class:** why is the insecure image so much heavier? (Hint: full base image vs `alpine`, leftover build tools, and dev dependencies bundled in.)

When you're done, clean up: `docker stop academia && docker rm academia`.

## 🎓 How to teach it to your students

- **Anchor the concept with the recipe/dish analogy:** the image is the recipe (`docker build`), the container is the dish (`docker run`). One recipe → many dishes.
- **Make them break something on purpose:** have them change `-p` to `8081:8080` and discover for themselves why `curl :8080` stops responding. The error is the best teacher.
- **Frame the size challenge as a competition:** whoever best explains *why* the insecure image is heavier wins the +20 XP. It connects straight to DevSecOps (Lab 4).
- **Show the HEALTHCHECK live:** stop the app inside the container and let them watch Docker mark it `unhealthy`. It grounds "health" as something measurable, not abstract.

## ⏭️ Next

➡️ **[Lab 2 guide — app + PostgreSQL with Docker Compose](02-compose.en.md)** 🧩.
