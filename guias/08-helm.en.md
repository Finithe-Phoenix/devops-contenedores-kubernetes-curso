> 🌐 **English** · [Español](08-helm.md)

# 🎯 Step-by-step guide — Lab 8: Package with Helm

| | |
| --- | --- |
| **Mission** | 🎁 Helm Packager — turn your manifests into a parameterizable chart |
| **XP** | +100 XP |
| **Badge** | 🎁 Helm Packager |
| **Time** | ~30 min |
| **Difficulty** | ★★☆ |

Until now you deployed with `kubectl apply -f`, file by file. In this lab you'll **package
everything into a Helm chart**: a single versioned bundle you install, upgrade and uninstall
with one command, and whose values you can change **without touching the templates**.

## 🎒 Before you start

- ✅ The **Lab 5 cluster running** (kind `devops-course`) with the image
  `academia-devops-app:1.0.0` already loaded (`kind load docker-image ...`).
- ✅ **Helm v3 installed** (`helm version` must return `v3.x`). You validated it in Lab 0.
- ✅ A terminal open at the **repo root** (commands use paths like `./06-helm/...`).

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

Quick check that Helm responds and the cluster is alive:

```bash
helm version
kubectl get nodes
```

**What you'll see:**

```
version.BuildInfo{Version:"v3.15.0", GitCommit:"...", GoVersion:"go1.22"}
NAME                         STATUS   ROLES           AGE   VERSION
devops-course-control-plane  Ready    control-plane   1h    v1.30.0
```

**What happened?** You confirmed you have the Helm client (Helm 3 needs no server) and a
cluster to install the chart into. If `kubectl get nodes` fails, go back to Lab 5 to create the cluster.

## 🧭 What you'll achieve

- Understand **why** Helm beats copy-pasted YAML across environments.
- **Validate** the chart without deploying (`helm lint`) and **render** the final YAML (`helm template`).
- **Install** the app as a Helm release in its own namespace.
- **Scale** to 3 replicas with `--set` without editing any file, and view the **revision history**.
- **Uninstall** everything cleanly with a single command and unlock 🎁 **Helm Packager**.

## 👣 Steps

### Step 1 — Understand what Helm solves

With manual YAML, to keep 3 environments (dev/qa/prod) you end up **copying and pasting** the
same manifests and changing values by hand. Helm turns them into a **parameterizable
template**: one chart, many deployments, governed by `values.yaml`.

| Task | Manual YAML | Helm |
| ---- | ----------- | ---- |
| Change replicas in 3 environments | Edit 3 files | `--set replicaCount=N` |
| Install everything | `kubectl apply -f` (one by one) | `helm install` (all together) |
| Update | apply and pray | `helm upgrade` (versioned) |
| Roll back | manual | `helm rollback` (1 command) |
| Reuse | copy/paste | one chart, many `values` |

Review the full comparison in [`../06-helm/comparativa-yaml-vs-helm.en.md`](../06-helm/comparativa-yaml-vs-helm.en.md).

**What happened?** You moved from thinking in "loose files" to thinking in a **package** with
its version, its parameters and its lifecycle (install → upgrade → roll back → uninstall).

### Step 2 — Get to know the chart structure

```bash
ls 06-helm/academia-app-chart
```

**What you'll see:**

```
Chart.yaml   values.yaml   templates/
```

The chart already shipped in the repo looks like this:

```text
academia-app-chart/
├── Chart.yaml           # metadata (name, chart and app version)
├── values.yaml          # the parameters (replicas, image, resources...)
└── templates/
    ├── _helpers.tpl     # reusable functions (names, labels)
    ├── configmap.yaml   # ConfigMap template
    ├── deployment.yaml  # Deployment template
    ├── service.yaml     # Service template
    └── NOTES.txt        # message Helm shows after installing
```

**What happened?** You spotted the **3 pieces** of every chart: `Chart.yaml` (identity),
`values.yaml` (parameters) and `templates/` (templates filled in with those values). The
`deployment.yaml`, for example, uses `replicas: {{ .Values.replicaCount }}`: it reads the
number from `values.yaml` instead of having it hard-coded.

### Step 3 — Validate the chart with `helm lint`

Before deploying anything, check the chart is well formed.

```bash
helm lint ./06-helm/academia-app-chart
```

