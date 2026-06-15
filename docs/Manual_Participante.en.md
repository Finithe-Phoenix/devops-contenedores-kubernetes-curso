> 🌐 **English** · [Español](Manual_Participante.md)

# 📘 Participant Handbook
## Workshop Course: DevOps and Containers with Docker & Kubernetes

> Your pocket guide for the 4 days. Everything you need, in order.

---

## 1. Welcome

Over 4 days we'll take **a single application** and walk it through its entire modern
life cycle. By the end you'll have a complete lab that you can **reuse as practice
with your own students**. And we'll do it by playing: every lab is a **mission** with XP and medals
(see [`gamificacion/`](../gamificacion/README.en.md)).

## 2. Requirements

- Laptop with installation permissions (or WSL2 on Windows).
- A GitHub account.
- A willingness to break things and fix them. 🛠️

## 3. Installation (prework)

Follow [`00-prework/instalacion.md`](../00-prework/instalacion.en.md) and validate with:

```bash
bash scripts/check-env.sh
```

If something fails → [`00-prework/troubleshooting.md`](../00-prework/troubleshooting.en.md).

## 4. The course application: "Academia DevOps App"

A minimal REST API in Node.js. What matters isn't the app, but **everything we do to it**.

| Endpoint | What for |
| -------- | -------- |
| `/health` | is it alive and healthy? |
| `/version` | version (for rollbacks) |
| `/metrics` | Prometheus metrics |
| `/courses` | course CRUD |

Details: [`01-app/node/README.md`](../01-app/node/README.en.md).

## 5. Map of the 4 days

| Day | Topic | Missions |
| --- | ---- | -------- |
| 1 | Fundamentals, Git, Docker, Dockerfile | Lab 0, Lab 1 |
| 2 | Compose, CI/CD, basic DevSecOps | Lab 2, Lab 3, Lab 4 |
| 3 | Kubernetes, Config/Secrets, Scaling, Helm | Lab 5, Lab 6, Lab 7, Lab 8 |
| 4 | Observability, DevSecOps, final project | Lab 9, Lab 10 |

## 6. Labs (step by step)

| Lab | Guide |
| --- | ---- |
| 0 · Environment | [`00-prework/checklist-ambiente.md`](../00-prework/checklist-ambiente.en.md) |
| 1 · Docker | [`02-docker/comandos-docker.md`](../02-docker/comandos-docker.en.md) |
| 2 · Compose | [`03-compose/comandos-compose.md`](../03-compose/comandos-compose.en.md) |
| 3 · CI/CD | [`04-cicd/pipeline-explicado.md`](../04-cicd/pipeline-explicado.en.md) |
| 4 · DevSecOps | [`08-devsecops/trivy.md`](../08-devsecops/trivy.en.md) |
| 5-7 · Kubernetes | [`05-kubernetes/comandos-kubectl.md`](../05-kubernetes/comandos-kubectl.en.md) |
| 8 · Helm | [`06-helm/comparativa-yaml-vs-helm.md`](../06-helm/comparativa-yaml-vs-helm.en.md) |
| 9 · Observability | [`07-observability/prometheus-grafana.md`](../07-observability/prometheus-grafana.en.md) |
| 10 · Final project | [`09-proyecto-final/instrucciones.md`](../09-proyecto-final/instrucciones.en.md) |

## 7. Command cheat sheet

```bash
# Git
git status / git add . / git commit -m "..." / git push

# Docker
docker build -t app:1.0.0 .
docker run -d -p 8080:8080 --name app app:1.0.0
docker ps / docker logs -f app / docker stop app / docker rm app

# Compose
docker compose up -d --build / docker compose ps / docker compose down -v

# Kubernetes
kubectl apply -f archivo.yaml
kubectl -n academia get pods,svc
kubectl -n academia logs -f deployment/academia-app
kubectl -n academia scale deployment academia-app --replicas=4
kubectl -n academia rollout undo deployment/academia-app

# Helm
helm install academia ./06-helm/academia-app-chart -n academia --create-namespace
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=4
helm rollback academia 1 -n academia

# Security
trivy image academia-devops-app:1.0.0
```

## 8. Space for notes

```
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
```

## 9. Final challenge and rubric

- Challenge: [`09-proyecto-final/instrucciones.md`](../09-proyecto-final/instrucciones.en.md)
- Rubric: [`09-proyecto-final/rubrica.md`](../09-proyecto-final/rubrica.en.md)
- Submission template: [`09-proyecto-final/plantilla-entrega.md`](../09-proyecto-final/plantilla-entrega.en.md)

## 10. Glossary

[`docs/Glosario.md`](Glosario.en.md) — all the terms in classroom language.

---

> *"A program doesn't end when it compiles: it must be testable, packageable, deployable,
> monitorable and protectable."*
