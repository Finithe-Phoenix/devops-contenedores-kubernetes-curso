> 🌐 **English** · [Español](Guia_Instructor.md)

# 🎓 Instructor Guide
## Workshop Course: DevOps and Containers with Docker & Kubernetes

> For Daniel and any facilitator. By block: objective, time, what to explain,
> what to demonstrate, expected errors, how to recover, and trigger questions.

---

## Facilitation philosophy (the 4 layers)

Each topic is taught in 4 layers: **Concept** (the why) → **Demonstration** (instructor)
→ **Guided lab** (everyone replicates) → **Teaching application** (how do I teach this?).
Layer 4 is what sets this course apart: they're teachers, not just operators.

## Golden rules

1. **Make it work first.** If a lab gets stuck, use Plan B and move on; don't hold up the group.
2. **Demonstrate before asking.** Let them see the expected result before they type.
3. **Errors = gold.** Every common error is a mini-lesson. Trigger them on purpose.
4. **Gamify.** Keep the XP board; celebrate every medal.
5. **Pace > coverage.** Better to understand Docker+K8s well than to half-cover everything.

---

# DAY 1 — Fundamentals, Git, Docker

### Block 1 · Opening (9:00-9:40)
- **Objective:** hook them and level expectations.
- **Demonstrate:** the course repo and the app already running (`/health`).
- **Trigger question:** *how do you deploy your projects today? what breaks?*
- **Plan B:** if there's no internet, project screenshots.

### Block 2 · DevOps fundamentals (9:40-10:40)
- **Explain:** DevOps as culture + automation; the build→test→deploy→monitor→secure cycle.
- **Demonstrate:** the cycle diagram and the course's tool map.
- **Teaching application:** have each teacher say in which of their subjects DevOps fits.

### Block 3 · Git (10:40-11:30)
- **Demonstrate:** clone, branch, commit, push, PR.
- **Lab 1A:** clone the repo, create the `feature/dockerfile` branch.
- **Errors:** CRLF in `.sh` (already mitigated with `.gitattributes`); GitHub credentials.
- **Question:** *how do you ensure ALL your students have the same environment?*

### Block 4 · Docker (11:45-12:45)
- **Explain:** image vs container; container vs VM.
- **Demonstrate:** `docker run hello-world`, `docker ps`, `docker logs`.
- **Question:** *what problem does a container solve?*

### Block 5 · Dockerfile (12:45-14:00)
- **Lab 1:** build the app image and run it; `/health` responds.
  Guide: [`02-docker/comandos-docker.md`](../02-docker/comandos-docker.en.md).
- **Demonstrate:** compare `Dockerfile.secure` vs `Dockerfile.insecure` (size and risks).
- **Expected errors:** port 8080 in use, daemon off, missing lockfile.
- **Recovery:** `docker rm -f`, open Docker Desktop, `npm install` for the lock.

### Block 6 · Closing (14:00-15:00)
- **Evidence:** `docker images`, `docker ps`, `/health`, Dockerfile. → medal 🐳.

---

# DAY 2 — Compose, CI/CD, basic DevSecOps

### Block 1 · Recap (9:00-9:30) — validate environment, review yesterday's errors.

### Block 2 · Docker Compose (9:30-10:50)
- **Lab 2:** app + PostgreSQL; demonstrate **persistence** (a course that survives a `restart`).
  Guide: [`03-compose/comandos-compose.md`](../03-compose/comandos-compose.en.md).
- **Errors:** port 5432 in use, app doesn't resolve `db`, volume with old data.
- **Question:** *why does the app call the DB by name and not by IP?*

### Block 3-4 · CI/CD (11:05-13:30)
- **Explain:** the pipeline as a production line; CI vs CD.
- **Lab 3:** watch the workflow run in GitHub Actions (already in the repo).
  Guide: [`04-cicd/pipeline-explicado.md`](../04-cicd/pipeline-explicado.en.md).
- **Demonstrate:** break a test → red → fix → green.
- **Errors:** missing lockfile, wrong branch in `on:`, tests dependent on the environment.
- **Question:** *what validations must the code pass before being accepted?*

### Block 5 · DevSecOps intro (13:30-14:30)
- **Lab 4:** `trivy image`; interpret findings; detect a hardcoded secret.
  Guide: [`08-devsecops/trivy.md`](../08-devsecops/trivy.en.md).
