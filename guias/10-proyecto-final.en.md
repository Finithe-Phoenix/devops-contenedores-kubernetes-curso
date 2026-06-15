> 🌐 **English** · [Español](10-proyecto-final.md)

# 🎯 Step-by-step guide — Lab 10: Integrative project

| | |
| --- | --- |
| **Mission** | 🏛️ DevOps Architect — demonstrate the full DevOps cycle end to end |
| **XP** | +200 XP |
| **Badge** | 🏛️ DevOps Architect |
| **Time** | ~45 min (~5 min demo) |
| **Difficulty** | ★★★ |

This is the lab that **brings it all together**. In teams (or solo), you'll demonstrate in
~5 minutes the full DevOps cycle you built throughout the course using the **Academia DevOps
App**: from repository to Docker, from Compose to the pipeline, from Kubernetes to scaling,
security and monitoring. And — the thing that makes this course unique — you'll turn it into a
**hands-on lab for your own students**.

## 🎒 Before you start

- ✅ Having completed (or having on hand) Labs **1 to 9**: app, Docker, Compose, CI/CD, k8s,
  ConfigMap/Secret, scaling, Helm and observability.
- ✅ The **kind cluster running** with the image loaded and the `academia` namespace deployed.
- ✅ Open the [submission template](../09-proyecto-final/plantilla-entrega.en.md) and the
  [rubric](../09-proyecto-final/rubrica.en.md) **before** starting the demo.

Check you have a deployed base to demonstrate:

```bash
kubectl -n academia get all
```

**What you'll see:**

```
NAME                                READY   STATUS    RESTARTS   AGE
pod/academia-app-7c9f8d6b54-abcde   1/1     Running   0          10m
pod/academia-app-7c9f8d6b54-fghij   1/1     Running   0          10m

NAME                            TYPE        CLUSTER-IP     PORT(S)   AGE
service/academia-app-service    ClusterIP   10.96.120.42   80/TCP    10m

NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/academia-app   2/2     2            2           10m
```

**What happened?** You confirmed you have live Pods, a Service and a Deployment: the raw
material for your demonstration. If something's missing, go back to the relevant lab before presenting.

## 🧭 What you'll achieve

- Walk through the full **demonstration checklist**: repo → docker → compose → pipeline → k8s
  → scale → security → monitoring.
- Answer the **teaching question** that defines the course: *"how do you turn it into a lab for
  YOUR students?"*
- **Self-assess with the rubric** (8 criteria × 3 = 24 pts) and find your rank.
- Fill in the submission template and unlock the final badge 🏛️ **DevOps Architect**.

## 👣 Steps

### Step 1 — Repository: the source of truth

```bash
git log --oneline -5
```

**What you'll see:**

```
a1b2c3d feat: Helm chart for the Academia DevOps App
e4f5g6h ci: build + test pipeline green
i7j8k9l feat: multi-stage Dockerfile
m0n1o2p feat: Node app with /health and /metrics
q3r4s5t chore: initial repo structure
```

**What happened?** Everything starts in **git**: the history tells the project's evolution. In
the demo, open the repo and show that every stage of the course left commits — traceability is
the first DevOps principle.

### Step 2 — Docker: build the image

```bash
docker build -t academia-devops-app:1.0.0 ./01-app/node
docker images | grep academia-devops-app
```

**What you'll see:**

```
academia-devops-app   1.0.0   d3adb33fc0de   2 minutes ago   180MB
```

**What happened?** The `Dockerfile` packaged the app into a reproducible image. "Works on my
machine" stops being a problem: the image runs the same everywhere.

### Step 3 — Docker Compose: app + database

```bash
docker compose -f 03-compose/docker-compose.yml up -d
docker compose -f 03-compose/docker-compose.yml ps
```

**What you'll see:**

```
NAME              IMAGE                       STATUS                   PORTS
compose-app-1     academia-devops-app:1.0.0   Up (healthy)             0.0.0.0:8080->8080/tcp
compose-db-1      postgres:16-alpine          Up (healthy)             5432/tcp
```

**What happened?** Compose brought up **app + DB together** with their dependencies
(`depends_on: service_healthy`). The `(healthy)` confirms the healthchecks pass: the app
doesn't start before the database is ready.

