> 🌐 [English](05-kubernetes-despliegue.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 5: Despliegue en Kubernetes

> **Misión:** crear un clúster local, cargar tu imagen y desplegar la app con Namespace, ConfigMap, Secret, Deployment y Service hasta verla responder.
> **XP:** +140 · **Medalla:** ☸️ *Timonel del Clúster* · **Tiempo:** ~40 min · **Dificultad:** ★★★

## 🎒 Antes de empezar

Necesitas:

- **Docker** corriendo.
- **kind** instalado (Kubernetes IN Docker): https://kind.sigs.k8s.io/docs/user/quick-start/#installation
- **kubectl** instalado: https://kubernetes.io/docs/tasks/tools/
- La imagen del curso construida (`bash scripts/build-image.sh 1.0.0`).
- Una terminal en la **raíz del repo** (`devops-contenedores-kubernetes-curso/`).

> 🪟 **¿Estás en Windows?** Los comandos de abajo son estilo Linux/Mac. En **PowerShell** algunos cambian
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). Verás la versión Windows debajo de cada
> comando que cambia. Si te atoras, ten a mano la **[chuleta de PowerShell](windows-powershell.md)**.

> 📦 **¿No usas kind?** Si prefieres **minikube**, sigue igual los pasos: solo cambia la creación del
> clúster y la **carga de la imagen** (lo verás señalado con un recuadro en el Paso 3).

## 🧭 Qué vas a lograr

Al terminar este lab vas a:

1. Crear un clúster Kubernetes local de un solo nodo y verlo en `Ready`.
2. **Vivir el error clásico** `ImagePullBackOff` y aprender por qué pasa.
3. Cargar tu imagen local al clúster y desplegar 5 manifiestos.
4. Ver **2/2 pods Running**, confirmar el rollout y probar `/health` con un `port-forward`.

## 👣 Pasos

### Paso 1 — Crear el clúster local

Levantamos un clúster de Kubernetes dentro de Docker con el script del repo.

```bash
# Desde la raíz del repo
bash scripts/create-kind-cluster.sh devops-course
```

> 🪟 **Windows (PowerShell):** `pwsh scripts/create-kind-cluster.ps1 devops-course`

**Lo que verás:**

```
🚢 Creando clúster kind 'devops-course'...
Creating cluster "devops-course" ...
 ✓ Ensuring node image (kindest/node:v1.31.0) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-devops-course"
🔎 Información del clúster:
Kubernetes control plane is running at https://127.0.0.1:NNNNN
✅ Clúster 'devops-course' listo.
```

**¿Qué pasó?** kind creó un clúster de **un solo nodo** dentro de un contenedor Docker y configuró `kubectl` para apuntar a él (contexto `kind-devops-course`).

### Paso 2 — Confirmar que el nodo está listo

```bash
kubectl get nodes
```

**Lo que verás:**

```
NAME                          STATUS   ROLES           AGE   VERSION
devops-course-control-plane   Ready    control-plane   45s   v1.31.0
```

**¿Qué pasó?** El nodo aparece en `Ready`: el clúster está vivo y listo para recibir cargas. Si dice `NotReady`, dale unos segundos y vuelve a consultar.

### Paso 3 — El error clásico: desplegar SIN cargar la imagen

Vamos a cometer **a propósito** el error que casi todos cometen la primera vez: aplicar los manifiestos antes de cargar la imagen. Así lo reconocerás cuando te pase de verdad.

```bash
kubectl apply -f 05-kubernetes/namespace.yaml
kubectl apply -f 05-kubernetes/configmap.yaml
kubectl apply -f 05-kubernetes/secret-example.yaml
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl apply -f 05-kubernetes/service.yaml
kubectl -n academia get pods
```

**Lo que verás:**

```
NAME                            READY   STATUS             RESTARTS   AGE
academia-app-7c8f6d9b4-abcde    0/1     ImagePullBackOff   0          30s
academia-app-7c8f6d9b4-fghij    0/1     ImagePullBackOff   0          30s
```

Si miras el detalle con `kubectl -n academia describe pod -l app=academia-app`, en *Events* leerás algo así:

```
Failed to pull image "academia-devops-app:1.0.0": ... pull access denied,
repository does not exist or may require authorization
```