**What you'll see:**

```
==> Linting ./06-helm/academia-app-chart
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

**What happened?** `helm lint` checked syntax and best practices. The `[INFO] ... icon is
recommended` is **just a suggestion** (add an icon to the chart), not an error. The line that
matters is `0 chart(s) failed`: the chart is healthy and ready to install.

### Step 4 — See the final YAML with `helm template`

Helm "fills in" the templates with the values and produces the real manifests. You can view
them without touching the cluster:

```bash
helm template academia ./06-helm/academia-app-chart
```

**What you'll see:** (excerpt — Helm prints the resolved YAML)

```yaml
# Source: academia-app/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: academia-app
spec:
  replicas: 2
  ...
```

**What happened?** Where the template said `{{ .Values.replicaCount }}` you now see `2` (the
default from `values.yaml`). That's how you confirm **what will be created** before creating
it: it's Helm's "preview".

### Step 5 — Install the chart

Create the release in its own namespace (Helm creates it for you with `--create-namespace`).

```bash
# Install command for the "academia" release
helm install academia ./06-helm/academia-app-chart -n academia --create-namespace
```

**What you'll see:**

```
NAME: academia
LAST DEPLOYED: Sun Jun 14 18:00:00 2026
NAMESPACE: academia
STATUS: deployed
REVISION: 1
NOTES:
🎁 Academia DevOps App desplegada con Helm.
  ...
```

**What happened?** Helm applied **all** the manifests together and registered a **release**
called `academia` with `STATUS: deployed` and `REVISION: 1` (your first version). The `NOTES`
block comes from `templates/NOTES.txt` and reminds you how to test the app.

### Step 6 — List the installed release

```bash
helm list -n academia
```

**What you'll see:**

```
NAME     	NAMESPACE	REVISION	UPDATED                 	STATUS  	CHART              	APP VERSION
academia 	academia 	1       	2026-06-14 18:00:00 ... 	deployed	academia-app-0.1.0 	1.0.0
```

**What happened?** Helm shows the release with its **chart version** (`academia-app-0.1.0`,
from `Chart.yaml: version`) and the **app version** (`1.0.0`, from `appVersion`). They're two
different things: the chart can change without the app changing, and vice versa.

### Step 7 — Test the app

```bash
kubectl -n academia port-forward svc/academia-app-service 8080:80
# in another terminal:
curl http://localhost:8080/health
```

> 🪟 **Windows (PowerShell):** the last line is `curl.exe http://localhost:8080/health` (with `.exe`; in
> PowerShell `curl` is a different command). The `port-forward` is typed the same.

**What you'll see:**

```
{"status":"UP","store":"memory","db":"ok","uptime_s":12}
```

**What happened?** The Service the chart created routes traffic to the Pods. The `/health`
endpoint (the same one the probes use) answers `UP`: the app deployed with Helm works just
like the one deployed by hand, but now it's a **versioned package**.

### Step 8 — The headline demo: scale with `--set`

Bump to **3 replicas without editing any YAML**, just passing the value on the command line.

```bash
# Upgrade the release overriding replicaCount
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=3
```

**What you'll see:**

```
Release "academia" has been upgraded. Happy Helming!
NAME: academia
NAMESPACE: academia
STATUS: deployed
REVISION: 2
```

Check the Pods:

```bash
kubectl -n academia get pods
```

