> 🌐 [English](09-observabilidad.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 9: Monitoreo y logs

| | |
| --- | --- |
| **Misión** | 🔭 Observador — ver qué hace tu app en vivo (logs, métricas, salud) |
| **XP** | +90 XP |
| **Medalla** | 🔭 Observador |
| **Tiempo** | ~30 min |
| **Dificultad** | ★★☆ |

Desplegar no es suficiente: necesitas **saber qué está pasando dentro**. En este lab vas a
leer logs en vivo, investigar eventos, entender las **probes** de salud, conocer el endpoint
`/metrics` y, si tu equipo aguanta la RAM, levantar Prometheus + Grafana con Helm. Si no
aguanta, hay un **Plan B** que enseña lo mismo con menos recursos.

## 🎒 Antes de empezar

- ✅ La **app desplegada** en el namespace `academia` (del Lab 5 con `kubectl`, o del Lab 8 con Helm).
- ✅ `kubectl` apuntando al clúster correcto (`kubectl config current-context` → `kind-devops-course`).
- ✅ (Opcional, para el stack pesado) **Helm v3** y al menos **~4 GB de RAM libres** en Docker Desktop.

> 🪟 **¿Estás en Windows?** Los comandos de abajo son estilo Linux/Mac. En **PowerShell** algunos cambian
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). Verás la versión Windows debajo de cada
> comando que cambia. Si te atoras, ten a mano la **[chuleta de PowerShell](windows-powershell.md)**.

Comprueba que la app está arriba antes de observarla:

```bash
kubectl -n academia get pods
```

**Lo que verás:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-abcde   1/1     Running   0          5m
academia-app-7c9f8d6b54-fghij   1/1     Running   0          5m
```

**¿Qué pasó?** Confirmaste que hay Pods `Running` que generar logs y métricas. Si no
aparecen, vuelve al Lab 5 o al Lab 8 a desplegar antes de seguir.

## 🧭 Qué vas a lograr

- Nombrar los **3 pilares** de la observabilidad: **logs**, **métricas** y **trazas**.
- Leer logs **en vivo**, ver **eventos** y **describir** un Pod para diagnosticar.
- Entender las **probes**: `readinessProbe` (¿lista para tráfico?) y `livenessProbe` (¿sigue viva?).
- Ver el endpoint `/metrics` en **formato Prometheus**.
- Levantar Prometheus + Grafana con Helm **o** aplicar el **Plan B** si la RAM no alcanza.

## 👣 Pasos

### Paso 1 — Los 3 pilares de la observabilidad

| Pilar | Responde a... | En este curso |
| ----- | ------------- | ------------- |
| **Logs** | ¿Qué pasó exactamente? | `kubectl logs` |
| **Métricas** | ¿Cómo se comporta en el tiempo? | `/metrics` + Prometheus |
| **Trazas** | ¿Por dónde pasó una petición? | concepto (avanzado) |

Nuestra app ya expone métricas en `/metrics`; Prometheus las "raspa" (scrapea) de ahí.

**¿Qué pasó?** Te quedaste con el mapa mental: los **logs** cuentan *qué* pasó, las
**métricas** miden *cómo* se comporta en el tiempo y las **trazas** siguen *por dónde* viajó
una petición. Hoy trabajas a fondo los dos primeros.

### Paso 2 — Leer los logs en vivo

```bash
# Sigue los logs del deployment en tiempo real (Ctrl+C para salir)
kubectl -n academia logs -f deployment/academia-app
```

**Lo que verás:**

```
2026-06-14T18:10:01Z INFO  server listening on :8080
2026-06-14T18:10:05Z INFO  GET /health 200 2ms
2026-06-14T18:10:12Z INFO  GET /metrics 200 4ms
```

**¿Qué pasó?** Con `-f` (follow) los logs aparecen **en vivo**: cada petición que llega deja
una línea con timestamp, nivel (`INFO`) y resultado. Es tu primera herramienta de diagnóstico
cuando algo "no anda". Repasa más comandos en [`../07-observability/logs.md`](../07-observability/logs.md).

### Paso 3 — Ver los eventos del namespace

Los logs cuentan lo que dice la app; los **eventos** cuentan lo que hace Kubernetes con ella.

```bash
kubectl -n academia get events --sort-by=.lastTimestamp
```

**Lo que verás:**

```
LAST SEEN   TYPE     REASON      OBJECT                              MESSAGE
3m          Normal   Scheduled   pod/academia-app-7c9f8d6b54-abcde   Successfully assigned ...
3m          Normal   Pulled      pod/academia-app-7c9f8d6b54-abcde   Container image already present
3m          Normal   Started     pod/academia-app-7c9f8d6b54-abcde   Started container academia-app
```

**¿Qué pasó?** Los eventos son **oro puro** para diagnosticar: te dicen si un Pod se programó,
si la imagen se descargó, si una probe falló o si hubo un `OOMKilled`. Cuando un Pod no
arranca, este es el primer lugar donde mirar.

### Paso 4 — Describir un Pod

```bash
# Toma un nombre de pod del paso 1 y descríbelo
kubectl -n academia describe pod academia-app-7c9f8d6b54-abcde
```

**Lo que verás:** (extracto — lo importante es la sección final `Events` y el estado de las probes)

```
Name:         academia-app-7c9f8d6b54-abcde
Status:       Running
Containers:
  academia-app:
    State:          Running
    Ready:          True
    Restart Count:  0
    Liveness:   http-get http://:8080/health delay=5s period=10s
    Readiness:  http-get http://:8080/health delay=3s period=5s
