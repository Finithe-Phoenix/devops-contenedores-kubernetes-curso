> 🌐 [English](README.en.md) · **Español**

# 🎓 Kit de Clase — tu guion del día

Todo lo que necesitas para **entrar al salón y solo enseñar**. Sigue esto y das la clase sin sorpresas.

---

## 🔌 Encender la clase (1 comando)

Cada mañana, desde la raíz del repo:

```powershell
pwsh scripts/clase.ps1      # Windows
```
```bash
bash scripts/clase.sh       # Linux / macOS / WSL
```

Esto verifica Docker, pre-descarga imágenes, levanta **app + base de datos** y abre el
**Centro de Mando** en `http://localhost:8080/`. Para apagar al final:
`docker compose -f 03-compose/docker-compose.yml down`.

---

## ✅ Pre-flight (la noche anterior / 30 min antes)

- [ ] **Docker Desktop** abierto y estable (la ballena 🐳 quieta).
- [ ] Corre `pwsh scripts/clase.ps1` → el Centro de Mando abre en verde.
- [ ] Imágenes pre-descargadas (`node:22-alpine`, `postgres:16-alpine`) — el launcher ya las baja.
- [ ] **Día 3/4:** prueba el clúster la noche anterior → `bash scripts/create-kind-cluster.sh` *o* `minikube start`.
- [ ] Abre los **slides** del día (`slides/`) y ten a la mano la [Guía del Instructor](../docs/Guia_Instructor.md).
- [ ] Imprime los [imprimibles](imprimibles/) (cockpit + tarjeta de logros).
- [ ] USB de emergencia con el repo comprimido (Plan B si falla el internet).

---

## 🗓️ Día 1 — Fundamentos, Git y Docker
**Deck:** `slides/01_Dia_1_DevOps_Docker.pptx` · **Guías:** [00-ambiente](../guias/00-ambiente.md), [01-docker](../guias/01-docker.md)

