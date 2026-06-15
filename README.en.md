> 🌐 **English** · [Español](README.md)

# 🚀 Course-Workshop: DevOps and Containers with Docker & Kubernetes

### Fundamentals · CI/CD · Orchestration · Monitoring · DevSecOps

[![CI Pipeline](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/actions/workflows/ci.yml/badge.svg)](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-kind-326CE5?logo=kubernetes&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-3-0F1689?logo=helm&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-yellow)
![Tests](https://img.shields.io/badge/tests-8%2F8-brightgreen)

> **Teacher training — Tecnológico de Toluca**
> Instructor: **Daniel Eduardo González Ramírez** · 4 days · 24 hours · in-person and intensive

---

## 🎯 The idea in one sentence

> We take **a single application** and walk it through its entire modern lifecycle:
> we version it, **containerize** it with Docker, **automate** it with CI/CD,
> **deploy** it on Kubernetes, **scale** it, **monitor** it and **secure** it
> with DevSecOps — and at the end we learn how to turn all of this into **practice for our students**.

It's not a list of loose tools. It's **a complete technical story**.

---

## 🎓 Teaching the class? Start here

1. **Start everything with one command:** `pwsh scripts/clase.ps1` (or `bash scripts/clase.sh`) → it brings up
   the app and opens the **Command Center** at `http://localhost:8080/`.
2. **Follow your run-of-show:** the [**🎓 Class Kit**](clase/README.en.md) has the *pre-flight*, the
   **minute-by-minute** 4-day agenda, the **panic button** and the **printable PDFs** (cockpit + achievement card).

---

## 🎮 This is a game (with XP and badges)

The course is set up as a series of **missions**. Each completed lab grants
**XP** and unlocks a **badge**. You accumulate rank until you become a **DevOps Architect**.

| Rank | XP | Meaning |
| ----- | -- | ----------- |
| 🥚 Apprentice | 0 | You've just entered the dojo |
| 🐳 Container Operator | 150 | You've mastered Docker and Compose |
| ⚙️ Delivery Engineer | 350 | You automate with CI/CD |
| ☸️ Kubernetes Pilot | 600 | You deploy, scale and roll back |
| 🏛️ DevOps Architect | 900 | You close the full cycle |

👉 Details of the system, missions and a **printable achievement card** in [`gamificacion/`](gamificacion/README.en.md).

---

## 🌐 Bilingual · 🎓 For students

All material is available in **English and Spanish** — use the `🌐 English · Español` switcher
at the top of every document.

**For your students:** share the **one-page infographics** (14 reference sheets, ready for chat
or printing) that live in [`slides/`](slides/README.en.md):
`Student_Infographics_EN.pptx` and `Infografias_Alumnos_ES.pptx`.

**Step by step:** every lab has a **detailed guide** in [`guias/`](guias/README.en.md)
(exact commands, *"what you'll see"*, troubleshooting and how to teach it). And with `make` you get
one-command shortcuts: `make check`, `make compose`, `make deploy`, `make help` (see `Makefile`).

**Practice debugging:** the *break-it-and-fix-it* challenges in [`retos/`](retos/README.en.md) ship files
with **real bugs** (Docker, Compose, Kubernetes) to diagnose and repair. Quick *spot-the-bug* version in
the Command Center (the web app) → **🕵️ Bug Detective** section.

---

## 🗺️ Course map

| Day | Topic | Missions (labs) |
| --- | ---- | ----------------------- |
| **1** | Fundamentals, Git, Docker and Dockerfile | Lab 0 · Lab 1 |
| **2** | Docker Compose, CI/CD and basic scanning | Lab 2 · Lab 3 · Lab 4 |
| **3** | Kubernetes, manifests, Helm | Lab 5 · Lab 6 · Lab 7 · Lab 8 |
| **4** | Observability, DevSecOps and final project | Lab 9 · Lab 10 |

---

## ⚡ Quick start (5 minutes)

```bash
# 1) Clone the repo
git clone <url-de-este-repo>
cd devops-contenedores-kubernetes-curso

# 2) Validate your environment (Lab 0)
bash scripts/check-env.sh

# 3) Run the demo app locally
cd 01-app/node
npm install
npm start            # -> http://localhost:8080/health

# 4) Containerize it with Docker (Lab 1)
docker build -t academia-devops-app:1.0.0 .
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
curl http://localhost:8080/health
```

---

## 📁 Repository structure

```text
devops-contenedores-kubernetes-curso/
├── 00-prework/          Installation, checklist and troubleshooting
├── 01-app/node/         The demo app "Academia DevOps App" (Node.js)   ✅
├── 02-docker/           Didactic Dockerfiles (insecure vs secure)      ✅
├── 03-compose/          App + PostgreSQL with Docker Compose           ✅
├── 04-cicd/             GitHub Actions / Jenkins pipelines             ✅
├── 05-kubernetes/       Manifests: deployment, service, config...      ✅
├── 06-helm/             Helm chart                                     ✅
├── 07-observability/    Prometheus, Grafana, logs                      ✅
├── 08-devsecops/        Trivy, checklists, secure/insecure examples    ✅
├── 09-proyecto-final/   Integrative challenge + rubric                 ✅
├── guias/               Step-by-step guide per lab (ES/EN)             ✅
├── retos/               "Break it & fix it" challenges (real bugs)     ✅
├── clase/               🎓 Class Kit: run-of-show + printables         ✅
├── docs/                Manual, instructor guide, glossary, essay      ✅
├── slides/              Instructor decks (ES/EN) + student infographics ✅
├── gamificacion/        XP, missions and badges system                ✅
└── scripts/             Lab utilities                                  ✅
```

> **Build status:** ✅ ready · ⏳ under construction. This README is updated
> as we progress. (See [roadmap](#-build-roadmap).)

---

## 🧰 Course stack

**Main path (lightweight, to get started fast):** Node.js 22 + Express + PostgreSQL.
**Serious / enterprise path (backup):** Java 17 + Spring Boot (same API).

Tools: Git · Docker · Docker Compose · GitHub Actions / Jenkins ·
Kubernetes (kind) · Helm · Trivy · Prometheus · Grafana.

---

## 🛠️ Build roadmap

- [x] **M0** Repo skeleton + gamification
- [x] **M1** Demo app (`/health`, `/version`, `/courses`) + tests
- [x] **M2** Docker (multi-stage Dockerfile + didactic variants)
- [x] **M3** Docker Compose (app + PostgreSQL)
- [x] **M4** CI/CD (GitHub Actions + Jenkinsfile)
- [x] **M5** Kubernetes (namespace, deployment, service, configmap, secret)
- [x] **M6** Helm chart
- [x] **M7** DevSecOps (Trivy, checklists)
- [x] **M8** Observability (Prometheus/Grafana, logs)
- [x] **M9** Docs (participant manual, instructor guide, rubric, glossary)
- [x] **M10** Slides (8 bilingual decks + student infographics)
- [x] **M11** End-to-end technical rehearsal + Plan B

> 🎉 **Course complete: M0 → M11.**

---

## 📜 Course message

> *"DevOps is not just about using tools; it's about teaching people to think about the entire
> lifecycle of software. A program doesn't end when it compiles: it must be able to be tested, packaged,
> deployed, monitored and protected."*

## License

[MIT](LICENSE) — educational material, free to use and adapt for your classes.