**What you'll see:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-aaaaa   1/1     Running   0          2m
academia-app-7c9f8d6b54-bbbbb   1/1     Running   0          2m
academia-app-7c9f8d6b54-ccccc   1/1     Running   0          20s
```

**What happened?** Without opening a single file, `--set replicaCount=3` changed the
deployment: there are now **3 Pods** and the release jumped to `REVISION: 2`. This is the
magic of Helm — values are parameters, not code to copy and paste.

### Step 9 — View the revision history

```bash
helm history academia -n academia
```

**What you'll see:**

```
REVISION	UPDATED                 	STATUS    	CHART              	APP VERSION	DESCRIPTION
1       	2026-06-14 18:00:00 ... 	superseded	academia-app-0.1.0 	1.0.0      	Install complete
2       	2026-06-14 18:05:00 ... 	deployed  	academia-app-0.1.0 	1.0.0      	Upgrade complete
```

**What happened?** Helm keeps **every version** of the release. `REVISION 1` is now
`superseded` (replaced) and `REVISION 2` is `deployed`. Because it stores the history, rolling
back is a single command: `helm rollback academia 1 -n academia`.

### Step 10 — Uninstall cleanly

```bash
helm uninstall academia -n academia
```

**What you'll see:**

```
release "academia" uninstalled
```

**What happened?** With one command Helm deleted **all** of the release's objects (Deployment,
Service, ConfigMap). No need to remember each file: Helm knows what it created and cleans the
whole thing up.

## ✅ Checkpoint

You've completed the lab when:

- [ ] `helm lint ./06-helm/academia-app-chart` ends with **`0 chart(s) failed`**.
- [ ] `helm install ...` shows **`STATUS: deployed`** and **`REVISION: 1`**.
- [ ] `helm list -n academia` shows chart **`academia-app-0.1.0`** and app version **`1.0.0`**.
- [ ] After `helm upgrade --set replicaCount=3`, `kubectl -n academia get pods` shows **3 Pods**.
- [ ] `helm history academia -n academia` shows **REVISION 1 (superseded)** and **2 (deployed)**.

If you ticked all 5 boxes: 🎁 **Helm Packager badge unlocked! +100 XP**

## 🧯 If something fails

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Error: INSTALLATION FAILED: cannot re-use a name that is still in use` | An `academia` release already exists | Uninstall it first: `helm uninstall academia -n academia` |
| `helm: command not found` | Helm isn't installed or isn't on the `PATH` | Install Helm v3 and reopen the terminal (see Lab 0) |
| Pods in `ImagePullBackOff` | The image isn't loaded into kind | `kind load docker-image academia-devops-app:1.0.0 --name devops-course` |
| Pods in `Pending` for a long time | Not enough RAM/CPU in the cluster | Close apps or give Docker Desktop more resources |
| `Error: query: failed to query with labels` | You're pointing at another cluster/context | `kubectl config use-context kind-devops-course` |
| `port 8080 in use` during port-forward | Another process uses the port | Use another one: `port-forward svc/academia-app-service 8081:80` |
| 🪟 *"Windows Subsystem for Linux has no distributions installed"* | You ran `bash` on Windows (points to WSL) | Use `pwsh ...ps1` or the `helm`/`kubectl` command directly — see [cheat sheet](windows-powershell.en.md) |
| 🪟 `curl` shows a weird/long response | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe` (with `.exe`) or open the URL in the browser — see [cheat sheet](windows-powershell.en.md) |

## 🏆 Extra challenge (+15 XP)

Change **two** values at once (replicas and image) and **roll back** to the first version:

```bash
helm upgrade academia ./06-helm/academia-app-chart -n academia \
  --set replicaCount=4 --set image.tag=1.0.0
helm history academia -n academia          # now there's a REVISION 3
helm rollback academia 1 -n academia       # back to the initial version (2 replicas)
kubectl -n academia get pods               # 👈 back to 2 Pods
```

Ask yourself: if a deploy goes wrong in production at 3 a.m., **would you rather edit files or
type a single `helm rollback`?**

## 🎓 How to teach it to your students

- **The big idea:** a chart is to Kubernetes what an installer (`.msi`/`.deb`) is to a desktop
  app: it bundles everything and installs/uninstalls it in one go. "Same package, different
  values" kills copy-paste between environments.
- **The "aha" moment:** run `helm upgrade --set replicaCount=3` live and show the Pods
  appearing **without having touched any YAML**. That's when parameterization clicks.
- **Discussion question:** *when is Helm worth it over manual YAML?* (Hint: number of
  environments and rate of change. For 1 toy app, YAML is enough; for 3 environments, Helm wins.)
- **Productive mistake:** install twice with the same name to trigger the `cannot re-use a
  name` error — that's how they grasp that a release is a **unique identity** in the cluster.
- **Close with `helm history`:** let them see the revision history. Connect it to the "undo"
  (rollback) idea they already know from the Lab 7 scaling/rollback exercise.

## ⏭️ Next

➡️ **Lab 9 — 🔭 Observer:** [monitor your app with logs and metrics](09-observabilidad.en.md).
You've packaged and deployed; now you'll **observe** what your app does live: read logs,
expose metrics and understand the 3 pillars of observability.
