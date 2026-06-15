> 🌐 **English** · [Español](README.md)

# 🎓 Class Kit — your run-of-show

Everything you need to **walk into the room and just teach**. Follow this and you'll run the class with no surprises.

---

## 🔌 Start the class (1 command)

Every morning, from the repo root:

```powershell
pwsh scripts/clase.ps1      # Windows
```
```bash
bash scripts/clase.sh       # Linux / macOS / WSL
```

It checks Docker, pre-pulls images, starts **app + database** and opens the
**Command Center** at `http://localhost:8080/`. To shut down at the end:
`docker compose -f 03-compose/docker-compose.yml down`.

---

## ✅ Pre-flight (the night before / 30 min before)

- [ ] **Docker Desktop** open and stable (the 🐳 whale settled).
- [ ] Run `pwsh scripts/clase.ps1` → the Command Center opens green.
- [ ] Base images pre-pulled (`node:22-alpine`, `postgres:16-alpine`) — the launcher does it.
- [ ] **Day 3/4:** test the cluster the night before → `bash scripts/create-kind-cluster.sh` *or* `minikube start`.
- [ ] Open the day's **slides** (`slides/`) and keep the [Instructor Guide](../docs/Guia_Instructor.en.md) handy.
- [ ] Print the [printables](imprimibles/) (cockpit + achievement card).
- [ ] Emergency USB with the zipped repo (Plan B if the internet fails).

---

## 🗓️ Day 1 — Fundamentals, Git and Docker
**Deck:** `slides/01_Day_1_DevOps_Docker.pptx` · **Guides:** [00-ambiente](../guias/00-ambiente.en.md), [01-docker](../guias/01-docker.en.md)

| Time | Block | Do this |
| ---- | ----- | ------- |
| 9:00 | Opening | Project the **Command Center** (already open). Show `/health` live. Ask: *how do you deploy today?* |
| 9:40 | Fundamentals | Deck. Activity: each teacher names *which of their courses DevOps fits into*. |
| 10:40 | Git | `git clone`, branch, commit (Guide 00). |
| 11:45 | Docker | `docker run hello-world`; **image vs container** (infographic #2). |
| 12:45 | **Lab 1** | [Guide 01](../guias/01-docker.en.md): everyone builds and runs the image; `/health` responds. |
| 14:00 | Close | Evidence → 🐳 badge. Close with the **Docker challenge** in the 🕵️ Bug Detective. |

## 🗓️ Day 2 — Compose, CI/CD and DevSecOps
**Deck:** `slides/02_Day_2_Compose_CICD_DevSecOps.pptx` · **Guides:** [02](../guias/02-compose.en.md), [03](../guias/03-cicd.en.md), [04](../guias/04-devsecops-trivy.en.md)

| Time | Block | Do this |
| ---- | ----- | ------- |
| 9:00 | Recap | The launcher already started Compose. **Persistence demo:** create a course, restart the app, it's still there. |
| 9:30 | **Lab 2** | [Guide 02](../guias/02-compose.en.md): app + PostgreSQL. Watch the **request console** in the Command Center. |
| 11:05 | **Lab 3** | [Guide 03](../guias/03-cicd.en.md): green pipeline on GitHub Actions. **Break a test → red → fix → green.** |
| 13:30 | **Lab 4** | [Guide 04](../guias/04-devsecops-trivy.en.md): `trivy image`. Interpret findings. |
| 14:30 | Close | Detective: **Compose challenges**. Badges 🧩 ⚙️ 🛡️. |

## 🗓️ Day 3 — Kubernetes and Helm
**Deck:** `slides/03_Day_3_Kubernetes_Helm.pptx` · **Guides:** [05](../guias/05-kubernetes-despliegue.en.md), [06](../guias/06-config-secrets.en.md), [07](../guias/07-escalar-rollback.en.md), [08](../guias/08-helm.en.md)

> ⚠️ **Bring the cluster up BEFORE block 2** (it can take a while): `bash scripts/create-kind-cluster.sh` or `minikube start`.

| Time | Block | Do this |
| ---- | ----- | ------- |
| 9:00 | K8s intro | Deck + infographic #7 (architecture). |
| 10:00 | Cluster | Create the cluster and **load the image** (`kind load docker-image …` or `docker save … \| minikube image load`). |
| 11:00 | **Lab 5** | [Guide 05](../guias/05-kubernetes-despliegue.en.md): deployment + service + port-forward. |
| 12:15 | **Lab 6** | [Guide 06](../guias/06-config-secrets.en.md): ConfigMap/Secret. Demo: `base64` is **not** encryption. |
| 13:00 | **Lab 7** | [Guide 07](../guias/07-escalar-rollback.en.md): scale to 4, rolling update, rollback. |
| 14:00 | **Lab 8** | [Guide 08](../guias/08-helm.en.md): `helm install/upgrade/rollback`. |

## 🗓️ Day 4 — Observability, DevSecOps and Project
**Deck:** `slides/04_Day_4_Observability_DevSecOps_Project.pptx` · **Guides:** [09](../guias/09-observabilidad.en.md), [10](../guias/10-proyecto-final.en.md)

| Time | Block | Do this |
| ---- | ----- | ------- |
| 9:00 | Observability | [Guide 09](../guias/09-observabilidad.en.md). **Plan B** if low on RAM: `/metrics` + `kubectl top` + screenshots. |
| 11:30 | Logging | `kubectl logs / events / describe`. Good vs dangerous logs. |
| 12:15 | DevSecOps | `deployment-with-probes.yaml` (probes, limits, securityContext). |
| 13:20 | GitOps/IaC | Concept only: maturity roadmap (infographic + deck). |
| 14:00 | **Final project** | [Guide 10](../guias/10-proyecto-final.en.md). Grade with the [rubric](../09-proyecto-final/rubrica.en.md). Badge 🏛️. |

---

## 🆘 Panic button (common errors → one-line fix)

| Symptom | Immediate fix |
| ------- | ------------- |
| Docker not responding | Open Docker Desktop, wait for the 🐳 whale, retry. |
| Port 8080 in use | `docker compose -f 03-compose/docker-compose.yml down` or `docker rm -f academia`. |
| Compose "won't recreate" the container | Add `--force-recreate` (the launcher already does it). |
| `/health` → `"db":"down"` | Wait until Postgres is *healthy*; check `DB_HOST=db`. |
| Pod `ImagePullBackOff` (kind) | `kind load docker-image academia-devops-app:1.0.0 --name devops-course`. |
| Pod `ImagePullBackOff` (minikube) | `docker save academia-devops-app:1.0.0 -o img.tar && minikube image load img.tar`. |
| minikube won't start | `minikube delete && minikube start`. |
| Slow internet | Images are already pre-pulled; use the projected demo. |

---

## 🔗 Quick links

- **Command Center:** http://localhost:8080/ (guided tour + live Bug Detective)
- **Instructor Guide (pedagogical detail):** [`docs/Guia_Instructor.en.md`](../docs/Guia_Instructor.en.md)
- **Step-by-step guides:** [`guias/`](../guias/README.en.md) · **Challenges:** [`retos/`](../retos/README.en.md)
- **Slides:** [`slides/`](../slides/README.en.md) · **Infographics:** [`slides/`](../slides/README.en.md) (PNG + PPTX)
- **Technical rehearsal (test it all first):** [`docs/ensayo-tecnico.en.md`](../docs/ensayo-tecnico.en.md)
- **🖨️ Printables (PDF):** [`imprimibles/`](imprimibles/)

> *First make it work. Then make it pretty. Then make it teachable.* — all three are done. 🚀
