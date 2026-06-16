> 🌐 **English** · [Español](EJECUTAR-LOCAL.md)

# 🚀 Run the site on your computer (local)

Want to run the course **Command Center** on your machine and open it in your browser?
Here are the **3 ways**, from easiest to most manual. All of them serve the site at:

> ### 👉 http://localhost:8080/

---

## 🅰️ Easiest — Docker Compose (recommended)

You need **Docker Desktop** open (wait for the 🐳 whale). From the **repo root**:

```bash
docker compose up -d --build
```

That builds the app + starts PostgreSQL. When it finishes, open **http://localhost:8080/**.

```bash
docker compose ps          # status
docker compose logs -f app # app logs
docker compose down        # stop (keeps the data)
docker compose down -v     # stop and delete the database
```

> 🪟 **Windows:** run these in **PowerShell** (not `bash`). `docker` is native to Windows.

---

## 🅱️ One command — the class launcher

Does all of the above + waits for the app + opens your browser:

```bash
# Windows (PowerShell)
pwsh scripts/clase.ps1

# Linux / Mac / WSL
bash scripts/clase.sh
```

---

## 🅲 No Docker — just Node.js

If you don't have Docker but you do have **Node.js 20+**. Uses an in-memory store (no database):

```bash
cd 01-app/node
npm install
npm start            # -> http://localhost:8080/
```

> 🪟 **Windows:** to test `curl` use `curl.exe http://localhost:8080/health`, or open the URL in your
> browser. (In PowerShell `curl` is a different command — see the [cheat sheet](guias/windows-powershell.en.md).)

---

## 🗺️ Which pages are available locally?

With the site up at `http://localhost:8080/` you get, **all served from your machine**:

| Page / resource | Local URL |
| --------------- | --------- |
| 🎛️ **Command Center** (home) | http://localhost:8080/ |
| 🖼️ **Infographics** gallery (ES/EN) | inside the home page · images at `/infografias/es/NN.png` |
| 📦 **Downloads** (ZIP + PPTX) | http://localhost:8080/downloads/infografias-todas.zip |
| ❤️ App health | http://localhost:8080/health |
| 🏷️ Version | http://localhost:8080/version |
| 📊 Metrics (Prometheus) | http://localhost:8080/metrics |
| 📚 Courses (API) | http://localhost:8080/courses |

> ℹ️ Links to the **step-by-step guides** and **challenges** open on **GitHub** (they look better there,
> with formatting). They need internet; the rest of the site works 100% locally.

---

## 🧯 If something fails

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `Cannot connect to the Docker daemon` | Docker Desktop is off | Open it and wait for the 🐳 whale, retry |
| `port is already allocated` / `address already in use` | Port 8080 is taken | Stop whatever uses it, or change the port: `PORT=8081` (npm) or edit the compose `ports` |
| Home loads but says *"web mode"* (amber banner) | The app isn't answering `/health` | Make sure the container is `Up`: `docker compose ps`; check `docker compose logs app` |
| 🪟 `bash: ...` or *"WSL has no distributions"* | You used `bash` on Windows | Use **PowerShell** + `pwsh scripts/clase.ps1`, or `docker compose up` directly |
| 🪟 `curl` shows something weird | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe`, or open the URL in your browser |

Want a terminal where **all** the Linux commands work as-is?
→ [Real Linux terminal with WSL2](guias/terminal-linux-wsl.en.md).
