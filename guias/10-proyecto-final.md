> 🌐 [English](10-proyecto-final.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 10: Proyecto integrador

| | |
| --- | --- |
| **Misión** | 🏛️ Arquitect@ DevOps — demostrar el ciclo DevOps completo de punta a punta |
| **XP** | +200 XP |
| **Medalla** | 🏛️ Arquitect@ DevOps |
| **Tiempo** | ~45 min (demo de ~5 min) |
| **Dificultad** | ★★★ |

Este es el lab que **junta todo**. En equipos (o individual), vas a demostrar en ~5 minutos el
ciclo DevOps completo que construiste durante el curso usando la **Academia DevOps App**: del
repositorio a Docker, de Compose al pipeline, de Kubernetes al escalamiento, la seguridad y el
monitoreo. Y, lo que hace único a este curso, vas a convertirlo en una **práctica para tus
propios alumnos**.

## 🎒 Antes de empezar

- ✅ Haber completado (o tener a mano) los Labs **1 a 9**: app, Docker, Compose, CI/CD, k8s,
  ConfigMap/Secret, escalamiento, Helm y observabilidad.
- ✅ El **clúster kind corriendo** con la imagen cargada y el namespace `academia` desplegado.
- ✅ Abrir la [plantilla de entrega](../09-proyecto-final/plantilla-entrega.md) y la
  [rúbrica](../09-proyecto-final/rubrica.md) **antes** de empezar la demo.

Comprueba que tienes una base desplegada para demostrar:

```bash
kubectl -n academia get all
```

**Lo que verás:**

```
NAME                                READY   STATUS    RESTARTS   AGE
pod/academia-app-7c9f8d6b54-abcde   1/1     Running   0          10m
pod/academia-app-7c9f8d6b54-fghij   1/1     Running   0          10m

NAME                            TYPE        CLUSTER-IP     PORT(S)   AGE
service/academia-app-service    ClusterIP   10.96.120.42   80/TCP    10m

NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/academia-app   2/2     2            2           10m
```

**¿Qué pasó?** Confirmaste que tienes Pods, un Service y un Deployment vivos: la materia prima
de tu demostración. Si falta algo, vuelve al lab correspondiente antes de presentar.

## 🧭 Qué vas a lograr

- Recorrer el **checklist de demostración** completo: repo → docker → compose → pipeline → k8s
  → escalar → seguridad → monitoreo.
- Responder la **pregunta docente** que define el curso: *"¿cómo lo conviertes en práctica para
  TUS alumnos?"*
- **Autoevaluarte con la rúbrica** (8 criterios × 3 = 24 pts) y ubicar tu rango.
- Llenar la plantilla de entrega y desbloquear la medalla final 🏛️ **Arquitect@ DevOps**.

## 👣 Pasos

### Paso 1 — Repositorio: la fuente de la verdad

```bash
git log --oneline -5
```

**Lo que verás:**

```
a1b2c3d feat: Helm chart para la Academia DevOps App
e4f5g6h ci: pipeline build + test verde
i7j8k9l feat: Dockerfile multi-stage
m0n1o2p feat: app Node con /health y /metrics
q3r4s5t chore: estructura inicial del repo
```

**¿Qué pasó?** Todo arranca en **git**: el historial cuenta la evolución del proyecto. En la
demo, abre el repo y muestra que cada etapa del curso dejó commits — la trazabilidad es el
primer principio DevOps.

### Paso 2 — Docker: construir la imagen

```bash
docker build -t academia-devops-app:1.0.0 ./01-app/node
docker images | grep academia-devops-app
```

**Lo que verás:**

```
academia-devops-app   1.0.0   d3adb33fc0de   2 minutes ago   180MB
```

**¿Qué pasó?** El `Dockerfile` empaquetó la app en una imagen reproducible. "En mi máquina sí
funciona" deja de ser un problema: la imagen corre igual en cualquier lado.

### Paso 3 — Docker Compose: app + base de datos

```bash
docker compose -f 03-compose/docker-compose.yml up -d
docker compose -f 03-compose/docker-compose.yml ps
```

**Lo que verás:**

```
NAME              IMAGE                       STATUS                   PORTS
compose-app-1     academia-devops-app:1.0.0   Up (healthy)             0.0.0.0:8080->8080/tcp
compose-db-1      postgres:16-alpine          Up (healthy)             5432/tcp
```

**¿Qué pasó?** Compose levantó **app + DB juntas** con sus dependencias (`depends_on:
service_healthy`). El `(healthy)` confirma que los healthchecks pasan: la app no arranca antes
que la base de datos.

### Paso 4 — Pipeline CI/CD en verde

```bash
# Muestra el estado del último pipeline (o abre la pestaña Actions en GitHub)
gh run list --limit 1
```

**Lo que verás:**

```
STATUS   TITLE                  WORKFLOW   BRANCH   EVENT   ID
✓        ci: build + test       CI         main     push    1234567890
```

**¿Qué pasó?** El pipeline construyó la imagen y corrió los tests **automáticamente** en cada
push. El ✓ verde es tu red de seguridad: nadie integra código roto. En la demo, muéstralo en
la pestaña **Actions** de GitHub.

### Paso 5 — Kubernetes: desplegar y exponer

```bash
kubectl -n academia get pods,svc
kubectl -n academia port-forward svc/academia-app-service 8080:80
# en otra terminal:
curl http://localhost:8080/health
```

**Lo que verás:**

```
{"status":"UP","store":"memory","db":"ok","uptime_s":12}
```

**¿Qué pasó?** La misma imagen que probaste en local ahora corre en el **clúster**, expuesta
por un Service. El `/health` responde `UP`: la app está desplegada y accesible. Aquí puedes
recordar que el chart de Helm (Lab 8) hace exactamente esto con un solo comando.

### Paso 6 — Escalar a varias réplicas

```bash
kubectl -n academia scale deployment/academia-app --replicas=4
kubectl -n academia get pods
```

**Lo que verás:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-aaaaa   1/1     Running   0          12m
academia-app-7c9f8d6b54-bbbbb   1/1     Running   0          12m
academia-app-7c9f8d6b54-ccccc   1/1     Running   0          15s
academia-app-7c9f8d6b54-ddddd   1/1     Running   0          15s
```

**¿Qué pasó?** Subiste a **4 réplicas** con un comando. Más réplicas = más capacidad y **alta
disponibilidad** (si un Pod muere, los otros siguen sirviendo). Una sola réplica **no** es alta
disponibilidad.

### Paso 7 — Seguridad: escanear la imagen con Trivy

```bash
trivy image academia-devops-app:1.0.0
```

**Lo que verás:** (extracto — Trivy resume vulnerabilidades por severidad)

```
academia-devops-app:1.0.0 (alpine 3.20)
Total: 3 (UNKNOWN: 0, LOW: 1, MEDIUM: 2, HIGH: 0, CRITICAL: 0)
```

**¿Qué pasó?** Trivy revisó la imagen en busca de vulnerabilidades conocidas (CVE). El objetivo
no es tener cero (casi imposible), sino **conocer y decidir** tus riesgos: sin `HIGH`/`CRITICAL`
es una buena señal. La seguridad es parte del ciclo, no un paso final opcional.

### Paso 8 — Monitoreo: logs y métricas

```bash
kubectl -n academia logs --tail=5 deployment/academia-app
curl http://localhost:8080/metrics | head -n 5
```

**Lo que verás:**

```
2026-06-14T18:20:01Z INFO  GET /health 200 2ms
# HELP http_requests_total Total de peticiones HTTP
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status="200"} 87
```

**¿Qué pasó?** Cerraste el ciclo con **observabilidad**: logs para saber *qué pasó* y `/metrics`
para medir *cómo se comporta*. (Si tu equipo aguanta la RAM, aquí enseñas Grafana; si no, el
**Plan B** del Lab 9 con `kubectl top` y capturas.)

### Paso 9 — La capa que hace diferente a este curso: aplicación docente

No basta con que funcione. Esta es la **Capa 4** y el corazón de la medalla 🏛️. En tu entrega
responde:

- ¿Cómo lo **explicarías** a tus alumnos?
- ¿Qué parte sirve como **práctica calificable**?
- ¿Qué **errores** comunes aparecerán y cómo los rescatas?
- ¿Qué **aprendizaje** se busca medir?
- ¿Qué **modificarías** para una materia específica (Programación, BD, Redes, Seguridad...)?

| Materia | Enfoque del laboratorio |
| ------- | ----------------------- |
| Programación | Dockerizar el proyecto del semestre; "en mi máquina sí funciona" resuelto |
| Bases de Datos | Compose con la DB + persistencia + migraciones |
| Redes | Services, puertos, redes internas, DNS de servicios |
| Ingeniería de Software | Pipeline CI/CD como parte del proceso de entrega |
| Seguridad | DevSecOps: Trivy, secretos, securityContext |
| Sistemas Distribuidos | Réplicas, escalamiento, alta disponibilidad |

**¿Qué pasó?** Convertiste una demo técnica en una **propuesta pedagógica**. Esto es lo que un
Arquitect@ DevOps docente aporta: no solo *hacer*, sino *enseñar a hacer*.

### Paso 10 — Autoevaluarte con la rúbrica

Usa la [rúbrica](../09-proyecto-final/rubrica.md): **8 criterios × 3 puntos = 24 puntos**.

| Criterio | 3 · Excelente | 2 · Satisfactorio | 1 · Mejora |
| -------- | ------------- | ----------------- | ---------- |
| Docker | Construye, ejecuta y explica capas | Con apoyo | No ejecuta |
| Docker Compose | App + DB, datos persisten | Parcial | No entiende dependencias |
| CI/CD | Build/test en verde | Parcial | No automatiza |
| Kubernetes | Despliega, expone, escala, actualiza | Básico | No despliega |
| DevSecOps | Escanea e interpreta riesgos | Escanea sin análisis | No aplica seguridad |
| Observabilidad | Logs/métricas + explicación | Logs básicos | No diagnostica |
| Proyecto final | Integra todo + lo adapta a docencia | Parcial | Incompleto |
| Aplicación docente | Práctica clara para alumnos | Idea general | No aterriza a clase |

Suma tus puntos y ubica tu rango:

```text
21–24 pts → 🏛️ Arquitect@ DevOps
14–20 pts → ☸️ Pilot@ de Kubernetes
< 14 pts  → sigue sumando misiones 💪
```

**¿Qué pasó?** Mediste tu **competencia** con un instrumento objetivo. La rúbrica es también tu
modelo para evaluar a tus propios alumnos: cópiala y adáptala.

## ✅ Checkpoint

Has completado el proyecto integrador si:

- [ ] Demostraste el checklist completo: **repo → docker → compose → pipeline → k8s → escalar →
      seguridad → monitoreo**.
- [ ] El `/health` responde `ok` en el clúster y escalaste a **4 réplicas**.
- [ ] Corriste `trivy image` y consultaste **logs** y `/metrics`.
- [ ] Respondiste la **pregunta docente**: *"¿cómo lo conviertes en práctica para TUS alumnos?"*
- [ ] Te autoevaluaste con la **rúbrica (≥ 21 pts para el rango Arquitect@)** y llenaste la plantilla.

Si marcaste todo: 🏛️ **¡Medalla Arquitect@ DevOps desbloqueada! +200 XP**

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `kubectl -n academia get all` sale vacío | No hay nada desplegado | Despliega con el Lab 5 (`kubectl apply`) o el Lab 8 (`helm install`) |
| `gh: command not found` | GitHub CLI no instalado | Muestra el pipeline en la pestaña **Actions** del navegador |
| `trivy: command not found` | Trivy no instalado | Revísalo en el Lab de DevSecOps; o explica el reporte con una captura |
| Compose marca `unhealthy` | La DB tarda en arrancar | Espera unos segundos y repite `docker compose ps`; revisa `DB_PASSWORD` |
| `port 8080 ocupado` | Otro proceso usa el puerto | Usa otro: `port-forward svc/academia-app-service 8081:80` |
| El pipeline está en rojo | Falló build o test | Abre el run, lee el log del paso fallido y corrígelo antes de demostrar |

## 🏆 Reto extra (+20 XP)

Haz tu demo **end-to-end de un tirón** y crónometrala en 5 minutos: desde `helm install` hasta
`trivy image`, pasando por escalar y mostrar logs, **sin notas**. Si puedes contarlo como una
historia ("primero empaqueto, luego despliego, escalo, aseguro y observo"), ya piensas como
arquitect@. Graba la pantalla y úsalo como material para tu clase.

## 🎓 Cómo enseñarlo a tus alumnos

- **La gran idea:** no es una lista de herramientas sueltas, es **una sola app** acompañada por
  todo su ciclo de vida. Que tus alumnos cuenten *la historia*, no que memoricen comandos.
- **El momento "¡ajá!":** la demo de 5 minutos en vivo. Ver el flujo completo —de un commit a
  una app escalada y monitoreada— vuelve concreto todo lo abstracto del semestre.
- **Pregunta para discutir:** *"¿en qué parte de mi materia encaja cada etapa?"* — esa es la
  Capa 4 que distingue este curso de un tutorial cualquiera.
- **Evalúa con la rúbrica delante de ellos:** que vean los 8 criterios; saber cómo se les
  califica los enfoca. Reparte la medalla 🏛️ en voz alta a quien integre todo.
- **Error productivo final:** deja que alguien intente la demo sin haber desplegado; el
  `get all` vacío enseña que "demostrar" exige preparar el ambiente, igual que en producción.

## 🎉 ¡Felicidades, Arquitect@ DevOps!

Completaste el ciclo entero: versionaste, **contenerizaste**, **automatizaste**, **desplegaste**,
**escalaste**, **aseguraste** y **monitoreaste** una aplicación real — y aprendiste a convertir
todo eso en práctica para tus alumnos. Esa es la diferencia entre *usar* herramientas y
**pensar como arquitect@**. 🏛️✨

> Lleva tus medallas (🧰 🐳 ☸️ 🔐 📈 🎁 🔭 🏛️) y tu XP a la siguiente clase: ahora te toca a ti
> ser quien reparte misiones.

➡️ **Vuelve al inicio del repo:** [README del curso](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso)
