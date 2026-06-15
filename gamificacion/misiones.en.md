> 🌐 **English** · [Español](misiones.md)

# 🗺️ Detailed missions

Every mission follows the same format: **Objective → Evidence → XP → Extra challenge → Teaching question**.

---

## Mission 0 — 🧰 Kit Ready (30 XP)
- **Objective:** get the environment ready (git, Docker, Node, kubectl, helm).
- **Evidence:** output of `bash scripts/check-env.sh`.
- **Extra challenge (+10):** install `kind` and create an empty cluster.
- **Teaching question:** how do you ensure ALL your students have the same environment?

## Mission 1 — 🐳 Container Captain (100 XP)
- **Objective:** build the image and run the container; `/health` responds.
- **Evidence:** `docker images`, `docker ps`, response from `/health`.
- **Extra challenge (+20):** build `Dockerfile.insecure` and compare sizes.
- **Teaching question:** what should NEVER go inside an image?

## Mission 2 — 🧩 Multi-container Master (120 XP)
- **Objective:** bring up app + PostgreSQL with Compose; the data persists.
- **Evidence:** `/health` with `"store":"postgres"`, a course that survives a `restart`.
- **Extra challenge (+15):** deliberately break `DB_HOST` and diagnose it with logs.
- **Teaching question:** why does the app call the DB by name and not by IP?

## Mission 3 — ⚙️ Automator (130 XP)
- **Objective:** a CI pipeline that does build + test + image, green.
- **Evidence:** screenshot of the successful workflow in GitHub Actions.
- **Extra challenge (+20):** make the pipeline fail on purpose with a broken test and fix it.
- **Teaching question:** what validations must the code pass before being accepted?

## Mission 4 — 🛡️ Shift-Left Guardian (90 XP)
- **Objective:** scan the image with Trivy and interpret the findings.
- **Evidence:** Trivy report + 3 remediation recommendations.
- **Extra challenge (+15):** detect a "hardcoded" secret in the insecure image.
- **Teaching question:** what does the tool detect and what needs human judgment?

## Mission 5 — ☸️ Cluster Helmsman (140 XP)
- **Objective:** deploy on Kubernetes (deployment + service) and access it via port-forward.
- **Evidence:** `kubectl get pods/services`, `/health` via port-forward.
- **Extra challenge (+20):** trigger and diagnose an `ImagePullBackOff`.
- **Teaching question:** how does exposing the local app differ from doing it inside the cluster?

## Mission 6 — 🔐 Keeper of Secrets (70 XP)
- **Objective:** externalize configuration with ConfigMap and Secret.
- **Evidence:** a deployment consuming variables from ConfigMap/Secret.
- **Extra challenge (+10):** show that `base64` is NOT encryption.
- **Teaching question:** what goes in configuration and what goes in a secret?

## Mission 7 — 📈 Live Operator (110 XP)
- **Objective:** scale replicas, update the image (rolling update) and do a rollback.
- **Evidence:** `kubectl get pods` with 4 replicas, rollout history, rollback.
- **Extra challenge (+15):** deploy a "bad" version and revert it without downtime.
- **Teaching question:** why is a single replica NOT high availability?

## Mission 8 — 🎁 Helm Packager (100 XP)
- **Objective:** package the deployment with a Helm chart.
- **Evidence:** successful `helm install` + `helm upgrade`.
- **Extra challenge (+15):** change the number of replicas from `values.yaml`.
- **Teaching question:** when is Helm worth it over manual YAML?

## Mission 9 — 🔭 Observer (90 XP)
- **Objective:** query logs and metrics; understand a simulated incident.
- **Evidence:** pod logs, a basic dashboard or `/metrics`.
- **Extra challenge (+15):** explain a "the pipeline passed but production fails" case.
- **Teaching question:** how do I know my app is alive, healthy, and why it failed?

## Mission 10 — 🏛️ DevOps Architect (200 XP)
- **Objective:** integrate the complete flow and present it in 5 minutes.
- **Evidence:** final README + walkthrough of the whole cycle.
- **Extra challenge (+30):** adapt the lab to a specific subject you teach.
- **Teaching question:** how would you assess it with YOUR students?
