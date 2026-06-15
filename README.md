> 🌐 [English](README.en.md) · **Español**

# 🚀 Curso-Taller: DevOps y Contenedores con Docker & Kubernetes

### Fundamentos · CI/CD · Orquestación · Monitoreo · DevSecOps

[![CI Pipeline](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/actions/workflows/ci.yml/badge.svg)](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-kind-326CE5?logo=kubernetes&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-3-0F1689?logo=helm&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-MIT-yellow)
![Tests](https://img.shields.io/badge/tests-8%2F8-brightgreen)

> **Capacitación docente — Tecnológico de Toluca**
> Instructor: **Daniel Eduardo González Ramírez** · 4 días · 24 horas · presencial e intensivo

---

## 🎯 La idea en una frase

> Tomamos **una sola aplicación** y la acompañamos por todo su ciclo de vida moderno:
> la versionamos, la **contenerizamos** con Docker, la **automatizamos** con CI/CD, la
> **desplegamos** en Kubernetes, la **escalamos**, la **monitoreamos** y la **aseguramos**
> con DevSecOps — y al final aprendemos a convertir todo esto en **práctica para nuestros alumnos**.

No es una lista de herramientas sueltas. Es **una historia técnica completa**.

---

## 🎓 ¿Vas a impartir la clase? Empieza aquí

1. **Enciende todo con un comando:** `pwsh scripts/clase.ps1` (o `bash scripts/clase.sh`) → levanta la app
   y abre el **Centro de Mando** en `http://localhost:8080/`.
2. **Sigue tu guion del día:** el [**🎓 Kit de Clase**](clase/README.md) trae el *pre-flight*, la agenda
   **minuto a minuto** de los 4 días, el **botón de pánico** y los **imprimibles en PDF** (cockpit + tarjeta de logros).

---

## 🎮 Esto es un juego (con XP y medallas)

El curso está montado como una serie de **misiones**. Cada laboratorio completado da
**XP** y desbloquea una **medalla**. Acumulas rango hasta convertirte en **Arquitecto/a DevOps**.

| Rango | XP | Significado |
| ----- | -- | ----------- |
| 🥚 Aprendiz | 0 | Acabas de entrar al dojo |
| 🐳 Operador de Contenedores | 150 | Dominas Docker y Compose |
| ⚙️ Ingeniero de Entrega | 350 | Automatizas con CI/CD |
| ☸️ Pilot@ de Kubernetes | 600 | Despliegas, escalas y haces rollback |
| 🏛️ Arquitect@ DevOps | 900 | Cierras el ciclo completo |

👉 Detalle del sistema, misiones y **tarjeta de logros imprimible** en [`gamificacion/`](gamificacion/README.md).

---

## 🌐 Bilingüe · 🎓 Para alumnos

Todo el material está en **español e inglés** — usa el selector `🌐 English · Español` que aparece
arriba de cada documento.

**Para tus alumnos:** comparte las **infografías de una página** (14 láminas de referencia, listas
para chat o imprimir) que viven en [`slides/`](slides/README.md):
`Infografias_Alumnos_ES.pptx` y `Student_Infographics_EN.pptx`.

**Paso a paso:** cada laboratorio tiene una **guía detallada** en [`guias/`](guias/README.md)
(comandos exactos, *"lo que verás"*, troubleshooting y cómo enseñarlo). Y con `make` tienes atajos
de un comando: `make check`, `make compose`, `make deploy`, `make help` (ver `Makefile`).

**Practica depurando:** los retos *rómpelo y arréglalo* en [`retos/`](retos/README.md) traen archivos
con **bugs reales** (Docker, Compose, Kubernetes) para diagnosticar y reparar. Versión rápida
*spot-the-bug* en el Centro de Mando (la app web) → sección **🕵️ Detective de bugs**.

---

## 🗺️ Mapa del curso

| Día | Tema | Misiones (laboratorios) |
| --- | ---- | ----------------------- |
| **1** | Fundamentos, Git, Docker y Dockerfile | Lab 0 · Lab 1 |
| **2** | Docker Compose, CI/CD y escaneo básico | Lab 2 · Lab 3 · Lab 4 |
| **3** | Kubernetes, manifiestos, Helm | Lab 5 · Lab 6 · Lab 7 · Lab 8 |
| **4** | Observabilidad, DevSecOps y proyecto final | Lab 9 · Lab 10 |

---

## ⚡ Inicio rápido (5 minutos)

```bash
# 1) Clona el repo
git clone <url-de-este-repo>
cd devops-contenedores-kubernetes-curso

# 2) Valida tu ambiente (Lab 0)
bash scripts/check-env.sh

# 3) Corre la app demo en local
cd 01-app/node
npm install
npm start            # -> http://localhost:8080/health

# 4) Conténtenla con Docker (Lab 1)
docker build -t academia-devops-app:1.0.0 .
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
curl http://localhost:8080/health
```

---

## 📁 Estructura del repositorio

```text
devops-contenedores-kubernetes-curso/
├── 00-prework/          Instalación, checklist y troubleshooting
├── 01-app/node/         La app demo "Academia DevOps App" (Node.js)   ✅
├── 02-docker/           Dockerfiles didácticos (inseguro vs seguro)   ✅
├── 03-compose/          App + PostgreSQL con Docker Compose           ✅
├── 04-cicd/             Pipelines GitHub Actions / Jenkins            ✅
├── 05-kubernetes/       Manifiestos: deployment, service, config...   ✅
├── 06-helm/             Chart de Helm                                 ✅
├── 07-observability/    Prometheus, Grafana, logs                     ✅
├── 08-devsecops/        Trivy, checklists, ejemplos seguro/inseguro   ✅
├── 09-proyecto-final/   Reto integrador + rúbrica                     ✅
├── guias/               Guías paso a paso por laboratorio (ES/EN)     ✅
├── retos/               Retos "rómpelo y arréglalo" (bugs reales)     ✅
├── clase/               🎓 Kit de Clase: guion del día + imprimibles  ✅
├── docs/                Manual, guía instructor, glosario, ensayo     ✅
├── slides/              Decks instructor (ES/EN) + infografías alumnos ✅
├── gamificacion/        Sistema de XP, misiones y medallas            ✅
└── scripts/             Utilidades del laboratorio                    ✅
```

> **Estado de construcción:** ✅ listo · ⏳ en construcción. Este README se actualiza
> conforme avanzamos. (Ver [roadmap](#-roadmap-de-construcción).)

---

## 🧰 Stack del curso

**Ruta principal (ligera, para arrancar rápido):** Node.js 22 + Express + PostgreSQL.
**Ruta seria / empresarial (respaldo):** Java 17 + Spring Boot (misma API).

Herramientas: Git · Docker · Docker Compose · GitHub Actions / Jenkins ·
Kubernetes (kind) · Helm · Trivy · Prometheus · Grafana.

---

## 🛠️ Roadmap de construcción

- [x] **M0** Esqueleto del repo + gamificación
- [x] **M1** App demo (`/health`, `/version`, `/courses`) + pruebas
- [x] **M2** Docker (Dockerfile multi-stage + variantes didácticas)
- [x] **M3** Docker Compose (app + PostgreSQL)
- [x] **M4** CI/CD (GitHub Actions + Jenkinsfile)
- [x] **M5** Kubernetes (namespace, deployment, service, configmap, secret)
- [x] **M6** Helm chart
- [x] **M7** DevSecOps (Trivy, checklists)
- [x] **M8** Observabilidad (Prometheus/Grafana, logs)
- [x] **M9** Docs (manual participante, guía instructor, rúbrica, glosario)
- [x] **M10** Slides (8 decks bilingües + infografías para alumnos)
- [x] **M11** Ensayo técnico end-to-end + Plan B

> 🎉 **Curso completo: M0 → M11.**

---

## 📜 Mensaje del curso

> *"DevOps no es solo usar herramientas; es enseñar a pensar en el ciclo completo de vida
> del software. Un programa no termina cuando compila: debe poder probarse, empaquetarse,
> desplegarse, monitorearse y protegerse."*

## Licencia

[MIT](LICENSE) — material educativo libre de usar y adaptar para tus clases.
