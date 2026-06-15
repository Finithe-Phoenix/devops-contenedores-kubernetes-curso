> 🌐 [English](06-config-secrets.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 6: ConfigMap y Secret

| | |
| --- | --- |
| **Misión** | 🔐 Custodio de Secretos — externalizar la configuración de la app |
| **XP** | +70 XP |
| **Medalla** | 🔐 Custodio de Secretos |
| **Tiempo** | ~25 min |
| **Dificultad** | ★★☆ |

En este lab vas a separar la **configuración** del **código**. En vez de "quemar" valores
dentro de la imagen, los vas a guardar en un **ConfigMap** (datos no sensibles) y en un
**Secret** (datos sensibles), y vas a inyectarlos a tu Pod como variables de entorno.

## 🎒 Antes de empezar

- ✅ Tener el **clúster del Lab 5 corriendo** (kind `devops-course`) con la imagen
  `academia-devops-app:1.0.0` ya cargada.
- ✅ El **namespace `academia`** creado y el deployment `academia-app` desplegado.
- ✅ `kubectl` apuntando al clúster correcto.

Comprueba rápido que todo sigue en pie:

```bash
kubectl -n academia get deployments,pods
```

**Lo que verás:**

```
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/academia-app   2/2     2            2           5m

NAME                                READY   STATUS    RESTARTS   AGE
pod/academia-app-7c9f8d6b54-abcde   1/1     Running   0          5m
pod/academia-app-7c9f8d6b54-fghij   1/1     Running   0          5m
```

> Si esto no aparece, vuelve al Lab 5 y vuelve a desplegar antes de seguir.

## 🧭 Qué vas a lograr

- Crear un **ConfigMap** con configuración no sensible (`APP_ENV`, `APP_VERSION`).
- Crear un **Secret** con datos sensibles (`DB_USER`, `DB_PASSWORD`).
- Entender por qué un Secret se ve en **base64** y por qué **base64 NO es cifrado**.
- Inyectar el ConfigMap al deployment con `envFrom` y verificar que la app lo lee.

## 👣 Pasos

### Paso 1 — Crear el ConfigMap

El ConfigMap guarda configuración **no sensible**. Puede ir en texto plano y versionarse en git.

```bash
kubectl apply -f 05-kubernetes/configmap.yaml
```

**Lo que verás:**

```
configmap/academia-config created
```

**¿Qué pasó?** Kubernetes guardó un objeto `ConfigMap` llamado `academia-config` en el
namespace `academia` con dos claves: `APP_ENV=training` y `APP_VERSION=1.0.0`.

### Paso 2 — Verificar el ConfigMap

```bash
kubectl -n academia get configmap academia-config
```

**Lo que verás:**

```
NAME              DATA   AGE
academia-config   2      10s
```

**¿Qué pasó?** La columna **`DATA 2`** confirma que el ConfigMap tiene **2 claves**
(`APP_ENV` y `APP_VERSION`). Si quieres ver los valores: `kubectl -n academia get configmap academia-config -o yaml`.

### Paso 3 — Crear el Secret

El Secret guarda datos **sensibles**. Usamos `stringData` (texto plano) sólo para que se
**lea en clase**; Kubernetes lo codifica a base64 al guardarlo.

```bash
kubectl apply -f 05-kubernetes/secret-example.yaml
```

**Lo que verás:**

```
secret/academia-secret created
```

**¿Qué pasó?** Se creó un Secret `academia-secret` de tipo `Opaque` con `DB_USER` y
`DB_PASSWORD`. Kubernetes guarda esos valores **codificados en base64**.

### Paso 4 — Leer el Secret en base64

```bash
kubectl -n academia get secret academia-secret -o jsonpath='{.data.DB_PASSWORD}'
```

**Lo que verás:**

```
YWNhZGVtaWE=
```

**¿Qué pasó?** El valor **no aparece en texto plano**, aparece **codificado en base64**.
Parece "protegido"... pero no lo está. Lo demostramos en el siguiente paso.

### Paso 5 — Demostrar que base64 NO es cifrado 🔓

```bash
echo YWNhZGVtaWE= | base64 -d
```

**Lo que verás:**

```
academia
```

**¿Qué pasó?** 🔑 **Punto didáctico clave:** cualquiera puede decodificar base64 con un
comando. **base64 es codificación, NO cifrado** — no protege nada, sólo cambia el formato.
Por eso un Secret **NO debe subirse a git** en texto ni en base64. En la vida real se usan
**Sealed Secrets**, **External Secrets** o **Vault**, o los secretos del gestor de la nube.

### Paso 6 — Consumir el ConfigMap desde el deployment

El deployment (`05-kubernetes/deployment.yaml`) ya inyecta el ConfigMap con `envFrom`:

```yaml
envFrom:
  - configMapRef:
      name: academia-config     # inyecta APP_ENV y APP_VERSION como variables
```

Aplícalo (o reaplícalo) para que el Pod tome la configuración:

```bash
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl -n academia rollout status deployment/academia-app
```

**Lo que verás:**

```
deployment.apps/academia-app configured
deployment "academia-app" successfully rolled out
```

**¿Qué pasó?** Con `envFrom: configMapRef`, **todas** las claves del ConfigMap se inyectan
como variables de entorno dentro del contenedor, sin tener que listarlas una por una.

### Paso 7 — Verificar que la app lee la configuración

Abre un port-forward y consulta el endpoint `/version`:

```bash
kubectl -n academia port-forward service/academia-app-service 8080:80
# en otra terminal:
curl http://localhost:8080/version
```

**Lo que verás:**

```
{"version":"1.0.0"}
```

**¿Qué pasó?** La app reporta `APP_VERSION=1.0.0`, **que viene del ConfigMap** (no está
quemado en el código). Cambiar la versión ahora es cambiar una línea del ConfigMap, no
reconstruir la imagen. 🎉

## ✅ Checkpoint

Has completado el lab si:

- [ ] `kubectl -n academia get configmap academia-config` muestra **`DATA 2`**.
- [ ] El Secret muestra `DB_PASSWORD` como **`YWNhZGVtaWE=`** (base64).
- [ ] `echo YWNhZGVtaWE= | base64 -d` devuelve **`academia`**.
- [ ] `curl .../version` devuelve **`1.0.0`**, leído desde el ConfigMap.

Si marcaste las 4 casillas: 🔐 **¡Medalla Custodio de Secretos desbloqueada! +70 XP**

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `Error from server (NotFound): namespaces "academia" not found` | El namespace no existe | Vuelve al Lab 5: `kubectl apply -f 05-kubernetes/namespace.yaml` |
| `configmap "academia-config" not found` al desplegar | Aplicaste el deployment antes que el ConfigMap | Aplica primero `configmap.yaml`, luego el deployment |
| `base64: invalid input` | Copiaste el valor con espacios o saltos de línea | Copia exactamente `YWNhZGVtaWE=` sin espacios |
| `/version` no responde | El port-forward se cerró o el Pod no está `Running` | Revisa `kubectl -n academia get pods` y reabre el port-forward |
| Los pods siguen con la versión vieja | El deployment no se reaplicó | `kubectl apply -f 05-kubernetes/deployment.yaml` y espera el rollout |

## 🏆 Reto extra (+10 XP)

Crea tu **propio** Secret desde la línea de comandos (sin archivo YAML) y decodifícalo para
comprobar de nuevo que base64 no protege nada:

```bash
kubectl -n academia create secret generic mi-secreto \
  --from-literal=API_KEY=supersecreto123
kubectl -n academia get secret mi-secreto -o jsonpath='{.data.API_KEY}' | base64 -d
```

Pregúntate: si esto se ve tan fácil, **¿dónde deberían vivir realmente los secretos de producción?**

## 🎓 Cómo enseñarlo a tus alumnos

- **La gran idea:** separa *qué hace* la app (código/imagen) de *cómo está configurada*
  (ConfigMap/Secret). Misma imagen en dev, QA y prod; sólo cambia la configuración.
- **El momento "¡ajá!":** decodificar el base64 en vivo. Los alumnos asumen que un Secret
  está "cifrado". Verlo convertirse en `academia` con un comando cambia su mentalidad.
- **Pregunta para discutir:** *¿qué va en un ConfigMap y qué va en un Secret?* (Regla: si te
  daría miedo verlo en una captura de pantalla, es un Secret.)
- **Error productivo:** pide aplicar el deployment **antes** que el ConfigMap para que vean
  el error `configmap not found` — así entienden el orden de dependencias.
- **Cierre honesto:** un Secret de Kubernetes te da control de acceso (RBAC), no cifrado por
  sí solo. Menciona Sealed Secrets/Vault como el "siguiente nivel" real.

## ⏭️ Siguiente

➡️ **Lab 7 — 📈 Operador en Vivo:** [escalar, actualizar y hacer rollback](07-escalar-rollback.md).
Ahora que tu app tiene configuración externa, vas a operarla en vivo: subir réplicas,
hacer un rolling update sin downtime y revertir una versión mala.
