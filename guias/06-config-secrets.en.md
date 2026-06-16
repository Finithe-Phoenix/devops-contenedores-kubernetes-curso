> 🌐 **English** · [Español](06-config-secrets.md)

# 🎯 Step-by-step guide — Lab 6: ConfigMap and Secret

| | |
| --- | --- |
| **Mission** | 🔐 Keeper of Secrets — externalize the app's configuration |
| **XP** | +70 XP |
| **Badge** | 🔐 Keeper of Secrets |
| **Time** | ~25 min |
| **Difficulty** | ★★☆ |

In this lab you'll separate **configuration** from **code**. Instead of hardcoding values
inside the image, you'll store them in a **ConfigMap** (non-sensitive data) and a **Secret**
(sensitive data), then inject them into your Pod as environment variables.

## 🎒 Before you start

- ✅ Have the **Lab 5 cluster running** (kind `devops-course`) with the image
  `academia-devops-app:1.0.0` already loaded.
- ✅ The **`academia` namespace** created and the `academia-app` deployment deployed.
- ✅ `kubectl` pointing at the right cluster.

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

Quickly confirm everything is still up:

```bash
kubectl -n academia get deployments,pods
```

**What you'll see:**

```
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/academia-app   2/2     2            2           5m

NAME                                READY   STATUS    RESTARTS   AGE
pod/academia-app-7c9f8d6b54-abcde   1/1     Running   0          5m
pod/academia-app-7c9f8d6b54-fghij   1/1     Running   0          5m
```

> If this doesn't show up, go back to Lab 5 and redeploy before continuing.

## 🧭 What you'll achieve

- Create a **ConfigMap** with non-sensitive config (`APP_ENV`, `APP_VERSION`).
- Create a **Secret** with sensitive data (`DB_USER`, `DB_PASSWORD`).
- Understand why a Secret shows up as **base64** and why **base64 is NOT encryption**.
- Inject the ConfigMap into the deployment with `envFrom` and verify the app reads it.

## 👣 Steps

### Step 1 — Create the ConfigMap

The ConfigMap holds **non-sensitive** configuration. It can be plain text and versioned in git.

```bash
kubectl apply -f 05-kubernetes/configmap.yaml
```

**What you'll see:**

```
configmap/academia-config created
```

**What happened?** Kubernetes stored a `ConfigMap` object named `academia-config` in the
`academia` namespace with two keys: `APP_ENV=training` and `APP_VERSION=1.0.0`.

### Step 2 — Verify the ConfigMap

```bash
kubectl -n academia get configmap academia-config
```

**What you'll see:**

```
NAME              DATA   AGE
academia-config   2      10s
```

**What happened?** The **`DATA 2`** column confirms the ConfigMap has **2 keys**
(`APP_ENV` and `APP_VERSION`). To see the values: `kubectl -n academia get configmap academia-config -o yaml`.

### Step 3 — Create the Secret

The Secret holds **sensitive** data. We use `stringData` (plain text) only so it can be
**read in class**; Kubernetes encodes it to base64 when storing it.

```bash
kubectl apply -f 05-kubernetes/secret-example.yaml
```

**What you'll see:**

```
secret/academia-secret created
```

**What happened?** An `Opaque` Secret `academia-secret` was created with `DB_USER` and
`DB_PASSWORD`. Kubernetes stores those values **base64-encoded**.

### Step 4 — Read the Secret in base64

```bash
kubectl -n academia get secret academia-secret -o jsonpath='{.data.DB_PASSWORD}'
```

**What you'll see:**

```
YWNhZGVtaWE=
```

**What happened?** The value **doesn't appear in plain text**, it appears **base64-encoded**.
It looks "protected"... but it isn't. We'll prove it in the next step.

### Step 5 — Prove that base64 is NOT encryption 🔓

```bash
echo YWNhZGVtaWE= | base64 -d
```

**What you'll see:**

```
academia
```

**What happened?** 🔑 **Key teaching point:** anyone can decode base64 with one command.
**base64 is encoding, NOT encryption** — it protects nothing, it just changes the format.
That's why a Secret **must NOT be committed to git** in plain text or base64. In the real
world you use **Sealed Secrets**, **External Secrets**, or **Vault**, or your cloud
provider's secret manager.

### Step 6 — Consume the ConfigMap from the deployment