| Hora | Bloque | Haz esto |
| ---- | ------ | -------- |
| 9:00 | Apertura | Proyecta el **Centro de Mando** (ya abierto). Muestra `/health` en vivo. Pregunta: *¿cómo despliegan hoy?* |
| 9:40 | Fundamentos | Deck. Dinámica: cada profe dice *en qué materia suya entra DevOps*. |
| 10:40 | Git | `git clone`, rama, commit (Guía 00). |
| 11:45 | Docker | `docker run hello-world`; **imagen vs contenedor** (infografía #2). |
| 12:45 | **Lab 1** | [Guía 01](../guias/01-docker.md): todos construyen y corren la imagen; `/health` responde. |
| 14:00 | Cierre | Evidencias → medalla 🐳. Cierra con el **reto Docker** del 🕵️ Detective de bugs. |

## 🗓️ Día 2 — Compose, CI/CD y DevSecOps
**Deck:** `slides/02_Dia_2_Compose_CICD_DevSecOps.pptx` · **Guías:** [02](../guias/02-compose.md), [03](../guias/03-cicd.md), [04](../guias/04-devsecops-trivy.md)

| Hora | Bloque | Haz esto |
| ---- | ------ | -------- |
| 9:00 | Repaso | El launcher ya levantó Compose. **Demo persistencia:** crea un curso, reinicia la app, sigue ahí. |
| 9:30 | **Lab 2** | [Guía 02](../guias/02-compose.md): app + PostgreSQL. Mira la **consola de peticiones** del Centro de Mando. |
| 11:05 | **Lab 3** | [Guía 03](../guias/03-cicd.md): pipeline verde en GitHub Actions. **Rompe un test → rojo → arregla → verde.** |
| 13:30 | **Lab 4** | [Guía 04](../guias/04-devsecops-trivy.md): `trivy image`. Interpreta hallazgos. |
| 14:30 | Cierre | Detective: **retos Compose**. Medallas 🧩 ⚙️ 🛡️. |

## 🗓️ Día 3 — Kubernetes y Helm
**Deck:** `slides/03_Dia_3_Kubernetes_Helm.pptx` · **Guías:** [05](../guias/05-kubernetes-despliegue.md), [06](../guias/06-config-secrets.md), [07](../guias/07-escalar-rollback.md), [08](../guias/08-helm.md)

> ⚠️ **Levanta el clúster ANTES del bloque 2** (puede tardar): `bash scripts/create-kind-cluster.sh` o `minikube start`.

| Hora | Bloque | Haz esto |
| ---- | ------ | -------- |
| 9:00 | Intro K8s | Deck + infografía #7 (arquitectura). |
| 10:00 | Clúster | Crea el clúster y **carga la imagen** (`kind load docker-image …` o `docker save … \| minikube image load`). |
| 11:00 | **Lab 5** | [Guía 05](../guias/05-kubernetes-despliegue.md): deployment + service + port-forward. |
| 12:15 | **Lab 6** | [Guía 06](../guias/06-config-secrets.md): ConfigMap/Secret. Demo: `base64` **no** es cifrado. |
| 13:00 | **Lab 7** | [Guía 07](../guias/07-escalar-rollback.md): escalar a 4, rolling update, rollback. |
| 14:00 | **Lab 8** | [Guía 08](../guias/08-helm.md): `helm install/upgrade/rollback`. |

## 🗓️ Día 4 — Observabilidad, DevSecOps y Proyecto
**Deck:** `slides/04_Dia_4_Observabilidad_DevSecOps_Proyecto.pptx` · **Guías:** [09](../guias/09-observabilidad.md), [10](../guias/10-proyecto-final.md)

| Hora | Bloque | Haz esto |
| ---- | ------ | -------- |
| 9:00 | Observabilidad | [Guía 09](../guias/09-observabilidad.md). **Plan B** si no hay RAM: `/metrics` + `kubectl top` + capturas. |
| 11:30 | Logging | `kubectl logs / events / describe`. Logs buenos vs peligrosos. |
| 12:15 | DevSecOps | `deployment-with-probes.yaml` (probes, límites, securityContext). |
| 13:20 | GitOps/IaC | Solo concepto: diagrama de madurez (infografía + deck). |
| 14:00 | **Proyecto final** | [Guía 10](../guias/10-proyecto-final.md). Evalúa con la [rúbrica](../09-proyecto-final/rubrica.md). Medalla 🏛️. |

---

## 🆘 Botón de pánico (errores comunes → fix de 1 línea)

| Síntoma | Fix inmediato |
| ------- | ------------- |
| Docker no responde | Abre Docker Desktop, espera la ballena 🐳, reintenta. |
| Puerto 8080 ocupado | `docker compose -f 03-compose/docker-compose.yml down` o `docker rm -f academia`. |
| Compose "no recrea" el contenedor | Agrega `--force-recreate` (el launcher ya lo hace). |
| `/health` → `"db":"down"` | Espera a que Postgres esté *healthy*; revisa que `DB_HOST=db`. |
| Pod `ImagePullBackOff` (kind) | `kind load docker-image academia-devops-app:1.0.0 --name devops-course`. |
| Pod `ImagePullBackOff` (minikube) | `docker save academia-devops-app:1.0.0 -o img.tar && minikube image load img.tar`. |
| minikube no levanta | `minikube delete && minikube start`. |
| Internet lento | Las imágenes ya están pre-descargadas; usa la demo proyectada. |

---

## 🔗 Accesos rápidos

- **Centro de Mando:** http://localhost:8080/ (tour guiado + Detective de bugs en vivo)
- **Guía del Instructor (detalle pedagógico):** [`docs/Guia_Instructor.md`](../docs/Guia_Instructor.md)
- **Guías paso a paso:** [`guias/`](../guias/README.md) · **Retos:** [`retos/`](../retos/README.md)
- **Slides:** [`slides/`](../slides/README.md) · **Infografías:** [`slides/`](../slides/README.md) (PNG + PPTX)
- **Ensayo técnico (pruébalo todo antes):** [`docs/ensayo-tecnico.md`](../docs/ensayo-tecnico.md)
- **🖨️ Imprimibles (PDF):** [`imprimibles/`](imprimibles/)

> *Primero que funcione. Luego que se vea bonito. Después que sea enseñable.* — ya están las tres. 🚀
