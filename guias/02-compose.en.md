> 🌐 **English** · [Español](02-compose.md)

# 🎯 Step-by-step guide — Lab 2: app + PostgreSQL with Docker Compose

**Mission:** bring up the app WITH its database in a single command · **XP:** +120 · **Badge:** 🧩 Multi-container Master · **Time:** ~25 min · **Difficulty:** ★★☆

## 🎒 Before you start

- Have **Docker Desktop** open and running (`docker version` should respond).
- Have finished **Lab 1** (the app running on its own with an in-memory store). Here we give it a real database.
- A terminal open. We'll work **inside the `03-compose/` folder**.
- `curl` available (ships with Windows 10/11, macOS and Linux).

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

> 💡 Key idea of this lab: **the same image from Lab 1 does not change**. We only pass it environment variables (`DB_HOST`, etc.) and, thanks to that, it now talks to PostgreSQL. That's configuration-by-environment (12-factor).

## 🧭 What you'll achieve

- Bring up **two containers** (app + Postgres) with a single `docker compose up`.
- See how the app finds the database **by its service name** (`db`), no IPs involved.
- Confirm that `/health` now reports `store: postgres`.
- Demonstrate the star of the lab: **persistence**. You restart the app and the data is **still there** because it lives in a volume.

## 👣 Steps

### Step 1 — Enter the lab folder

```bash
cd 03-compose
```

**What you'll see:**

```
(the prompt now shows the path .../03-compose)
```

**What happened?** Every Compose command looks for a `docker-compose.yml` in the current folder. Ours lives here, so we stand inside `03-compose/`.

### Step 2 — Bring up the app + the database

```bash
docker compose up -d --build
```

**What you'll see:**

```
[+] Running 3/3
 ✔ Network academia-devops_default      Created
 ✔ Container academia-devops-db-1       Healthy
 ✔ Container academia-devops-app-1      Started
```

**What happened?** Compose built the app image (`--build`), started Postgres **first** and **waited** until it was *Healthy*. Only then did it start the app. That's done by `depends_on: condition: service_healthy`. The `-d` leaves it running in the background.

### Step 3 — Confirm both services are healthy

```bash
docker compose ps
```

**What you'll see:**

```
NAME                      IMAGE                       STATUS
academia-devops-app-1     academia-devops-app:1.0.0   Up (healthy)
academia-devops-db-1      postgres:16-alpine          Up (healthy)
```

**What happened?** Both containers show as `Up (healthy)`. The app and the database now share the same internal network that Compose created automatically.

### Step 4 — Check the app now talks to PostgreSQL

```bash
curl http://localhost:8080/health
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/health` (with `.exe`; in PowerShell `curl`
> is a different command). Or open **http://localhost:8080/health** in the browser.

**What you'll see:**

```json
{"status":"UP","store":"postgres","db":"ok","uptime_s":11}
```

**What happened?** Notice `"store":"postgres"`! In Lab 1 it said `memory`. Here the app detected the `DB_HOST=db` variable, connected to Postgres, and the database `ping` answered (`"db":"ok"`). Same app, different config.

### Step 5 — See the seed courses

```bash
curl http://localhost:8080/courses
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/courses`

**What you'll see:**

```json
[{"id":1,"code":"DEVOPS-101","name":"Fundamentos de DevOps","professor":"Daniel Gonzalez"},
 {"id":2,"code":"DOCKER-201","name":"Contenedores con Docker","professor":"Daniel Gonzalez"},
 {"id":3,"code":"K8S-301","name":"Orquestacion con Kubernetes","professor":"Daniel Gonzalez"}]
```

**What happened?** On first run, the app created the `courses` table in Postgres and seeded it with 3 courses. This data now lives **in the database**, not in memory.

### Step 6 — Create a new course (the one we'll put to the test)

```bash
curl -X POST http://localhost:8080/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"PERSIST-1","name":"Sobrevive al reinicio"}'
```