The deployment (`05-kubernetes/deployment.yaml`) already injects the ConfigMap with `envFrom`:

```yaml
envFrom:
  - configMapRef:
      name: academia-config     # injects APP_ENV and APP_VERSION as variables
```

Apply (or re-apply) it so the Pod picks up the configuration:

```bash
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl -n academia rollout status deployment/academia-app
```

**What you'll see:**

```
deployment.apps/academia-app configured
deployment "academia-app" successfully rolled out
```

**What happened?** With `envFrom: configMapRef`, **all** keys of the ConfigMap are injected
as environment variables into the container, without listing them one by one.

### Step 7 — Verify the app reads the configuration

Open a port-forward and query the `/version` endpoint:

```bash
kubectl -n academia port-forward service/academia-app-service 8080:80
# in another terminal:
curl http://localhost:8080/version
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/version` (with `.exe`; in PowerShell `curl` is a different command)

**What you'll see:**

```
{"version":"1.0.0"}
```

**What happened?** The app reports `APP_VERSION=1.0.0`, **which comes from the ConfigMap**
(it's not hardcoded). Changing the version is now editing one line of the ConfigMap, not
rebuilding the image. 🎉

## ✅ Checkpoint

You've completed the lab if:

- [ ] `kubectl -n academia get configmap academia-config` shows **`DATA 2`**.
- [ ] The Secret shows `DB_PASSWORD` as **`YWNhZGVtaWE=`** (base64).
- [ ] `echo YWNhZGVtaWE= | base64 -d` returns **`academia`**.
- [ ] `curl .../version` returns **`1.0.0`**, read from the ConfigMap.

If you ticked all 4 boxes: 🔐 **Keeper of Secrets badge unlocked! +70 XP**

## 🧯 If something fails

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Error from server (NotFound): namespaces "academia" not found` | The namespace doesn't exist | Go back to Lab 5: `kubectl apply -f 05-kubernetes/namespace.yaml` |
| `configmap "academia-config" not found` when deploying | You applied the deployment before the ConfigMap | Apply `configmap.yaml` first, then the deployment |
| `base64: invalid input` | You copied the value with spaces or line breaks | Copy exactly `YWNhZGVtaWE=` with no spaces |
| `/version` doesn't respond | The port-forward closed or the Pod isn't `Running` | Check `kubectl -n academia get pods` and reopen the port-forward |
| Pods still serve the old version | The deployment wasn't re-applied | `kubectl apply -f 05-kubernetes/deployment.yaml` and wait for the rollout |
| 🪟 *"Windows Subsystem for Linux has no installed distributions"* | You used `bash` on Windows (points to WSL) | Use `pwsh ...ps1` instead — see the [cheat sheet](windows-powershell.en.md) |
| 🪟 `curl` shows a weird/long response | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe` (with `.exe`) or open the URL in the browser |

## 🏆 Extra challenge (+10 XP)

Create your **own** Secret straight from the command line (no YAML file) and decode it to
confirm again that base64 protects nothing:

```bash
kubectl -n academia create secret generic my-secret \
  --from-literal=API_KEY=supersecret123
kubectl -n academia get secret my-secret -o jsonpath='{.data.API_KEY}' | base64 -d
```

Ask yourself: if this is this easy, **where should production secrets really live?**

## 🎓 How to teach it to your students

- **The big idea:** separate *what the app does* (code/image) from *how it's configured*
  (ConfigMap/Secret). Same image in dev, QA, and prod; only the config changes.
- **The "aha" moment:** decoding the base64 live. Students assume a Secret is "encrypted".
  Watching it turn into `academia` with one command changes their mental model.
- **Discussion question:** *what goes in a ConfigMap and what goes in a Secret?* (Rule: if
  you'd be scared to see it in a screenshot, it's a Secret.)
- **Productive mistake:** have them apply the deployment **before** the ConfigMap so they see
  the `configmap not found` error — that's how they grasp dependency order.
- **Honest closer:** a Kubernetes Secret gives you access control (RBAC), not encryption by
  itself. Mention Sealed Secrets/Vault as the real "next level".

## ⏭️ Next

➡️ **Lab 7 — 📈 Live Operator:** [scale, update, and roll back](07-escalar-rollback.en.md).
Now that your app has external configuration, you'll operate it live: scale up replicas,
do a zero-downtime rolling update, and roll back a bad version.