Events:
  Type    Reason     Message
  Normal  Started    Started container academia-app
```

**¿Qué pasó?** `describe` te da la **ficha completa** del Pod: estado, número de reinicios, las
probes configuradas y los eventos recientes. Aquí verías el motivo si un Pod estuviera en
`CrashLoopBackOff` o `ImagePullBackOff`.

### Paso 5 — Entender las probes (readiness y liveness)

Tu `deployment.yaml` define dos sondas de salud que apuntan a `/health`:

```yaml
readinessProbe:           # ¿está LISTA para recibir tráfico?
  httpGet:
    path: /health
    port: 8080
livenessProbe:            # ¿sigue VIVA? si falla, Kubernetes la reinicia
  httpGet:
    path: /health
    port: 8080
```

**¿Qué pasó?** Son dos preguntas distintas:
- **`readinessProbe`** = *"¿lista para tráfico?"* — si falla, el Service deja de mandarle
  peticiones (pero **no** la reinicia). Útil mientras la app arranca.
- **`livenessProbe`** = *"¿sigue viva?"* — si falla repetidamente, Kubernetes **reinicia** el
  contenedor. Útil cuando la app se cuelga.

Por eso `/health` es tan importante: es el "pulso" que Kubernetes vigila.

### Paso 6 — Ver las métricas en formato Prometheus

```bash
# En una terminal: abre el túnel hacia el Service
kubectl -n academia port-forward svc/academia-app-service 8080:80
# En otra terminal: consulta /metrics
curl http://localhost:8080/metrics
```

> 🪟 **Windows (PowerShell):** la última línea es `curl.exe http://localhost:8080/metrics` (con `.exe`;
> en PowerShell `curl` es otro comando). El `port-forward` corre igual.

**Lo que verás:** (extracto — texto plano, una métrica por línea)

```
# HELP http_requests_total Total de peticiones HTTP
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status="200"} 42
# HELP process_resident_memory_bytes Memoria residente del proceso
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 3.1457280e+07
```

**¿Qué pasó?** La app expone sus números internos en **formato Prometheus** (texto plano:
`nombre{etiquetas} valor`). Prometheus visita esta URL cada pocos segundos y guarda los
valores en el tiempo. Sin escribir nada, ya tienes métricas listas para graficar.

### Paso 7 — (Ruta completa) Levantar Prometheus + Grafana con Helm

> ⚠️ Este stack consume varios GB de RAM. Si tu equipo es modesto, **salta al Plan B (Paso 8)**.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
kubectl -n monitoring get pods       # espera a que TODOS estén Running (tarda unos minutos)
```

**Lo que verás:**

```
NAME: monitoring
NAMESPACE: monitoring
STATUS: deployed
REVISION: 1
```

Luego entra a Grafana:

```bash
# Usuario por defecto: admin
kubectl -n monitoring get secret monitoring-grafana \
  -o jsonpath='{.data.admin-password}' | base64 -d ; echo
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
# Abre http://localhost:3000  (admin / <la contraseña de arriba>)
```

**¿Qué pasó?** Instalaste con **un chart de Helm** un stack completo de monitoreo. Grafana ya
trae dashboards listos de **CPU, memoria, estado de Pods y red**: justo lo que un equipo de
operaciones mira para saber si todo está sano.

### Paso 8 — (Plan B) Observar sin el stack pesado

Si Prometheus/Grafana no levantan por falta de RAM, observas lo mismo con herramientas ligeras:

```bash
# Métricas de la app directo de su endpoint
curl http://localhost:8080/metrics
# Uso real de CPU/memoria por Pod (necesita metrics-server)
kubectl -n academia top pods
```

> 🪟 **Windows (PowerShell):** la primera línea es `curl.exe http://localhost:8080/metrics` (con `.exe`;
> en PowerShell `curl` es otro comando). El `kubectl top` corre igual.

**Lo que verás:**

```
NAME                            CPU(cores)   MEMORY(bytes)
academia-app-7c9f8d6b54-abcde   2m           30Mi
academia-app-7c9f8d6b54-fghij   1m           29Mi
```

