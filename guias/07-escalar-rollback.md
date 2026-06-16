> 🌐 [English](07-escalar-rollback.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 7: escalar, actualizar y rollback

| | |
| --- | --- |
| **Misión** | 📈 Operador en Vivo — escalar réplicas, actualizar y revertir sin downtime |
| **XP** | +110 XP |
| **Medalla** | 📈 Operador en Vivo |
| **Tiempo** | ~30 min |
| **Dificultad** | ★★☆ |

En este lab te conviertes en **operador**: vas a escalar la app a más réplicas, publicar una
nueva versión con un **rolling update** (sin downtime) y, si algo sale mal, hacer un
**rollback** a la versión anterior con un solo comando.

## 🎒 Antes de empezar

- ✅ Tener el **clúster del Lab 5 corriendo** (kind `devops-course`).
- ✅ El **namespace `academia`** y el deployment `academia-app` desplegados (Labs 5 y 6).
- ✅ La imagen `academia-devops-app:1.0.0` cargada en el clúster.

> 🪟 **¿Estás en Windows?** Los comandos de abajo son estilo Linux/Mac. En **PowerShell** algunos cambian
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). Verás la versión Windows debajo de cada
> comando que cambia. Si te atoras, ten a mano la **[chuleta de PowerShell](windows-powershell.md)**.

Confirma el punto de partida:

```bash
kubectl -n academia get deployment academia-app
```

**Lo que verás:**

```
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
academia-app   2/2     2            2           8m
```

> Partimos de **2 réplicas**. Si ves otra cosa, reaplica `05-kubernetes/deployment.yaml`.

## 🧭 Qué vas a lograr

- **Escalar** el deployment de 2 a 4 réplicas y verlo en vivo.
- **Actualizar** la imagen a `1.0.1` con un rolling update sin cortar el servicio.
- Leer el **historial de rollout** (revisiones 1 y 2).
- Hacer **rollback** a la versión anterior y confirmar que volvió sano.

## 👣 Pasos

### Paso 1 — Escalar a 4 réplicas

```bash
kubectl -n academia scale deployment academia-app --replicas=4
```

**Lo que verás:**

```
deployment.apps/academia-app scaled
```

**¿Qué pasó?** Le pediste al deployment **4 copias idénticas** del Pod. Kubernetes crea las
2 que faltan automáticamente para llegar al número deseado (estado declarativo).

### Paso 2 — Ver las 4 réplicas corriendo

```bash
kubectl -n academia get pods
```

**Lo que verás:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-abcde   1/1     Running   0          8m
academia-app-7c9f8d6b54-fghij   1/1     Running   0          8m
academia-app-7c9f8d6b54-klmno   1/1     Running   0          20s
academia-app-7c9f8d6b54-pqrst   1/1     Running   0          20s
```

**¿Qué pasó?** Ahora hay **4 pods `Running`**. Los dos nuevos tienen `AGE` menor (acaban de
nacer). Más réplicas = más capacidad y tolerancia a fallos.

### Paso 3 — Construir y cargar la versión 1.0.1

Para actualizar necesitas que la imagen `1.0.1` exista en el clúster. Constrúyela y cárgala
igual que en el Lab 5:

```bash
# Construir la nueva versión de la imagen
bash scripts/build-image.sh 1.0.1
# Cargarla al clúster kind (el clúster NO ve tu Docker local)
kind load docker-image academia-devops-app:1.0.1 --name devops-course
```

> 🪟 **Windows (PowerShell):** la línea con `bash` es `pwsh scripts/build-image.ps1 1.0.1`. El `kind load`
> se escribe igual.

**Lo que verás:**

```
🐳 Construyendo academia-devops-app:1.0.1 ...
✅ Imagen academia-devops-app:1.0.1 construida.
academia-devops-app   1.0.1   ...
Image: "academia-devops-app:1.0.1" with ID "sha256:..." loaded onto node devops-course-control-plane
```

**¿Qué pasó?** Construiste una imagen con tag `1.0.1` y la **cargaste al clúster**. Sin este
`kind load`, el rolling update fallaría con `ImagePullBackOff`.

### Paso 4 — Actualizar la imagen (rolling update, sin downtime)

```bash
kubectl -n academia set image deployment/academia-app academia-app=academia-devops-app:1.0.1
```

**Lo que verás:**

```
deployment.apps/academia-app image updated
```

**¿Qué pasó?** Kubernetes hace un **rolling update**: levanta pods con la versión nueva y
apaga los viejos **de a poco**, manteniendo siempre pods disponibles. El usuario **no nota
caída**. Ese es el corazón de un despliegue sin downtime.

### Paso 5 — Ver el progreso del rollout

```bash
kubectl -n academia rollout status deployment/academia-app
```

**Lo que verás:**

```
Waiting for deployment "academia-app" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "academia-app" rollout to finish: 3 out of 4 new replicas have been updated...
deployment "academia-app" successfully rolled out
```

**¿Qué pasó?** Viste el reemplazo gradual: réplica por réplica hasta que **las 4** corren la
versión `1.0.1`. El mensaje final confirma que terminó bien.

### Paso 6 — Revisar el historial de rollout

```bash
kubectl -n academia rollout history deployment/academia-app
```

**Lo que verás:**

```
deployment.apps/academia-app
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