### Step 4 — CI/CD pipeline green

```bash
# Show the latest pipeline status (or open the Actions tab on GitHub)
gh run list --limit 1
```

**What you'll see:**

```
STATUS   TITLE                  WORKFLOW   BRANCH   EVENT   ID
✓        ci: build + test       CI         main     push    1234567890
```

**What happened?** The pipeline built the image and ran the tests **automatically** on every
push. The green ✓ is your safety net: nobody integrates broken code. In the demo, show it in
GitHub's **Actions** tab.

### Step 5 — Kubernetes: deploy and expose

```bash
kubectl -n academia get pods,svc
kubectl -n academia port-forward svc/academia-app-service 8080:80
# in another terminal:
curl http://localhost:8080/health
```

**What you'll see:**

```
{"status":"UP","store":"memory","db":"ok","uptime_s":12}
```

**What happened?** The same image you tested locally now runs in the **cluster**, exposed by a
Service. `/health` answers `UP`: the app is deployed and reachable. Here you can remind them
that the Helm chart (Lab 8) does exactly this with a single command.

### Step 6 — Scale to multiple replicas

```bash
kubectl -n academia scale deployment/academia-app --replicas=4
kubectl -n academia get pods
```

**What you'll see:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-aaaaa   1/1     Running   0          12m
academia-app-7c9f8d6b54-bbbbb   1/1     Running   0          12m
academia-app-7c9f8d6b54-ccccc   1/1     Running   0          15s
academia-app-7c9f8d6b54-ddddd   1/1     Running   0          15s
```

**What happened?** You scaled to **4 replicas** with one command. More replicas = more capacity
and **high availability** (if a Pod dies, the others keep serving). A single replica is **not**
high availability.

### Step 7 — Security: scan the image with Trivy

```bash
trivy image academia-devops-app:1.0.0
```

**What you'll see:** (excerpt — Trivy summarizes vulnerabilities by severity)

```
academia-devops-app:1.0.0 (alpine 3.20)
Total: 3 (UNKNOWN: 0, LOW: 1, MEDIUM: 2, HIGH: 0, CRITICAL: 0)
```

**What happened?** Trivy scanned the image for known vulnerabilities (CVEs). The goal isn't to
hit zero (nearly impossible) but to **know and decide on** your risks: no `HIGH`/`CRITICAL` is
a good sign. Security is part of the cycle, not an optional final step.

### Step 8 — Monitoring: logs and metrics

```bash
kubectl -n academia logs --tail=5 deployment/academia-app
curl http://localhost:8080/metrics | head -n 5
```

**What you'll see:**

```
2026-06-14T18:20:01Z INFO  GET /health 200 2ms
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status="200"} 87
```

**What happened?** You closed the cycle with **observability**: logs to know *what happened*
and `/metrics` to measure *how it behaves*. (If your machine can spare the RAM, this is where
you show Grafana; if not, the **Plan B** from Lab 9 with `kubectl top` and screenshots.)

### Step 9 — The layer that makes this course different: teaching application

Working isn't enough. This is **Layer 4** and the heart of the 🏛️ badge. In your submission, answer:

- How would you **explain** it to your students?
- Which part works as a **gradable lab**?
- What common **mistakes** will appear and how do you recover them?
- What **learning** are you measuring?
- What would you **change** for a specific subject (Programming, DB, Networks, Security...)?

| Subject | Lab focus |
| ------- | --------- |
| Programming | Dockerize the semester project; "works on my machine" solved |
| Databases | Compose with the DB + persistence + migrations |
| Networks | Services, ports, internal networks, service DNS |
| Software Engineering | CI/CD pipeline as part of the delivery process |
| Security | DevSecOps: Trivy, secrets, securityContext |
| Distributed Systems | Replicas, scaling, high availability |

**What happened?** You turned a technical demo into a **pedagogical proposal**. That's what a
teaching DevOps Architect contributes: not just *doing*, but *teaching how to do*.

### Step 10 — Self-assess with the rubric

Use the [rubric](../09-proyecto-final/rubrica.en.md): **8 criteria × 3 points = 24 points**.

| Criterion | 3 · Excellent | 2 · Satisfactory | 1 · Needs work |
| --------- | ------------- | ---------------- | -------------- |
| Docker | Builds, runs and explains layers | With help | Doesn't run |
| Docker Compose | App + DB, data persists | Partial | Doesn't grasp dependencies |
| CI/CD | Build/test green | Partial | Doesn't automate |
| Kubernetes | Deploys, exposes, scales, updates | Basic | Doesn't deploy |
| DevSecOps | Scans and interprets risks | Scans without analysis | No security applied |
| Observability | Logs/metrics + explanation | Basic logs | Can't diagnose |
| Final project | Integrates all + adapts to teaching | Partial | Incomplete |
| Teaching application | Clear lab for students | General idea | Doesn't land in class |

Add up your points and find your rank:

```text
21–24 pts → 🏛️ DevOps Architect
14–20 pts → ☸️ Kubernetes Pilot
< 14 pts  → keep stacking missions 💪
```

**What happened?** You measured your **competence** with an objective instrument. The rubric is
also your model for grading your own students: copy it and adapt it.

## ✅ Checkpoint

You've completed the integrative project when:

- [ ] You demonstrated the full checklist: **repo → docker → compose → pipeline → k8s → scale →
      security → monitoring**.
- [ ] `/health` answers `ok` in the cluster and you scaled to **4 replicas**.
- [ ] You ran `trivy image` and checked **logs** and `/metrics`.
- [ ] You answered the **teaching question**: *"how do you turn it into a lab for YOUR students?"*
- [ ] You self-assessed with the **rubric (≥ 21 pts for the Architect rank)** and filled the template.

If you ticked everything: 🏛️ **DevOps Architect badge unlocked! +200 XP**

## 🧯 If something fails

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `kubectl -n academia get all` comes back empty | Nothing deployed | Deploy with Lab 5 (`kubectl apply`) or Lab 8 (`helm install`) |
| `gh: command not found` | GitHub CLI not installed | Show the pipeline in the **Actions** tab in the browser |
| `trivy: command not found` | Trivy not installed | Review it in the DevSecOps lab; or explain the report with a screenshot |
| Compose shows `unhealthy` | The DB takes time to start | Wait a few seconds and rerun `docker compose ps`; check `DB_PASSWORD` |
| `port 8080 in use` | Another process uses the port | Use another one: `port-forward svc/academia-app-service 8081:80` |
| The pipeline is red | Build or test failed | Open the run, read the failing step's log and fix it before demoing |

## 🏆 Extra challenge (+20 XP)

Do your demo **end-to-end in one shot** and time it to 5 minutes: from `helm install` to
`trivy image`, including scaling and showing logs, **without notes**. If you can tell it as a
story ("first I package, then I deploy, scale, secure and observe"), you already think like an
architect. Record your screen and use it as material for your class.

## 🎓 How to teach it to your students

- **The big idea:** it's not a list of loose tools, it's **one single app** accompanied through
  its whole lifecycle. Have your students tell *the story*, not memorize commands.
- **The "aha" moment:** the live 5-minute demo. Seeing the full flow — from a commit to a scaled
  and monitored app — makes everything abstract from the semester concrete.
- **Discussion question:** *"where in my subject does each stage fit?"* — that's the Layer 4
  that sets this course apart from any tutorial.
- **Grade with the rubric in front of them:** let them see the 8 criteria; knowing how they're
  graded focuses them. Hand out the 🏛️ badge out loud to whoever integrates everything.
- **Final productive mistake:** let someone attempt the demo without having deployed; the empty
  `get all` teaches that "demonstrating" requires preparing the environment, just like in production.

## 🎉 Congratulations, DevOps Architect!

You completed the whole cycle: you versioned, **containerized**, **automated**, **deployed**,
**scaled**, **secured** and **monitored** a real application — and you learned to turn all of it
into a lab for your students. That's the difference between *using* tools and **thinking like an
architect**. 🏛️✨

> Take your badges (🧰 🐳 ☸️ 🔐 📈 🎁 🔭 🏛️) and your XP into your next class: now it's your turn
> to be the one handing out missions.

➡️ **Back to the start of the repo:** [Course README](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso)