**¿Qué pasó?** Con `/metrics` (los números de la app) + `kubectl top` (CPU/memoria reales) +
**capturas de dashboards** para explicar el concepto, cubres el aprendizaje de observabilidad
**sin** quemar la RAM del equipo. El objetivo no es la herramienta, es la **mentalidad** de
"medir antes de adivinar".

## ✅ Checkpoint

Has completado el lab si:

- [ ] Sabes nombrar los **3 pilares**: logs, métricas y trazas.
- [ ] `kubectl -n academia logs -f deployment/academia-app` muestra logs **en vivo**.
- [ ] `kubectl -n academia get events` y `describe pod` te muestran el estado y los eventos.
- [ ] Distingues **readinessProbe** (¿lista?) de **livenessProbe** (¿viva? la reinicia).
- [ ] `curl .../metrics` devuelve texto en **formato Prometheus**.
- [ ] Levantaste Grafana **o** aplicaste el **Plan B** (`/metrics` + `kubectl top` + capturas).

Si marcaste lo anterior: 🔭 **¡Medalla Observador desbloqueada! +90 XP**

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| Pods de `monitoring` en `Pending` mucho rato | Falta RAM en el clúster kind | Usa el **Plan B**, o dale más RAM a Docker Desktop |
| `error: Metrics API not available` en `kubectl top` | Falta `metrics-server` | Instálalo, o usa `/metrics` de la app como alternativa |
| `port 3000 ocupado` | Otro proceso usa el puerto | Usa otro: `port-forward svc/monitoring-grafana 3001:80` |
| Grafana no carga el dashboard | El stack aún está levantando | Espera: `kube-prometheus-stack` tarda varios minutos |
| `/metrics` no responde | El port-forward se cerró o el Pod no está `Running` | Revisa `kubectl -n academia get pods` y reabre el túnel |
| `No resources found` en `get events` | Namespace equivocado | Añade `-n academia` al comando |
| 🪟 *"Subsistema de Windows para Linux no tiene distribuciones instaladas"* | Usaste `bash` en Windows (apunta a WSL) | Usa `pwsh` — ver [chuleta de PowerShell](windows-powershell.md) |
| 🪟 `curl` muestra una respuesta rara/larga | En PowerShell `curl` = `Invoke-WebRequest` | Usa `curl.exe` (con `.exe`) o abre la URL en el navegador |

## 🏆 Reto extra (+15 XP)

Simula un incidente y diagnostícalo **solo con observabilidad** (basado en
[`../07-observability/incident-simulation.md`](../07-observability/incident-simulation.md)):

```bash
# Provoca reinicios bajando el límite de memoria (luego revierte)
kubectl -n academia set resources deployment/academia-app --limits=memory=16Mi
kubectl -n academia get pods -w        # 👀 mira subir los RESTARTS / OOMKilled
kubectl -n academia describe pod <pod> | grep -A3 "Last State"
# Revierte cuando termines:
kubectl -n academia set resources deployment/academia-app --limits=memory=128Mi
```

> 🪟 **Windows (PowerShell):** la línea con `grep` es
> `kubectl -n academia describe pod <pod> | Select-String -Context 0,3 "Last State"`. El resto corre igual.

Pregúntate: con los logs, los eventos y `describe`, **¿puedes explicar por qué se reinició sin
adivinar?**

## 🎓 Cómo enseñarlo a tus alumnos

- **La gran pregunta del lab:** *"¿cómo sé que mi app está **viva**, **sana** y **por qué
  falló**?"* — los 3 pilares responden esas tres preguntas.
- **El momento "¡ajá!":** baja el `memory limit` a propósito y deja `kubectl get pods -w`
  corriendo; ver los `RESTARTS` subir solos vuelve tangible para qué sirve una probe.
- **Pregunta para discutir:** *¿qué diferencia hay entre readiness y liveness?* (Readiness te
  saca del balanceador; liveness te reinicia. Confundirlas causa downtime o reinicios eternos.)
- **Sé honesto con la RAM:** si el aula tiene máquinas modestas, **usa el Plan B sin culpa**.
  El concepto (medir antes de adivinar) se enseña igual con `/metrics`, `top` y capturas.
- **Conecta con DevSecOps:** recuérdales que un secreto en un log **es un secreto filtrado**;
  observabilidad y seguridad van juntas.

## ⏭️ Siguiente

➡️ **Lab 10 — 🏛️ Arquitect@ DevOps:** [el proyecto integrador final](10-proyecto-final.md).
Ya sabes construir, empaquetar, desplegar y observar. Llegó el momento de **juntarlo todo** en
una demo completa del ciclo DevOps y de convertirlo en una práctica para tus propios alumnos.
