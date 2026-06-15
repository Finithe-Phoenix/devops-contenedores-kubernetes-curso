> 🌐 [English](08-helm.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 8: Empaquetar con Helm

| | |
| --- | --- |
| **Misión** | 🎁 Empaquetador Helm — convertir tus manifiestos en un chart parametrizable |
| **XP** | +100 XP |
| **Medalla** | 🎁 Empaquetador Helm |
| **Tiempo** | ~30 min |
| **Dificultad** | ★★☆ |

Hasta ahora desplegabas con `kubectl apply -f` archivo por archivo. En este lab vas a
**empaquetar todo en un chart de Helm**: un solo paquete versionado que instalas, actualizas
y desinstalas con un comando, y al que puedes cambiarle los valores **sin tocar las plantillas**.

## 🎒 Antes de empezar

- ✅ Tener el **clúster del Lab 5 corriendo** (kind `devops-course`) con la imagen
  `academia-devops-app:1.0.0` ya cargada (`kind load docker-image ...`).
- ✅ **Helm v3 instalado** (`helm version` debe responder `v3.x`). Lo validaste en el Lab 0.
- ✅ Una terminal abierta en la **raíz del repo** (los comandos usan rutas como `./06-helm/...`).

Comprueba rápido que Helm responde y el clúster está vivo:

```bash
helm version
kubectl get nodes
```

**Lo que verás:**

```
version.BuildInfo{Version:"v3.15.0", GitCommit:"...", GoVersion:"go1.22"}
NAME                         STATUS   ROLES           AGE   VERSION
devops-course-control-plane  Ready    control-plane   1h    v1.30.0
```

**¿Qué pasó?** Confirmaste que tienes el cliente de Helm (no necesita servidor en Helm 3) y
un clúster donde instalar el chart. Si `kubectl get nodes` falla, vuelve al Lab 5 a crear el clúster.

## 🧭 Qué vas a lograr

- Entender **por qué** Helm le gana al YAML copiado y pegado entre ambientes.
- **Validar** el chart sin desplegar (`helm lint`) y **renderizar** el YAML final (`helm template`).
- **Instalar** la app como un release de Helm en su propio namespace.
- **Escalar** a 3 réplicas con `--set` sin editar ningún archivo, y ver el **historial de versiones**.
- **Desinstalar** todo limpiamente con un solo comando y desbloquear 🎁 **Empaquetador Helm**.

## 👣 Pasos

### Paso 1 — Entender qué resuelve Helm

Con YAML manual, para sostener 3 ambientes (dev/qa/prod) terminas **copiando y pegando** los
mismos manifiestos y cambiando valores a mano. Helm los convierte en una **plantilla
parametrizable**: un solo chart, muchos despliegues, gobernados por `values.yaml`.

| Tarea | YAML manual | Helm |
| ----- | ----------- | ---- |
| Cambiar réplicas en 3 ambientes | Editar 3 archivos | `--set replicaCount=N` |
| Instalar todo | `kubectl apply -f` (uno por uno) | `helm install` (todo junto) |
| Actualizar | aplicar y rezar | `helm upgrade` (versionado) |
| Volver atrás | manual | `helm rollback` (1 comando) |
| Reutilizar | copiar/pegar | un chart, muchos `values` |

Repasa la comparativa completa en [`../06-helm/comparativa-yaml-vs-helm.md`](../06-helm/comparativa-yaml-vs-helm.md).

**¿Qué pasó?** Pasaste de pensar en "archivos sueltos" a pensar en un **paquete** con su
versión, sus parámetros y su ciclo de vida (instalar → actualizar → revertir → desinstalar).

### Paso 2 — Conocer la estructura del chart

```bash
ls 06-helm/academia-app-chart
```

**Lo que verás:**

```
Chart.yaml   values.yaml   templates/
```

El chart que ya viene en el repo tiene esta forma:

```text
academia-app-chart/
├── Chart.yaml           # metadatos (nombre, versión del chart y de la app)
├── values.yaml          # los parámetros (réplicas, imagen, recursos...)
└── templates/
    ├── _helpers.tpl     # funciones reutilizables (nombres, labels)
    ├── configmap.yaml   # plantilla del ConfigMap
    ├── deployment.yaml  # plantilla del Deployment
    ├── service.yaml     # plantilla del Service
    └── NOTES.txt        # mensaje que Helm muestra tras instalar
```

**¿Qué pasó?** Identificaste las **3 piezas** de todo chart: `Chart.yaml` (identidad),
`values.yaml` (parámetros) y `templates/` (plantillas que se rellenan con esos valores).
El `deployment.yaml`, por ejemplo, usa `replicas: {{ .Values.replicaCount }}`: lee el número
desde `values.yaml` en vez de tenerlo escrito a mano.

### Paso 3 — Validar el chart con `helm lint`

Antes de desplegar nada, comprueba que el chart está bien formado.

```bash
helm lint ./06-helm/academia-app-chart
```

**Lo que verás:**

```
==> Linting ./06-helm/academia-app-chart
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

**¿Qué pasó?** `helm lint` revisó la sintaxis y las buenas prácticas. El `[INFO] ... icon is
recommended` es **solo una sugerencia** (añadir un icono al chart), no un error. La línea que
importa es `0 chart(s) failed`: el chart está sano y listo para instalar.

### Paso 4 — Ver el YAML final con `helm template`

Helm "rellena" las plantillas con los valores y produce los manifiestos reales. Puedes verlos
sin tocar el clúster:

```bash
helm template academia ./06-helm/academia-app-chart
```

**Lo que verás:** (extracto — Helm imprime el YAML ya resuelto)

```yaml
# Source: academia-app/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: academia-app
spec:
  replicas: 2
  ...
```

**¿Qué pasó?** Donde la plantilla decía `{{ .Values.replicaCount }}` ahora aparece `2` (el
valor por defecto de `values.yaml`). Así confirmas **qué se va a crear** antes de crearlo: es
el "vista previa" de Helm.

### Paso 5 — Instalar el chart

Crea el release en su propio namespace (Helm lo crea por ti con `--create-namespace`).

```bash
# Comando de instalación del release "academia"
helm install academia ./06-helm/academia-app-chart -n academia --create-namespace
```

**Lo que verás:**

```
NAME: academia
LAST DEPLOYED: Sun Jun 14 18:00:00 2026
NAMESPACE: academia
STATUS: deployed
REVISION: 1
NOTES:
🎁 Academia DevOps App desplegada con Helm.
  ...
```

**¿Qué pasó?** Helm aplicó **todos** los manifiestos juntos y registró un **release** llamado
`academia` con `STATUS: deployed` y `REVISION: 1` (tu primera versión). El bloque `NOTES`
viene de `templates/NOTES.txt` y te recuerda cómo probar la app.

### Paso 6 — Listar el release instalado

```bash
helm list -n academia
```

**Lo que verás:**

```
NAME     	NAMESPACE	REVISION	UPDATED                 	STATUS  	CHART              	APP VERSION
academia 	academia 	1       	2026-06-14 18:00:00 ... 	deployed	academia-app-0.1.0 	1.0.0
```

**¿Qué pasó?** Helm te muestra el release con su **versión de chart** (`academia-app-0.1.0`,
de `Chart.yaml: version`) y la **versión de la app** (`1.0.0`, de `appVersion`). Son dos cosas
distintas: el chart puede cambiar sin que cambie la app, y viceversa.

### Paso 7 — Probar la app

```bash
kubectl -n academia port-forward svc/academia-app-service 8080:80
# en otra terminal:
curl http://localhost:8080/health
```

**Lo que verás:**

```
{"status":"UP","store":"memory","db":"ok","uptime_s":12}
```

**¿Qué pasó?** El Service que creó el chart enruta el tráfico a los Pods. El endpoint
`/health` (el mismo que usan las probes) responde `UP`: la app desplegada con Helm funciona
igual que la desplegada a mano, pero ahora es **un paquete versionado**.

### Paso 8 — La demostración estrella: escalar con `--set`

Sube a **3 réplicas sin editar ningún YAML**, solo pasando el valor por la línea de comandos.

```bash
# Actualizar el release sobrescribiendo replicaCount
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=3
```

**Lo que verás:**

```
Release "academia" has been upgraded. Happy Helming!
NAME: academia
NAMESPACE: academia
STATUS: deployed
REVISION: 2
```

Comprueba los Pods:

```bash
kubectl -n academia get pods
```

**Lo que verás:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-aaaaa   1/1     Running   0          2m
academia-app-7c9f8d6b54-bbbbb   1/1     Running   0          2m
academia-app-7c9f8d6b54-ccccc   1/1     Running   0          20s
```

**¿Qué pasó?** Sin abrir un solo archivo, `--set replicaCount=3` cambió el despliegue: ahora
hay **3 Pods** y el release saltó a `REVISION: 2`. Esta es la magia de Helm — los valores son
parámetros, no código que copiar y pegar.

### Paso 9 — Ver el historial de versiones

```bash
helm history academia -n academia
```

**Lo que verás:**

```
REVISION	UPDATED                 	STATUS    	CHART              	APP VERSION	DESCRIPTION
1       	2026-06-14 18:00:00 ... 	superseded	academia-app-0.1.0 	1.0.0      	Install complete
2       	2026-06-14 18:05:00 ... 	deployed  	academia-app-0.1.0 	1.0.0      	Upgrade complete
```

**¿Qué pasó?** Helm guarda **cada versión** del release. La `REVISION 1` quedó `superseded`
(reemplazada) y la `REVISION 2` está `deployed`. Como guarda el historial, volver atrás es un
solo comando: `helm rollback academia 1 -n academia`.

### Paso 10 — Desinstalar limpiamente

```bash
helm uninstall academia -n academia
```

**Lo que verás:**

```
release "academia" uninstalled
```

**¿Qué pasó?** Con un comando Helm borró **todos** los objetos del release (Deployment,
Service, ConfigMap). No hay que recordar cada archivo: Helm sabe qué creó y lo limpia entero.

## ✅ Checkpoint

Has completado el lab si:

- [ ] `helm lint ./06-helm/academia-app-chart` termina en **`0 chart(s) failed`**.
- [ ] `helm install ...` muestra **`STATUS: deployed`** y **`REVISION: 1`**.
- [ ] `helm list -n academia` muestra el chart **`academia-app-0.1.0`** y app version **`1.0.0`**.
- [ ] Tras `helm upgrade --set replicaCount=3`, `kubectl -n academia get pods` muestra **3 Pods**.
- [ ] `helm history academia -n academia` muestra la **REVISION 1 (superseded)** y **2 (deployed)**.

Si marcaste las 5 casillas: 🎁 **¡Medalla Empaquetador Helm desbloqueada! +100 XP**

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `Error: INSTALLATION FAILED: cannot re-use a name that is still in use` | Ya existe un release `academia` | Desinstálalo primero: `helm uninstall academia -n academia` |
| `helm: command not found` | Helm no está instalado o no está en el `PATH` | Instala Helm v3 y reabre la terminal (ver Lab 0) |
| Pods en `ImagePullBackOff` | La imagen no está cargada en kind | `kind load docker-image academia-devops-app:1.0.0 --name devops-course` |
| Pods en `Pending` mucho rato | Falta RAM/CPU en el clúster | Cierra apps o dale más recursos a Docker Desktop |
| `Error: query: failed to query with labels` | Apuntas a otro clúster/contexto | `kubectl config use-context kind-devops-course` |
| `port 8080 ocupado` al hacer port-forward | Otro proceso usa el puerto | Usa otro: `port-forward svc/academia-app-service 8081:80` |

## 🏆 Reto extra (+15 XP)

Cambia **dos** valores a la vez (réplicas e imagen) y haz un **rollback** a la primera versión:

```bash
helm upgrade academia ./06-helm/academia-app-chart -n academia \
  --set replicaCount=4 --set image.tag=1.0.0
helm history academia -n academia          # ahora hay una REVISION 3
helm rollback academia 1 -n academia       # vuelve a la versión inicial (2 réplicas)
kubectl -n academia get pods               # 👈 de vuelta a 2 Pods
```

Pregúntate: si un despliegue sale mal en producción a las 3 a.m., **¿prefieres editar archivos
o escribir un solo `helm rollback`?**

## 🎓 Cómo enseñarlo a tus alumnos

- **La gran idea:** un chart es a Kubernetes lo que un instalador (`.msi`/`.deb`) es a una app
  de escritorio: empaqueta todo y lo instala/desinstala de una. "Mismo paquete, distintos
  valores" mata el copy-paste entre ambientes.
- **El momento "¡ajá!":** corre `helm upgrade --set replicaCount=3` en vivo y muestra cómo
  aparecen los Pods **sin haber tocado ningún YAML**. Ahí cae la ficha de qué es parametrizar.
- **Pregunta para discutir:** *¿cuándo conviene Helm sobre YAML manual?* (Pista: número de
  ambientes y frecuencia de cambios. Para 1 app de juguete, YAML basta; para 3 ambientes, Helm gana.)
- **Error productivo:** instala dos veces con el mismo nombre para provocar el error
  `cannot re-use a name` — así entienden que un release es una **identidad única** en el clúster.
- **Cierre con `helm history`:** que vean el historial de revisiones. Conecta con la idea de
  "deshacer" (rollback) que ya conocían del Lab 7 de escalamiento/rollback.

## ⏭️ Siguiente

➡️ **Lab 9 — 🔭 Observador:** [monitorea tu app con logs y métricas](09-observabilidad.md).
Ya empaquetaste y desplegaste; ahora vas a **observar** qué hace tu app en vivo: leer logs,
exponer métricas y entender los 3 pilares de la observabilidad.