**¿Qué pasó?** El clúster **no ve tu Docker local**. kind corre en sus propios contenedores y, al no encontrar `academia-devops-app:1.0.0` en ningún registro remoto, intenta "bajarla" de internet y falla → `ImagePullBackOff`. **Es el error más común de toda la unidad.** La solución es cargar la imagen local dentro del clúster.

> 🧹 No hace falta borrar nada: en cuanto carguemos la imagen (Paso 4), Kubernetes reintentará solo y los pods arrancarán.

### Paso 4 — Cargar la imagen local en el clúster

```bash
kind load docker-image academia-devops-app:1.0.0 --name devops-course
```

**Lo que verás:**

```
Image: "academia-devops-app:1.0.0" with ID "sha256:7f3a9c2b..." not yet present on node "devops-course-control-plane", loading...
```

**¿Qué pasó?** kind copió tu imagen local **dentro** del nodo del clúster. Ahora `imagePullPolicy: IfNotPresent` (definido en el `deployment.yaml`) encontrará la imagen localmente y **no** intentará bajarla de internet.

> 📦 **Si usas minikube** (en vez de kind), carga la imagen así:
> ```bash
> docker save academia-devops-app:1.0.0 -o img.tar
> minikube image load img.tar
> ```
> ⚠️ El comando directo `minikube image load academia-devops-app:1.0.0` **a veces no carga** la
> imagen correctamente. Por eso usamos el `.tar`: es el método fiable.

### Paso 5 — Ver los pods arrancar (2/2 Running)

Tras cargar la imagen, Kubernetes reintenta el *pull* solo. Espera unos segundos y consulta.

```bash
kubectl -n academia get pods
```

**Lo que verás:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c8f6d9b4-abcde    1/1     Running   0          2m
academia-app-7c8f6d9b4-fghij    1/1     Running   0          2m
```

**¿Qué pasó?** Los **2 pods** (definimos `replicas: 2` en el Deployment) ya están `Running` y `1/1` listos. El `ImagePullBackOff` desapareció en cuanto la imagen estuvo disponible. Si los quieres todos de un jalón, el conteo es **2/2 Running**.

> 💡 **Atajo:** todos los pasos 3–5 los hace de una sola vez el script `bash scripts/deploy-k8s.sh devops-course`
> (carga la imagen, aplica los 5 manifiestos y espera el rollout). Aquí lo hicimos a mano para *ver* el error.
>
> 🪟 **Windows (PowerShell):** `pwsh scripts/deploy-k8s.ps1 devops-course`

### Paso 6 — Confirmar el rollout

```bash
kubectl -n academia rollout status deployment/academia-app
```

**Lo que verás:**

```
deployment "academia-app" successfully rolled out
```

**¿Qué pasó?** Kubernetes confirma que **todas** las réplicas deseadas están disponibles y sanas. Este es el comando que usarías en un pipeline para "esperar" a que un despliegue termine antes de seguir.

### Paso 7 — Probar la app con port-forward

El Service es de tipo `ClusterIP` (solo accesible **dentro** del clúster). Para alcanzarlo desde tu máquina, abrimos un túnel con `port-forward`.

```bash
kubectl -n academia port-forward service/academia-app-service 8080:80
```

**Lo que verás:**

```
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

Deja **esa terminal abierta** y, en **otra terminal**, prueba el endpoint de salud:

```bash
curl http://localhost:8080/health
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/health` (con `.exe`; en PowerShell `curl` es otro comando)

**Lo que verás:**

```json
{"status":"UP","store":"memory","db":"ok","uptime_s":42}
```

**¿Qué pasó?** El tráfico viajó `localhost:8080` → Service (puerto 80) → contenedor (puerto 8080) → app. La app responde `status: UP`. Fíjate en `store: memory` y `db: ok`: este Deployment básico corre **sin base de datos externa**, usando un almacén en memoria, por eso reporta sano sin necesidad de Postgres.

## ✅ Checkpoint

Lo lograste si:

