> 🌐 **English** · [Español](09-observabilidad.md)

# 🎯 Step-by-step guide — Lab 9: Monitoring and logs

| | |
| --- | --- |
| **Mission** | 🔭 Observer — see what your app does live (logs, metrics, health) |
| **XP** | +90 XP |
| **Badge** | 🔭 Observer |
| **Time** | ~30 min |
| **Difficulty** | ★★☆ |

Deploying isn't enough: you need to **know what's happening inside**. In this lab you'll read
live logs, investigate events, understand the health **probes**, learn the `/metrics` endpoint
and, if your machine can spare the RAM, stand up Prometheus + Grafana with Helm. If it can't,
there's a **Plan B** that teaches the same thing with fewer resources.

## 🎒 Before you start

- ✅ The **app deployed** in the `academia` namespace (from Lab 5 with `kubectl`, or Lab 8 with Helm).
- ✅ `kubectl` pointing at the right cluster (`kubectl config current-context` → `kind-devops-course`).
- ✅ (Optional, for the heavy stack) **Helm v3** and at least **~4 GB of free RAM** in Docker Desktop.

> 🪟 **On Windows?** The commands below are Linux/Mac style. In **PowerShell** some change
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). You'll see the Windows version right below
> each command that changes. If you get stuck, keep the **[PowerShell cheat sheet](windows-powershell.en.md)** handy.

Check the app is up before observing it:

```bash
kubectl -n academia get pods
```

**What you'll see:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-abcde   1/1     Running   0          5m
academia-app-7c9f8d6b54-fghij   1/1     Running   0          5m
```

**What happened?** You confirmed there are `Running` Pods to produce logs and metrics. If none
appear, go back to Lab 5 or Lab 8 to deploy before continuing.

## 🧭 What you'll achieve

- Name the **3 pillars** of observability: **logs**, **metrics** and **traces**.
- Read **live** logs, view **events** and **describe** a Pod to diagnose.
- Understand the **probes**: `readinessProbe` (ready for traffic?) and `livenessProbe` (still alive?).
- See the `/metrics` endpoint in **Prometheus format**.
- Stand up Prometheus + Grafana with Helm **or** apply the **Plan B** if RAM is tight.

## 👣 Steps

### Step 1 — The 3 pillars of observability

| Pillar | Answers... | In this course |
| ------ | ---------- | -------------- |
| **Logs** | What exactly happened? | `kubectl logs` |
| **Metrics** | How does it behave over time? | `/metrics` + Prometheus |
| **Traces** | Which path did a request take? | concept (advanced) |

Our app already exposes metrics at `/metrics`; Prometheus "scrapes" them from there.

**What happened?** You locked in the mental map: **logs** tell *what* happened, **metrics**
measure *how* it behaves over time, and **traces** follow *which path* a request took. Today
you work the first two in depth.

### Step 2 — Read the logs live

```bash
# Follow the deployment's logs in real time (Ctrl+C to exit)
kubectl -n academia logs -f deployment/academia-app
```

**What you'll see:**

```
2026-06-14T18:10:01Z INFO  server listening on :8080
2026-06-14T18:10:05Z INFO  GET /health 200 2ms
2026-06-14T18:10:12Z INFO  GET /metrics 200 4ms
```

**What happened?** With `-f` (follow) the logs appear **live**: every incoming request leaves
a line with timestamp, level (`INFO`) and result. It's your first diagnostic tool when
something "isn't working". Review more commands in [`../07-observability/logs.en.md`](../07-observability/logs.en.md).

### Step 3 — View the namespace events

Logs tell you what the app says; **events** tell you what Kubernetes does with it.

```bash
kubectl -n academia get events --sort-by=.lastTimestamp
```

**What you'll see:**

```
LAST SEEN   TYPE     REASON      OBJECT                              MESSAGE
3m          Normal   Scheduled   pod/academia-app-7c9f8d6b54-abcde   Successfully assigned ...
3m          Normal   Pulled      pod/academia-app-7c9f8d6b54-abcde   Container image already present
3m          Normal   Started     pod/academia-app-7c9f8d6b54-abcde   Started container academia-app
```

**What happened?** Events are **pure gold** for diagnosis: they tell you whether a Pod was
scheduled, whether the image was pulled, whether a probe failed or whether there was an
`OOMKilled`. When a Pod won't start, this is the first place to look.

### Step 4 — Describe a Pod

```bash
# Take a pod name from step 1 and describe it
kubectl -n academia describe pod academia-app-7c9f8d6b54-abcde
```

**What you'll see:** (excerpt — the key part is the final `Events` section and the probe state)

```
Name:         academia-app-7c9f8d6b54-abcde
Status:       Running
Containers:
  academia-app:
    State:          Running
    Ready:          True
    Restart Count:  0
    Liveness:   http-get http://:8080/health delay=5s period=10s
    Readiness:  http-get http://:8080/health delay=3s period=5s