- **Question:** *what does the tool detect and what needs human judgment?*

### Block 6 · Closing (14:30-15:00) — evidence. → medals 🧩 ⚙️ 🛡️.

---

# DAY 3 — Kubernetes and Helm

### Block 1 · K8s intro (9:00-10:00)
- **Explain:** what problem it solves; Pod/Deployment/Service/Namespace.
- **Demonstrate:** user→Service→Pod and Deployment→ReplicaSet→Pods diagrams.

### Block 2 · Cluster (10:00-10:45)
- **Demonstrate:** `bash scripts/create-kind-cluster.sh`.
- ⚠️ **Key point:** in kind you must **load** the image (`kind load docker-image`) or you get `ImagePullBackOff`.

### Block 3 · Deployment + Service (11:00-12:15)
- **Lab 5:** apply manifests, port-forward, `/health`.
  Guide: [`05-kubernetes/comandos-kubectl.md`](../05-kubernetes/comandos-kubectl.en.md).
- **Errors:** `ImagePullBackOff` (image not loaded), mismatched selector, namespace.

### Block 4 · Config and Secret (12:15-13:00)
- **Lab 6:** ConfigMap + Secret; demonstrate that **base64 is not encryption**.
- **Question:** *what goes in configuration and what goes in a secret?*

### Block 5 · Scale, update, rollback (13:00-14:00)
- **Lab 7:** `scale`, `set image`, `rollout undo`.
- **Question:** *why is one replica NOT high availability?*

### Block 6 · Helm (14:00-15:00)
- **Lab 8:** `helm install/upgrade --set replicaCount=4/rollback`.
  Guide: [`06-helm/comparativa-yaml-vs-helm.md`](../06-helm/comparativa-yaml-vs-helm.en.md).
- **Question:** *when is Helm worth it over manual YAML?*

---

# DAY 4 — Observability, DevSecOps, Project

### Block 1-2 · Observability (9:00-11:15)
- **Explain:** logs vs metrics vs traces; what to monitor.
- **Lab 9:** kube-prometheus stack with Helm; get into Grafana.
  Guide: [`07-observability/prometheus-grafana.md`](../07-observability/prometheus-grafana.en.md).
- **Plan B:** if it doesn't come up (RAM), use `/metrics` + `kubectl top` + screenshots.

### Block 3 · Logging (11:30-12:15)
- **Lab:** `kubectl logs`, `events`, `describe`. Good logs vs dangerous logs.
  Guide: [`07-observability/logs.md`](../07-observability/logs.en.md).

### Block 4 · Applied DevSecOps (12:15-13:20)
- **Demonstrate:** `deployment-with-probes.yaml` (probes, limits, securityContext).
  Guides: [`08-devsecops/checklist-seguridad.md`](../08-devsecops/checklist-seguridad.en.md), [`recomendaciones.md`](../08-devsecops/recomendaciones.en.md).

### Block 5 · Conceptual GitOps/IaC (13:20-14:00)
- **Explain (concept only):** GitOps (Argo CD/Flux), Terraform *provisions*, Ansible *configures*.
- **Demonstrate:** the DevOps maturity diagram (1 manual → 10 internal platform).

### Block 6 · Final project (14:00-15:00)
- **Lab 10:** each team demonstrates the complete flow + teaching proposal.
  Guide: [`09-proyecto-final/instrucciones.md`](../09-proyecto-final/instrucciones.en.md).
- **Evaluate:** with the [rubric](../09-proyecto-final/rubrica.en.md). → medal 🏛️.

---

## Plan B by scenario (summary)

| Problem | Plan B |
| -------- | ------ |
| Docker doesn't work | Projected demo / in pairs / Codespaces |
| Kubernetes won't come up | kind on the instructor's laptop / explain YAML |
| Slow internet | Pre-downloaded images / USB with the repo |
| Machines blocked | WSL2 / in pairs / installation as homework |
| Very basic group | Reduce Helm and monitoring; focus on basic Docker/Compose/K8s |
| Advanced group | Add Trivy in the pipeline, probes, GitOps with an Argo CD demo |

## Before each day (instructor checklist)
- [ ] Docker Desktop open with the whale stable.
- [ ] Base images pre-downloaded (`node:22-alpine`, `postgres:16-alpine`).
- [ ] kind cluster tested the night before.
- [ ] XP board ready.
- [ ] Emergency USB with the compressed repo.
