> 🌐 **English** · [Español](04-devsecops-trivy.md)

# 🎯 Step-by-step guide — Lab 4: Security scanning with Trivy

> **Mission:** scan the app image, read the vulnerability report, and decide what to fix first.
> **XP:** +90 · **Badge:** 🛡️ *Shift-Left Guardian* · **Time:** ~25 min · **Difficulty:** ★★☆

## 🎒 Before you start

Make sure you have the following ready:

- **Docker** running and the course image already built. If you don't have it yet:
  ```bash
  bash scripts/build-image.sh 1.0.0
  ```
  > 🪟 **Windows (PowerShell):** `pwsh scripts/build-image.ps1 1.0.0`
- **Trivy** installed (Aqua Security's scanner):
  ```bash
  # macOS
  brew install trivy
  # Windows
  winget install AquaSecurity.Trivy
  # Linux and others: https://trivy.dev/latest/getting-started/installation/
  ```
- A terminal open at the **repo root** (`devops-contenedores-kubernetes-curso/`).

> 💡 The **first** time you scan, Trivy downloads its vulnerability database (a few seconds).
> Seeing a line like `Need to update DB` or `Downloading DB...` is normal.

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

## 🧭 What you'll achieve

By the end of this lab you'll:

1. Scan the `academia-devops-app:1.0.0` image, filtering only the serious stuff (CRITICAL/HIGH).
2. **Understand the report**: vulnerable package, CVE, severity, and the version that fixes it.
3. Learn the golden rule of *shift-left*: **prioritize CRITICAL/HIGH issues that already have a patch**.
4. Internalize that the tool **detects**, but the **human decides**.

## 👣 Steps

### Step 1 — Confirm the image exists

Before scanning, check that the image is in your local Docker.

```bash
docker images academia-devops-app
```

**What you'll see:**

```
REPOSITORY            TAG       IMAGE ID       CREATED         SIZE
academia-devops-app   1.0.0     7f3a9c2b1d4e   2 minutes ago   180MB
```

**What happened?** Docker confirms that the `academia-devops-app:1.0.0` image is available locally. If it doesn't show up, rebuild it with `bash scripts/build-image.sh 1.0.0`.

### Step 2 — Scan only the serious stuff (CRITICAL and HIGH)

We run Trivy against the image, but filtering to see **only what matters first**. A full report is noisy; we start with what actually hurts.

```bash
trivy image --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

**What you'll see:**

```
academia-devops-app:1.0.0 (alpine 3.24.0)
==========================================
Total: 2 (HIGH: 2, CRITICAL: 0)

┌────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬──────────────────────────────────────┐
│  Library   │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │                Title                 │
├────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼──────────────────────────────────────┤
│ libcrypto3 │ CVE-2025-xxxxx │ HIGH     │ fixed  │ 3.5.6-r0          │ 3.5.7-r0      │ openssl: vulnerability in ...        │
├────────────┤                │          │        │                   │               │                                      │
│ libssl3    │                │          │        │                   │               │                                      │
└────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴──────────────────────────────────────┘

Node.js (node-pkg)
==================
Total: 1 (HIGH: 1)

┌───────────────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬──────────────────────────────┐
│        Library        │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │            Title             │
├───────────────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼──────────────────────────────┤
│ picomatch             │ CVE-2025-xxxxx │ HIGH     │ fixed  │ 4.0.2             │ 4.0.4         │ picomatch: ReDoS in ...      │
│ (package.json)        │                │          │        │                   │               │                              │
└───────────────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴──────────────────────────────┘
```

**What happened?** Trivy analyzed the image across **two distinct layers**, which is why there are **two blocks**:

- **`academia-devops-app:1.0.0 (alpine 3.24.0)`** → the container's **operating system** (Alpine). It found **2 HIGH**: `libcrypto3` and `libssl3`, both from **OpenSSL**. They're at `3.5.6-r0` and the patch is `3.5.7-r0`. `Status: fixed` means a **corrected version already exists**.
- **`Node.js (node-pkg)`** → your app's **dependencies** (what lives in `package.json`). It found **1 HIGH**: `picomatch`, installed at `4.0.2`, patch at `4.0.4`.

### Step 3 — Keep only what's actionable

A vulnerability with no patch available can't be fixed by updating. Filter to see **only what has a fix**, which is what you can actually act on today.

```bash
trivy image --ignore-unfixed --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

**What you'll see:**

```
academia-devops-app:1.0.0 (alpine 3.24.0)
==========================================
Total: 2 (HIGH: 2, CRITICAL: 0)
...
Node.js (node-pkg)
==================
Total: 1 (HIGH: 1)
...
```

**What happened?** In this case all **3 vulnerabilities already have a patch** (`Status: fixed`), so the list doesn't change. The `--ignore-unfixed` flag is your best friend in a pipeline: it keeps the team from drowning chasing things that **can't be fixed yet**.

### Step 4 — Bonus: scan the code and the Kubernetes YAML

Trivy isn't just for images. Try it against your source code and your manifests.

```bash
# Code dependencies (reads package.json / lockfiles, not the image)
trivy fs 01-app/node

# Misconfigurations in the Kubernetes manifests
trivy config 05-kubernetes/

# Hardcoded secrets in the image (the classic DB_PASSWORD!)
trivy image --scanners secret academia-devops-app:1.0.0
```

**What happened?** Same engine, three different attack surfaces: dependencies (`fs`), configuration (`config`), and leaked secrets (`--scanners secret`). That's end-to-end *shift-left* coverage.

## ✅ Checkpoint

You've nailed the lab if you can answer **without looking again**:

- [ ] The report split into **two sections**: one for the OS (`alpine 3.24.0`) and one for Node.js (`node-pkg`).
- [ ] The Alpine section showed **Total: 2 (HIGH: 2, CRITICAL: 0)** — `libcrypto3` and `libssl3` (OpenSSL), fix in `3.5.7-r0`.
- [ ] The Node section showed **Total: 1 (HIGH: 1)** — `picomatch`, fix in `4.0.4`.
- [ ] You know what `--ignore-unfixed` does and why it prioritizes **CRITICAL/HIGH with a "Fixed Version"**.

## 🧯 If something breaks

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| `trivy: command not found` | Trivy isn't installed or not on PATH | Reinstall (`brew`/`winget`) and reopen the terminal |
| `unable to find the specified image` | The image doesn't exist locally | `bash scripts/build-image.sh 1.0.0` and retry |
| Stuck on `Downloading DB...` | First run / slow network | Wait; it downloads the CVE database once |
| `Total: 0` everywhere | You scanned another image or a different tag | Confirm the exact name `academia-devops-app:1.0.0` |
| Very slow | Large image or empty cache | Normal the first time; the second run uses the cache |
| 🪟 *"Windows Subsystem for Linux has no distributions installed"* | You used `bash` on Windows (it points to WSL) | Use `pwsh scripts/build-image.ps1 1.0.0` — see [cheat sheet](windows-powershell.en.md) |
| 🪟 `curl` returns a weird/long response | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe` (with `.exe`) or open the URL in the browser |

## 🏆 Extra challenge

1. Build the **insecure** version and compare:
   ```bash
   docker build -f 02-docker/Dockerfile.insecure -t academia-app:insecure 01-app/node
   trivy image --severity CRITICAL,HIGH academia-app:insecure
   ```
   How many more HIGH/CRITICAL show up versus the good image?
2. Hunt the **hardcoded secret**: `trivy image --scanners secret academia-app:insecure` and locate `DB_PASSWORD`.
3. Produce a JSON report for your pipeline:
   ```bash
   trivy image --format json --output report.json --severity CRITICAL,HIGH academia-devops-app:1.0.0
   ```

## 🎓 How to teach it to your students

- **Open with the *shift-left* metaphor**: fixing a bug in code takes minutes; fixing it in production costs you a late night. Trivy moves the review "to the left" of the flow.
- **Read the report out loud column by column**: *Library* (which package), *Vulnerability* (which CVE), *Severity* (how serious), *Fixed Version* (how to fix it). Get those four and you've got 90% of it.
- **Hammer home one idea**: the tool **detects**, the engineer **decides**. Trivy doesn't know whether the vuln is exploitable in *your* case, nor your business logic. That's human judgment.
- **Make them prioritize**: hand them the report and ask "what do you fix first?". The right answer is **CRITICAL/HIGH with a Fixed Version**, because it's serious **and** actionable.
- **Close with the contrast**: run the good image vs. the insecure one side by side. Seeing the difference in numbers convinces more than any slide.

## ⏭️ Next

You now know how to catch problems **before** deploying. Next, take the app to a real cluster:
**[Lab 5 — Deploying to Kubernetes](05-kubernetes-despliegue.en.md)** ☸️.