> 🪟 **Windows (PowerShell):** on a single line (the `\` backslash does not continue lines in PowerShell):
> `curl.exe -X POST http://localhost:8080/courses -H "Content-Type: application/json" -d '{"code":"PERSIST-1","name":"Sobrevive al reinicio"}'`

**What you'll see:**

```json
{"id":4,"code":"PERSIST-1","name":"Sobrevive al reinicio","professor":null}
```

**What happened?** Postgres assigned `id:4` (the seed ones were 1–3). We didn't send `professor`, so it landed as `null`. This course is our "guinea pig" for the persistence test.

### Step 7 — The star demo: restart the app

```bash
docker compose restart app
```

**What you'll see:**

```
[+] Restarting 1/1
 ✔ Container academia-devops-app-1  Started
```

**What happened?** We restarted **only the app container** (not the database). If the data lived inside the app, it would be lost. Let's confirm it isn't.

### Step 8 — Confirm the course is STILL there

```bash
curl http://localhost:8080/courses
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/courses`

**What you'll see:**

```json
[{"id":1,"code":"DEVOPS-101","name":"Fundamentos de DevOps","professor":"Daniel Gonzalez"},
 {"id":2,"code":"DOCKER-201","name":"Contenedores con Docker","professor":"Daniel Gonzalez"},
 {"id":3,"code":"K8S-301","name":"Orquestacion con Kubernetes","professor":"Daniel Gonzalez"},
 {"id":4,"code":"PERSIST-1","name":"Sobrevive al reinicio","professor":null}]
```

**What happened?** 🎉 `PERSIST-1` is **still in the list** after restarting the app! The data didn't live in the app: it lives in the **`db_data` volume** mounted on Postgres. That's the difference between an ephemeral container and persistent data.

### Step 9 — (Optional) Open the web UI

Open in your browser: **http://localhost:8080/**

**What you'll see:**

```
The Academia DevOps web UI listing the courses (PERSIST-1 included).
```

**What happened?** The app also serves a visual interface from `public/`. It's the same data you saw via `curl`, but prettier.

## ✅ Checkpoint

You've completed the lab if:

- [ ] `docker compose ps` shows **app and db** as `Up (healthy)`.
- [ ] `curl /health` responds `"store":"postgres"` and `"db":"ok"`.
- [ ] You created `PERSIST-1` and got `"id":4`.
- [ ] After `docker compose restart app`, `PERSIST-1` was **still** in `/courses`.

## 🧯 If something breaks

| Symptom | Cause | Fix |
| ------- | ----- | -------- |
| `/health` says `"db":"down"` | The app started before the DB | We already prevent this with `condition: service_healthy`; check credentials in `docker-compose.yml` |
| `port 5432 already allocated` | You have a local PostgreSQL running | Shut it down, or remove the `ports:` line from the `db` service |
| `port 8080 already allocated` | Another app uses 8080 | Close that app or change the mapping to `"8081:8080"` |
| `store` still says `memory` | The app didn't receive `DB_HOST` | Check the `environment:` of the `app` service; rebuild with `up -d --build` |
| Unexpected "old" data | The volume persisted from a previous run | `docker compose down -v` to start clean |
| `app` can't resolve `db` | Typo in `DB_HOST` | It must be **exactly** the service name (`db`) |
| 🪟 *"Windows Subsystem for Linux has no distributions installed"* | You used `bash` on Windows (it points to WSL) | Use `pwsh ...ps1` or the `docker`/`kubectl` command directly — see [cheat sheet](windows-powershell.en.md) |
| 🪟 `curl` shows a weird/long response | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe` or open the URL in the browser |

> When you're done and want to clean up: `docker compose down` (keeps the volume) or `docker compose down -v` (also deletes the data).

## 🏆 Extra challenge (+30 XP)

1. Run `docker compose down` (no `-v`) and then `docker compose up -d` again.
2. Query `curl http://localhost:8080/courses`.
3. Is `PERSIST-1` still there? **Yes**, because `down` without `-v` **keeps** the `db_data` volume.
4. Now run `docker compose down -v`, bring it back up and query again. `PERSIST-1` is **gone**: with `-v` you deleted the volume and the database re-seeded with just the 3 courses.

> Explain in one sentence the difference between `down` and `down -v`. If you nail it, you've mastered volumes.

## 🎓 How to teach it to your students

- **Start from the "pain":** show Lab 1 first with the in-memory store. Create a course, restart the container and... it's gone. That emotional jolt makes persistence click on its own.
- **One word changes everything:** highlight that the image is **identical** to Lab 1's. The only new thing is `DB_HOST`. It's the best demonstration of "config by environment".
- **The visible trick:** ask one student to run `docker compose restart app` live while another has `curl /courses` ready. The collective "it's still there!" beats ten slides.
- **Draw the network:** an "app" box and a "db" box joined by an arrow that says `db` (not an IP). That's how they grasp Compose's internal DNS.
- **Trick question:** "where does the data live?" The right answer isn't "in Postgres" but "in the **volume** Postgres mounts". That nuance sets the stage for Kubernetes.

## ⏭️ Next

➡️ [Lab 3 guide — CI/CD: pipeline to green](03-cicd.en.md)