- [ ] `kubectl get nodes` muestra el nodo en **`Ready`**.
- [ ] Provocaste y reconociste un **`ImagePullBackOff`** antes de cargar la imagen.
- [ ] `kubectl -n academia get pods` muestra **2/2 Running**.
- [ ] `rollout status` dijo **`successfully rolled out`**.
- [ ] `curl http://localhost:8080/health` devolvió **`{"status":"UP",...}`**.

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| ------- | -------------- | -------- |
| `ImagePullBackOff` | Imagen local no cargada al clúster | `kind load docker-image academia-devops-app:1.0.0 --name devops-course` |
| `ErrImagePull` / `pull access denied` | Mismo problema: el clúster busca en internet | Cargar la imagen local (kind load / minikube image load) |
| `CrashLoopBackOff` | El contenedor arranca y muere | `kubectl -n academia logs <pod>` para ver el error |
| `Pending` | No hay recursos o nodo asignable | `kubectl -n academia describe pod <pod>` y revisa *Events* |
| `0/2 Ready` mucho rato | La app no pasa readiness | Verifica que `/health` responde 200 |
| `curl` no conecta | El `port-forward` no está corriendo | Mantén abierta la terminal del `port-forward` |
| Service no responde | El selector no coincide con las labels | Las labels del Pod deben igualar el `selector` del Service |
| `connection refused` al crear clúster | Docker no está corriendo | Arranca Docker Desktop y reintenta |
| 🪟 *"Subsistema de Windows para Linux no tiene distribuciones instaladas"* | Usaste `bash` en Windows (apunta a WSL) | Usa `pwsh ...ps1` en su lugar — ver [chuleta](windows-powershell.md) |
| 🪟 `curl` muestra una respuesta rara/larga | En PowerShell `curl` = `Invoke-WebRequest` | Usa `curl.exe` (con `.exe`) o abre la URL en el navegador |

## 🏆 Reto extra

1. Escala a 4 réplicas y observa los pods nuevos:
   ```bash
   kubectl -n academia scale deployment academia-app --replicas=4
   kubectl -n academia get pods
   ```
2. Mira la config inyectada y demuestra que **base64 NO es cifrado**:
   ```bash
   kubectl -n academia get configmap academia-config -o yaml
   kubectl -n academia get secret academia-secret -o jsonpath='{.data.DB_PASSWORD}' | base64 -d
   ```
3. Limpia todo al terminar:
   ```bash
   bash scripts/reset-lab.sh
   bash scripts/delete-kind-cluster.sh devops-course
   ```
   > 🪟 **Windows (PowerShell):** `pwsh scripts/reset-lab.ps1` y `pwsh scripts/delete-kind-cluster.ps1 devops-course`

## 🎓 Cómo enseñarlo a tus alumnos

- **Provoca el error a propósito.** El `ImagePullBackOff` es el momento pedagógico más valioso del lab: deja que el grupo lo vea, pregúntales "¿por qué no encuentra la imagen?" y guía hasta el "ajá": *el clúster vive en otro mundo, no ve tu Docker local*.
- **Dibuja el camino del tráfico.** `localhost:8080 → Service:80 → contenedor:8080`. Si entienden el salto de puertos del Service, entienden por qué `port-forward` apunta a `8080:80`.
- **Explica las labels como pegamento.** El Deployment gestiona los Pods por su `label app: academia-app`, y el Service enruta a esa misma label. Si no coinciden, "todo está corriendo" pero nada responde. Es un error sutil y muy didáctico.
- **Aprovecha el `store: memory`.** Es la excusa perfecta para hablar de apps *stateless* vs. *stateful*: este Deployment básico corre sin DB, y por eso escala a 4 réplicas sin drama.
- **Cierra con el Secret.** El `base64 -d` que revela `academia` es un golpe de realidad: base64 es **codificación**, no **cifrado**. Aquí enganchas la conversación de Sealed Secrets / Vault del siguiente lab.

## ⏭️ Siguiente

Tu app ya vive en Kubernetes. En el **Lab 6 — Configuración y Secretos** profundizarás en ConfigMaps y
Secrets (y por qué base64 no protege nada), y en el **Lab 7 — Escalado, actualización y rollback**
harás *rolling updates* y volverás atrás cuando algo salga mal. Consulta `05-kubernetes/comandos-kubectl.md`.