Events:
  Type    Reason     Message
  Normal  Started    Started container academia-app
```

**What happened?** `describe` gives you the Pod's **full record**: status, restart count, the
configured probes and recent events. This is where you'd see the reason if a Pod were in
`CrashLoopBackOff` or `ImagePullBackOff`.

### Step 5 — Understand the probes (readiness and liveness)

Your `deployment.yaml` defines two health checks pointing at `/health`:

```yaml
readinessProbe:           # is it READY to receive traffic?
  httpGet:
    path: /health
    port: 8080
livenessProbe:            # is it still ALIVE? if it fails, Kubernetes restarts it
  httpGet:
    path: /health
    port: 8080
```

**What happened?** They're two different questions:
- **`readinessProbe`** = *"ready for traffic?"* — if it fails, the Service stops sending it
  requests (but does **not** restart it). Useful while the app is starting up.
- **`livenessProbe`** = *"still alive?"* — if it fails repeatedly, Kubernetes **restarts** the
  container. Useful when the app hangs.

That's why `/health` matters so much: it's the "pulse" Kubernetes watches.

### Step 6 — See the metrics in Prometheus format

```bash
# In one terminal: open the tunnel to the Service
kubectl -n academia port-forward svc/academia-app-service 8080:80
# In another terminal: query /metrics
curl http://localhost:8080/metrics
```

> 🪟 **Windows (PowerShell):** the last line is `curl.exe http://localhost:8080/metrics` (with `.exe`;
> in PowerShell `curl` is a different command). The `port-forward` runs the same.

**What you'll see:** (excerpt — plain text, one metric per line)

```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status="200"} 42
# HELP process_resident_memory_bytes Process resident memory
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 3.1457280e+07
```

**What happened?** The app exposes its internal numbers in **Prometheus format** (plain text:
`name{labels} value`). Prometheus visits this URL every few seconds and stores the values over
time. Without writing anything, you already have metrics ready to graph.

### Step 7 — (Full route) Stand up Prometheus + Grafana with Helm

> ⚠️ This stack uses several GB of RAM. If your machine is modest, **skip to Plan B (Step 8)**.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
kubectl -n monitoring get pods       # wait until ALL are Running (takes a few minutes)
```

**What you'll see:**

```
NAME: monitoring
NAMESPACE: monitoring
STATUS: deployed
REVISION: 1
```

Then enter Grafana:

```bash
# Default user: admin
kubectl -n monitoring get secret monitoring-grafana \
  -o jsonpath='{.data.admin-password}' | base64 -d ; echo
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
# Open http://localhost:3000  (admin / <the password above>)
```

**What happened?** With **one Helm chart** you installed a full monitoring stack. Grafana
already ships ready-made dashboards for **CPU, memory, Pod status and network**: exactly what
an ops team watches to know everything is healthy.

### Step 8 — (Plan B) Observe without the heavy stack

If Prometheus/Grafana won't start for lack of RAM, observe the same things with lightweight tools:

```bash
# App metrics straight from its endpoint
curl http://localhost:8080/metrics
# Real CPU/memory usage per Pod (needs metrics-server)
kubectl -n academia top pods
```

> 🪟 **Windows (PowerShell):** the first line is `curl.exe http://localhost:8080/metrics` (with `.exe`;
> in PowerShell `curl` is a different command). The `kubectl top` runs the same.

**What you'll see:**

```
NAME                            CPU(cores)   MEMORY(bytes)
academia-app-7c9f8d6b54-abcde   2m           30Mi
academia-app-7c9f8d6b54-fghij   1m           29Mi
```

