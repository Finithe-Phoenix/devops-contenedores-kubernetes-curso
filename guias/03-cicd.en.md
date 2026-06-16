> 🌐 **English** · [Español](03-cicd.md)

# 🎯 Step-by-step guide — Lab 3: CI/CD pipeline to green

**Mission:** get the GitHub Actions pipeline to **green** · **XP:** +130 · **Badge:** ⚙️ Automator · **Time:** ~30 min · **Difficulty:** ★★☆

## 🎒 Before you start

- A **GitHub account** and `git` installed (`git --version` should respond).
- The course repository on GitHub. The reference one is: **https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso** (check the **Actions** tab).
- Have completed **Lab 2**: you already understand that the image gets built and the app gets tested.
- You don't need to install anything else: the pipeline runs on **GitHub's machines** (runners), not your PC.

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

> 💡 Key idea: every time you `git push`, a **clean machine** repeats exactly the same steps (install → test → build → scan). If something fails, the commit is marked **red**. That's **Continuous Integration (CI)**.

## 🧭 What you'll achieve

- Understand `.github/workflows/ci.yml` step by step.
- Make a `push` and watch the pipeline go **green in ~30 seconds**.
- Deliberately cause a **red** by breaking a test, then **fix it** to return to green.
- Walk away able to read the **Actions** panel like a pro.

## 👣 Steps

### Step 1 — Meet the file that governs everything

```bash
cat .github/workflows/ci.yml
```

**What you'll see:**

```yaml
name: CI Pipeline
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
jobs:
  build-test-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4   # Node 22
      - run: npm ci
      - run: npm test
      - run: docker build -t academia-devops-app:${{ github.sha }} .
      - run: trivy image ... --exit-code 0   # security scan (doesn't break the build)
```

**What happened?** You read your code's "assembly line". It fires on every `push` and every `pull_request` to `main`, runs on `ubuntu-latest`, and chains 5 steps: **checkout → npm ci → npm test → docker build → trivy**.

### Step 2 — Make sure your changes are committed

```bash
git status
```

**What you'll see:**

```
On branch main
nothing to commit, working tree clean
```

**What happened?** We confirmed there are no unsaved changes. A clean tree means what's on GitHub is exactly what the pipeline will test.

### Step 3 — Trigger the pipeline with a push

```bash
git commit --allow-empty -m "ci: trigger pipeline"
git push origin main
```

**What you'll see:**

```
To github.com:Finithe-Phoenix/devops-contenedores-kubernetes-curso.git
   a1b2c3d..e4f5g6h  main -> main
```

**What happened?** We pushed a commit (empty, just to trigger). As soon as GitHub receives it, it launches the `CI Pipeline` workflow automatically. No turning back now: the clean machine started working.

### Step 4 — Watch the pipeline turn green

Open the repo's **Actions** tab in your browser:
**https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/actions**

**What you'll see:**

```
✔ CI Pipeline · Build · Test · Scan        success   ~30s
   ✔ Checkout del codigo
   ✔ Configurar Node.js 22
   ✔ Instalar dependencias (npm ci)
   ✔ Ejecutar pruebas        ✓ tests 8/8 passing
   ✔ Construir imagen Docker
   ✔ Escanear imagen con Trivy
```

**What happened?** 🎉 The pipeline went **green in ~30s**. The 8 tests passed (`8/8`), the image was built, and Trivy scanned the image reporting without breaking the build (`--exit-code 0`). That's CI working.

### Step 5 — Break a test on purpose (cause the RED)

Open `01-app/node/test/app.test.js` and change an `assert` so it fails. For example, in the `/health` test:

```js
// Change the expected status code to a wrong one on purpose:
assert.equal(res.status, 500); // 👈 should be 200 — this will break the test
```

Then commit and push:

```bash
git commit -am "test: break an assert on purpose"
git push origin main
```

**What you'll see (in Actions):**

