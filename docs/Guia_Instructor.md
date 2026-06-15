# 🎓 Guía del Instructor
## Curso-Taller: DevOps y Contenedores con Docker & Kubernetes

> Para Daniel y cualquier facilitador. Por bloque: objetivo, tiempo, qué explicar,
> qué demostrar, errores esperados, cómo rescatar y preguntas detonadoras.

---

## Filosofía de facilitación (las 4 capas)

Cada tema se enseña en 4 capas: **Concepto** (el porqué) → **Demostración** (instructor)
→ **Laboratorio guiado** (todos replican) → **Aplicación docente** (¿cómo lo enseño yo?).
La capa 4 es lo que diferencia este curso: son profesores, no solo operadores.

## Reglas de oro

1. **Primero que funcione.** Si un lab se atora, usa el Plan B y sigue; no detengas al grupo.
2. **Demuestra antes de pedir.** Que vean el resultado esperado antes de teclear.
3. **Errores = oro.** Cada error común es una mini-lección. Provócalos a propósito.
4. **Gamifica.** Lleva el tablero de XP; celebra cada medalla.
5. **Ritmo > cobertura.** Mejor entender Docker+K8s bien que tocar todo a medias.

---

# DÍA 1 — Fundamentos, Git, Docker

### Bloque 1 · Apertura (9:00-9:40)
- **Objetivo:** enganchar y nivelar expectativas.
- **Demuestra:** el repo del curso y la app ya corriendo (`/health`).
- **Pregunta detonadora:** *¿cómo despliegan hoy sus proyectos? ¿qué se rompe?*
- **Plan B:** si no hay internet, proyecta capturas.

### Bloque 2 · Fundamentos DevOps (9:40-10:40)
- **Explica:** DevOps como cultura + automatización; ciclo build→test→deploy→monitor→secure.
- **Demuestra:** el diagrama del ciclo y el mapa de herramientas del curso.
- **Aplicación docente:** que cada profe diga en qué materia suya entra DevOps.

### Bloque 3 · Git (10:40-11:30)
- **Demuestra:** clonar, rama, commit, push, PR.
- **Lab 1A:** clonar el repo, crear rama `feature/dockerfile`.
- **Errores:** CRLF en `.sh` (ya mitigado con `.gitattributes`); credenciales de GitHub.
- **Pregunta:** *¿cómo garantizas que TODOS tus alumnos tengan el mismo ambiente?*

### Bloque 4 · Docker (11:45-12:45)
- **Explica:** imagen vs contenedor; contenedor vs VM.
- **Demuestra:** `docker run hello-world`, `docker ps`, `docker logs`.
- **Pregunta:** *¿qué problema resuelve un contenedor?*

### Bloque 5 · Dockerfile (12:45-14:00)
- **Lab 1:** construir la imagen de la app y correrla; `/health` responde.
  Guía: [`02-docker/comandos-docker.md`](../02-docker/comandos-docker.md).
- **Demuestra:** comparar `Dockerfile.secure` vs `Dockerfile.insecure` (tamaño y riesgos).
- **Errores esperados:** puerto 8080 ocupado, daemon apagado, falta lockfile.
- **Rescate:** `docker rm -f`, abrir Docker Desktop, `npm install` para el lock.

### Bloque 6 · Cierre (14:00-15:00)
- **Evidencia:** `docker images`, `docker ps`, `/health`, Dockerfile. → medalla 🐳.

---

# DÍA 2 — Compose, CI/CD, DevSecOps básico

### Bloque 1 · Repaso (9:00-9:30) — validar ambiente, revisar errores de ayer.

### Bloque 2 · Docker Compose (9:30-10:50)
- **Lab 2:** app + PostgreSQL; demostrar **persistencia** (curso que sobrevive a `restart`).
  Guía: [`03-compose/comandos-compose.md`](../03-compose/comandos-compose.md).
- **Errores:** puerto 5432 ocupado, app no resuelve `db`, volumen con datos viejos.
- **Pregunta:** *¿por qué la app llama a la DB por nombre y no por IP?*

### Bloque 3-4 · CI/CD (11:05-13:30)
- **Explica:** pipeline como línea de producción; CI vs CD.
- **Lab 3:** ver el workflow correr en GitHub Actions (ya está en el repo).
  Guía: [`04-cicd/pipeline-explicado.md`](../04-cicd/pipeline-explicado.md).
- **Demuestra:** romper un test → rojo → arreglar → verde.
- **Errores:** falta lockfile, rama equivocada en `on:`, tests dependientes del entorno.
- **Pregunta:** *¿qué validaciones debe pasar el código antes de aceptarse?*

### Bloque 5 · DevSecOps intro (13:30-14:30)
- **Lab 4:** `trivy image`; interpretar hallazgos; detectar secreto quemado.
  Guía: [`08-devsecops/trivy.md`](../08-devsecops/trivy.md).