**What happened?** With `/metrics` (the app's numbers) + `kubectl top` (real CPU/memory) +
**dashboard screenshots** to explain the concept, you cover the observability learning goal
**without** burning the machine's RAM. The point isn't the tool, it's the **mindset** of
"measure before you guess".

## ✅ Checkpoint

You've completed the lab when:

- [ ] You can name the **3 pillars**: logs, metrics and traces.
- [ ] `kubectl -n academia logs -f deployment/academia-app` shows **live** logs.
- [ ] `kubectl -n academia get events` and `describe pod` show you the state and events.
- [ ] You distinguish **readinessProbe** (ready?) from **livenessProbe** (alive? restarts it).
- [ ] `curl .../metrics` returns text in **Prometheus format**.
- [ ] You stood up Grafana **or** applied the **Plan B** (`/metrics` + `kubectl top` + screenshots).

If you ticked the above: 🔭 **Observer badge unlocked! +90 XP**

## 🧯 If something fails

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `monitoring` Pods in `Pending` for a long time | Not enough RAM in the kind cluster | Use **Plan B**, or give Docker Desktop more RAM |
| `error: Metrics API not available` in `kubectl top` | `metrics-server` is missing | Install it, or use the app's `/metrics` as an alternative |
| `port 3000 in use` | Another process uses the port | Use another one: `port-forward svc/monitoring-grafana 3001:80` |
| Grafana won't load the dashboard | The stack is still starting | Wait: `kube-prometheus-stack` takes several minutes |
| `/metrics` doesn't respond | The port-forward closed or the Pod isn't `Running` | Check `kubectl -n academia get pods` and reopen the tunnel |
| `No resources found` in `get events` | Wrong namespace | Add `-n academia` to the command |
| 🪟 *"Windows Subsystem for Linux has no distributions installed"* | You ran `bash` on Windows (it points to WSL) | Use `pwsh` — see [PowerShell cheat sheet](windows-powershell.en.md) |
| 🪟 `curl` shows a weird/long response | In PowerShell `curl` = `Invoke-WebRequest` | Use `curl.exe` (with `.exe`) or open the URL in the browser |

## 🏆 Extra challenge (+15 XP)

Simulate an incident and diagnose it **with observability alone** (based on
[`../07-observability/incident-simulation.en.md`](../07-observability/incident-simulation.en.md)):

```bash
# Trigger restarts by lowering the memory limit (then revert)
kubectl -n academia set resources deployment/academia-app --limits=memory=16Mi
kubectl -n academia get pods -w        # 👀 watch the RESTARTS / OOMKilled climb
kubectl -n academia describe pod <pod> | grep -A3 "Last State"
# Revert when you're done:
kubectl -n academia set resources deployment/academia-app --limits=memory=128Mi
```

> 🪟 **Windows (PowerShell):** the `grep` line is
> `kubectl -n academia describe pod <pod> | Select-String -Context 0,3 "Last State"`. The rest runs the same.

Ask yourself: with the logs, the events and `describe`, **can you explain why it restarted
without guessing?**

## 🎓 How to teach it to your students

- **The lab's big question:** *"how do I know my app is **alive**, **healthy** and **why it
  failed**?"* — the 3 pillars answer those three questions.
- **The "aha" moment:** lower the `memory limit` on purpose and leave `kubectl get pods -w`
  running; watching `RESTARTS` climb on their own makes it tangible what a probe is for.
- **Discussion question:** *what's the difference between readiness and liveness?* (Readiness
  pulls you out of the load balancer; liveness restarts you. Mixing them up causes downtime or
  endless restarts.)
- **Be honest about RAM:** if the classroom has modest machines, **use Plan B without guilt**.
  The concept (measure before you guess) teaches just as well with `/metrics`, `top` and screenshots.
- **Connect to DevSecOps:** remind them that a secret in a log **is a leaked secret**;
  observability and security go hand in hand.

## ⏭️ Next

➡️ **Lab 10 — 🏛️ DevOps Architect:** [the final integrative project](10-proyecto-final.en.md).
You now know how to build, package, deploy and observe. It's time to **put it all together** in
a full DevOps-cycle demo and turn it into a hands-on lab for your own students.