```
✘ CI Pipeline · Build · Test · Scan        failure   ~20s
   ✔ Instalar dependencias (npm ci)
   ✘ Ejecutar pruebas        ✗ tests 7/8  (1 failed)
   ⊘ Construir imagen Docker   (skipped: a previous step failed)
```

**What happened?** The `npm test` step failed, so the job stopped **red** and **did not** build the image. That's the magic of CI: broken code **never advances**. The red light protects your `main` branch.

### Step 6 — Fix it (back to GREEN)

Revert the `assert` to its correct value:

```js
assert.equal(res.status, 200); // 👈 restored: the test passes again
```

Commit and push again:

```bash
git commit -am "fix: restore the correct assert"
git push origin main
```

**What you'll see (in Actions):**

```
✔ CI Pipeline · Build · Test · Scan        success   ~30s
   ✔ Ejecutar pruebas        ✓ tests 8/8 passing
```

**What happened?** With the correct `assert`, all 8 tests pass again and the pipeline returns to **green**. You just lived the full CI cycle: red → diagnose → fix → green. That's exactly what you'll do daily on a real team.

## ✅ Checkpoint

You've completed the lab if:

- [ ] You saw your workflow **green in ~30s** in the Actions tab.
- [ ] The test step reported **8/8** tests passing.
- [ ] You broke a test and saw the pipeline go **red** (and the image was NOT built).
- [ ] You fixed the `assert` and the pipeline returned to **green**.

## 🧯 If something breaks

| Symptom | Cause | Fix |
| ------- | ----- | -------- |
| `npm ci` fails | Missing `package-lock.json` in the commit | Make sure to version it (`git add package-lock.json`) |
| The job doesn't start | Wrong branch in `on:` | It must match your branch; the workflow listens on `main` |
| Tests pass locally but fail in CI | Dependency on the local environment | The runner is **clean**: everything must be declared in the repo |
| I see no run in Actions | You pushed to another branch | The trigger is `push`/`pull_request` to `main` |
| Trivy "breaks" the build | `exit-code: 1` | In class we use `0` (reports without blocking); in prod, `1` to block |
| `docker build` fails in CI | Error in the `Dockerfile` or `.dockerignore` | Reproduce locally: `cd 01-app/node && docker build -t test .` |

## 🏆 Extra challenge (+30 XP)

Turn the security scan into a **real gatekeeper**:

1. In `.github/workflows/ci.yml`, change `--exit-code 0` to `--exit-code 1` in the Trivy step.
2. Push and watch what happens in Actions.
3. If Trivy finds a CRITICAL/HIGH vulnerability **with a fix available**, the build will now go **red**.
4. Decide in class: would you block the merge over vulnerabilities, or just report them? Justify it. (On real `main`, the common choice is to **block**.)

> Bonus: explore the **enterprise route** in `04-cicd/jenkins/Jenkinsfile`. It has exactly the same stages (Checkout → Install → Test → Docker Build → Security Scan), but in Jenkins syntax. Compare both and you'll see that CI/CD is a **concept**, not a tool.

## 🎓 How to teach it to your students

- **The traffic light explains everything:** green = go, red = stop. Before showing YAML, draw the assembly line `commit → install → test → build → scan`. Concept first; syntax later.
- **Cause the red live:** break an `assert` in front of the class and push. Watching the pipeline fall red in real time is a thousand times more memorable than explaining it.
- **"The clean machine":** insist that the runner is ephemeral and has none of your local config. That's why "works on my machine" doesn't fly: if it's not in the repo, it doesn't exist for CI.
- **CI vs CD:** clarify that today we only do **CI** (build + test every change). **CD** (deploying the tested image) gets wired up on the Kubernetes day. Don't mix them early.
- **Teaching question:** "what validations SHOULD your students' code pass before being accepted?" (tests, lint, scan, formatting...). Let them design their own ideal pipeline.

## ⏭️ Next

Your pipeline already tests and builds on every change. The next step is to harden security before deploying:
➡️ **[Lab 4 guide — DevSecOps with Trivy](04-devsecops-trivy.en.md)** 🛡️.
