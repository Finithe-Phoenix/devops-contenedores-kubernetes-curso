> 🌐 **English** · [Español](pipeline-explicado.md)

# ⚙️ Lab 3 — CI/CD: the pipeline explained

> **Mission:** get the pipeline to **green**. **Reward:** +130 XP and the ⚙️ *Automator* badge.

## The idea: an assembly line for your code

```
   commit  ─►  CHECKOUT ─► INSTALL ─► TEST ─► BUILD IMAGE ─► SCAN ─►  (deploy)
                  │           │         │          │           │
              fetch code    deps     tests      Docker      security
```

Every time someone pushes code, a clean machine repeats **exactly** the same
steps. If something fails, the commit is marked **red** and goes no further. That's **Continuous Integration**.

## Anatomy (vocabulary)

| Term | What it is | In our `ci.yml` |
| ------- | ------ | ------------------- |
| **Workflow** | The complete pipeline | `name: CI Pipeline` |
| **Trigger** (`on`) | The event that fires it | `push` and `pull_request` to `main` |
| **Job** | A set of steps on one machine | `build-test-scan` |
| **Runner** | The ephemeral machine that executes | `ubuntu-latest` |
| **Step** | An individual action | checkout, test, build... |
| **Action** (`uses`) | Reusable step from the community | `actions/checkout@v4` |

## Where is the file?

- **The one that runs:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (GitHub requires that path).
- **The commented copy for class:** [`github-actions/ci.yml`](github-actions/ci.yml).
- **The enterprise route:** [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile).

## CI vs CD

- **CI (Continuous Integration):** build + test **every change** automatically. ← that's what we do today.
- **CD (Continuous Delivery/Deployment):** take the already-tested image to an environment
  (publish to the registry and deploy). ← we wire this up on the Kubernetes day.

## Mission challenge (cause a red and fix it)

1. Break a test on purpose (change an `assert`) and push → watch the pipeline go **red**.
2. Fix it and push again → **green**.
3. **Teaching question:** what validations SHOULD your students' code pass before being accepted?

## ❗ Common errors

| Symptom | Cause | Fix |
| ------- | ----- | -------- |
| `npm ci` fails | Missing `package-lock.json` in the commit | Make sure to version it |
| The job doesn't start | Wrong branch in `on:` | It must match your branch (`main`) |
| Tests pass locally but fail in CI | Dependency on the local environment | The runner is clean: everything must be declared |
| Trivy "breaks" the build | `exit-code: 1` | In class we use `0`; in prod, `1` to block |