**¿Qué pasó?** Hay **2 revisiones**: la **1** es el despliegue inicial (`1.0.0`) y la **2** es
el rolling update (`1.0.1`). Kubernetes guarda este historial para poder **revertir**.

### Paso 7 — Hacer rollback a la versión anterior

Imagina que `1.0.1` tiene un bug. Vuelves a la revisión anterior con un comando:

```bash
kubectl -n academia rollout undo deployment/academia-app
```

**Lo que verás:**

```
deployment.apps/academia-app rolled back
```

**¿Qué pasó?** Kubernetes hace **otro rolling update**, pero de vuelta a `1.0.0`. Mismo
mecanismo sin downtime, ahora para **recuperarte** de una mala versión.

### Paso 8 — Confirmar que el rollback quedó sano

```bash
kubectl -n academia rollout status deployment/academia-app
```

**Lo que verás:**

```
deployment "academia-app" successfully rolled out
```

**¿Qué pasó?** El rollback terminó correctamente: las 4 réplicas volvieron a la versión
estable. Tu servicio sobrevivió a un mal despliegue **sin que el usuario lo notara**. 🎉

## ✅ Checkpoint

Has completado el lab si:

- [ ] `scale --replicas=4` mostró **`scaled`** y `get pods` muestra **4 pods Running**.
- [ ] `set image ...:1.0.1` mostró **`image updated`** y el rollout terminó OK.
- [ ] `rollout history` muestra **REVISION 1 y 2**.
- [ ] `rollout undo` mostró **`rolled back`** y el status final fue **`successfully rolled out`**.

Si marcaste las 4 casillas: 📈 **¡Medalla Operador en Vivo desbloqueada! +110 XP**

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `ImagePullBackOff` tras el `set image` | La imagen `1.0.1` no está en el clúster | `kind load docker-image academia-devops-app:1.0.1 --name devops-course` |
| `error: unable to find ... 1.0.1` | No construiste la imagen | `bash scripts/build-image.sh 1.0.1` y vuelve a cargarla |
| El rollout se queda esperando | Los pods nuevos no pasan a `Running` | `kubectl -n academia describe pod <pod>` y revisa Events |
| `rollout history` muestra solo REVISION 1 | El `set image` no cambió nada (misma imagen) | Verifica que pusiste `:1.0.1`, no `:1.0.0` |
| `no rollout history found` | El deployment se recreó desde cero | Vuelve a hacer un `set image` para generar la revisión 2 |
| Tras el rollback siguen pods viejos | El rollback aún no termina | Espera a `successfully rolled out` con `rollout status` |
| 🪟 *"Subsistema de Windows para Linux no tiene distribuciones instaladas"* | Usaste `bash` en Windows (apunta a WSL) | Usa `pwsh scripts/build-image.ps1 1.0.1` — ver [chuleta](windows-powershell.md) |
| 🪟 `curl` muestra una respuesta rara/larga | En PowerShell `curl` = `Invoke-WebRequest` | Usa `curl.exe` (con `.exe`) o abre la URL en el navegador — ver [chuleta](windows-powershell.md) |

## 🏆 Reto extra (+15 XP)

Despliega una versión **mala a propósito** y reviértela sin downtime:

```bash
# Imagen que NO existe -> simula un despliegue roto
kubectl -n academia set image deployment/academia-app academia-app=academia-devops-app:9.9.9
kubectl -n academia get pods          # verás ImagePullBackOff en los pods nuevos
# Rescata el servicio:
kubectl -n academia rollout undo deployment/academia-app
```

Observa cómo Kubernetes **mantuvo los pods viejos sirviendo** mientras los nuevos fallaban:
un rolling update no tira los buenos hasta que los nuevos están listos. Esa es tu red de seguridad.

## 🎓 Cómo enseñarlo a tus alumnos

- **La gran idea:** en Kubernetes no "apagas y prendes" la app. Declaras el estado deseado
  (réplicas, versión) y el clúster converge hacia él, de forma gradual y reversible.
- **El momento "¡ajá!":** ver el `rollout status` avanzando réplica por réplica. Ahí entienden
  qué significa "sin downtime" de verdad.
- **Pregunta clave para discutir:** *¿por qué 1 réplica NO es alta disponibilidad?* Respuesta:
  si ese único pod muere (o durante una actualización), hay **segundos sin servicio**. Con
  varias réplicas siempre queda al menos una atendiendo.
- **Reto en vivo:** el despliegue "malo" del reto extra es oro didáctico — los alumnos ven el
  `ImagePullBackOff`, sienten el susto, y luego el `rollout undo` los salva en un comando.
- **Cierre:** conecta esto con el mundo real — así es como los equipos publican varias veces
  al día sin tirar producción, y cómo se recuperan en segundos cuando algo sale mal.

## ⏭️ Siguiente

➡️ **Lab 8 — 🎁 Empaquetador Helm:** empaquetar todo este despliegue (ConfigMap, Secret,
Deployment, Service) en un **chart de Helm** reutilizable, para instalar y actualizar la app
con un solo comando en vez de varios `kubectl apply`.