- **Pregunta:** *¿qué detecta la herramienta y qué necesita criterio humano?*

### Bloque 6 · Cierre (14:30-15:00) — evidencias. → medallas 🧩 ⚙️ 🛡️.

---

# DÍA 3 — Kubernetes y Helm

### Bloque 1 · Intro K8s (9:00-10:00)
- **Explica:** qué problema resuelve; Pod/Deployment/Service/Namespace.
- **Demuestra:** diagrama usuario→Service→Pod y Deployment→ReplicaSet→Pods.

### Bloque 2 · Clúster (10:00-10:45)
- **Demuestra:** `bash scripts/create-kind-cluster.sh`.
- ⚠️ **Clave:** en kind hay que **cargar** la imagen (`kind load docker-image`) o sale `ImagePullBackOff`.

### Bloque 3 · Deployment + Service (11:00-12:15)
- **Lab 5:** aplicar manifiestos, port-forward, `/health`.
  Guía: [`05-kubernetes/comandos-kubectl.md`](../05-kubernetes/comandos-kubectl.md).
- **Errores:** `ImagePullBackOff` (imagen no cargada), selector que no coincide, namespace.

### Bloque 4 · Config y Secret (12:15-13:00)
- **Lab 6:** ConfigMap + Secret; demostrar que **base64 no es cifrado**.
- **Pregunta:** *¿qué va en configuración y qué va en secreto?*

### Bloque 5 · Escalar, update, rollback (13:00-14:00)
- **Lab 7:** `scale`, `set image`, `rollout undo`.
- **Pregunta:** *¿por qué una réplica NO es alta disponibilidad?*

### Bloque 6 · Helm (14:00-15:00)
- **Lab 8:** `helm install/upgrade --set replicaCount=4/rollback`.
  Guía: [`06-helm/comparativa-yaml-vs-helm.md`](../06-helm/comparativa-yaml-vs-helm.md).
- **Pregunta:** *¿cuándo conviene Helm sobre YAML manual?*

---

# DÍA 4 — Observabilidad, DevSecOps, Proyecto

### Bloque 1-2 · Observabilidad (9:00-11:15)
- **Explica:** logs vs métricas vs trazas; qué monitorear.
- **Lab 9:** stack kube-prometheus con Helm; entrar a Grafana.
  Guía: [`07-observability/prometheus-grafana.md`](../07-observability/prometheus-grafana.md).
- **Plan B:** si no levanta (RAM), usa `/metrics` + `kubectl top` + capturas.

### Bloque 3 · Logging (11:30-12:15)
- **Lab:** `kubectl logs`, `events`, `describe`. Logs buenos vs peligrosos.
  Guía: [`07-observability/logs.md`](../07-observability/logs.md).

### Bloque 4 · DevSecOps aplicado (12:15-13:20)
- **Demuestra:** `deployment-with-probes.yaml` (probes, límites, securityContext).
  Guías: [`08-devsecops/checklist-seguridad.md`](../08-devsecops/checklist-seguridad.md), [`recomendaciones.md`](../08-devsecops/recomendaciones.md).

### Bloque 5 · GitOps/IaC conceptual (13:20-14:00)
- **Explica (solo concepto):** GitOps (Argo CD/Flux), Terraform *provisiona*, Ansible *configura*.
- **Demuestra:** el diagrama de madurez DevOps (1 manual → 10 plataforma interna).

### Bloque 6 · Proyecto final (14:00-15:00)
- **Lab 10:** cada equipo demuestra el flujo completo + propuesta docente.
  Guía: [`09-proyecto-final/instrucciones.md`](../09-proyecto-final/instrucciones.md).
- **Evalúa:** con la [rúbrica](../09-proyecto-final/rubrica.md). → medalla 🏛️.

---

## Plan B por escenario (resumen)

| Problema | Plan B |
| -------- | ------ |
| Docker no funciona | Demo proyectada / por parejas / Codespaces |
| Kubernetes no levanta | kind en la laptop del instructor / explicar YAML |
| Internet lento | Imágenes predescargadas / USB con repo |
| Equipos bloqueados | WSL2 / por parejas / instalación como tarea |
| Grupo muy básico | Reduce Helm y monitoreo; enfócate en Docker/Compose/K8s básico |
| Grupo avanzado | Agrega Trivy en pipeline, probes, GitOps con demo de Argo CD |

## Antes de cada día (checklist del instructor)
- [ ] Docker Desktop abierto y con la ballena estable.
- [ ] Imágenes base predescargadas (`node:22-alpine`, `postgres:16-alpine`).
- [ ] Clúster kind probado la noche anterior.
- [ ] Tablero de XP listo.
- [ ] USB de emergencia con el repo comprimido.
