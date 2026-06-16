> 🌐 [English](04-devsecops-trivy.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 4: Escaneo de seguridad con Trivy

> **Misión:** escanear la imagen de la app, leer el reporte de vulnerabilidades y decidir qué arreglar primero.
> **XP:** +90 · **Medalla:** 🛡️ *Guardián Shift-Left* · **Tiempo:** ~25 min · **Dificultad:** ★★☆

## 🎒 Antes de empezar

Necesitas tener listo lo siguiente:

- **Docker** corriendo y la imagen del curso ya construida. Si no la tienes:
  ```bash
  bash scripts/build-image.sh 1.0.0
  ```
  > 🪟 **Windows (PowerShell):** `pwsh scripts/build-image.ps1 1.0.0`
- **Trivy** instalado (el escáner de seguridad de Aqua Security):
  ```bash
  # macOS
  brew install trivy
  # Windows
  winget install AquaSecurity.Trivy
  # Linux y otros: https://trivy.dev/latest/getting-started/installation/
  ```
- Una terminal abierta en la **raíz del repo** (`devops-contenedores-kubernetes-curso/`).

> 💡 La **primera** vez que escanees, Trivy descarga su base de datos de vulnerabilidades (unos segundos).
> Es normal ver una línea tipo `Need to update DB` o `Downloading DB...`.

> 🪟 **¿Estás en Windows?** Los comandos de abajo son estilo Linux/Mac. En **PowerShell** algunos cambian
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). Verás la versión Windows debajo de cada
> comando que cambia. Si te atoras, ten a mano la **[chuleta de PowerShell](windows-powershell.md)**.

## 🧭 Qué vas a lograr

Al terminar este lab vas a:

1. Escanear la imagen `academia-devops-app:1.0.0` filtrando solo lo grave (CRITICAL/HIGH).
2. **Entender el reporte**: paquete vulnerable, CVE, severidad y versión que lo corrige.
3. Aprender la regla de oro del *shift-left*: **prioriza lo CRITICAL/HIGH que ya tiene parche**.
4. Interiorizar que la herramienta **detecta**, pero el **humano decide**.

## 👣 Pasos

### Paso 1 — Confirmar que la imagen existe

Antes de escanear, comprueba que la imagen está en tu Docker local.

```bash
docker images academia-devops-app
```

**Lo que verás:**

```
REPOSITORY            TAG       IMAGE ID       CREATED         SIZE
academia-devops-app   1.0.0     7f3a9c2b1d4e   2 minutes ago   180MB
```

**¿Qué pasó?** Docker confirma que la imagen `academia-devops-app:1.0.0` está disponible localmente. Si no aparece, vuelve a construirla con `bash scripts/build-image.sh 1.0.0`.

### Paso 2 — Escanear solo lo grave (CRITICAL y HIGH)

Lanzamos Trivy contra la imagen, pero filtrando para ver **solo lo que importa primero**. Un reporte completo trae mucho ruido; empezamos por lo que de verdad duele.

```bash
trivy image --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

**Lo que verás:**

```
academia-devops-app:1.0.0 (alpine 3.24.0)
==========================================
Total: 2 (HIGH: 2, CRITICAL: 0)

┌────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬──────────────────────────────────────┐
│  Library   │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │                Title                 │
├────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼──────────────────────────────────────┤
│ libcrypto3 │ CVE-2025-xxxxx │ HIGH     │ fixed  │ 3.5.6-r0          │ 3.5.7-r0      │ openssl: vulnerability in ...        │
├────────────┤                │          │        │                   │               │                                      │
│ libssl3    │                │          │        │                   │               │                                      │
└────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴──────────────────────────────────────┘

Node.js (node-pkg)
==================
Total: 1 (HIGH: 1)

┌───────────────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬──────────────────────────────┐
│        Library        │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │            Title             │
├───────────────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼──────────────────────────────┤
│ picomatch             │ CVE-2025-xxxxx │ HIGH     │ fixed  │ 4.0.2             │ 4.0.4         │ picomatch: ReDoS in ...      │
│ (package.json)        │                │          │        │                   │               │                              │
└───────────────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴──────────────────────────────┘
```

**¿Qué pasó?** Trivy analizó la imagen en **dos capas distintas** y por eso hay **dos bloques**:

- **`academia-devops-app:1.0.0 (alpine 3.24.0)`** → el **sistema operativo** del contenedor (Alpine). Encontró **2 HIGH**: `libcrypto3` y `libssl3`, ambos de **OpenSSL**. Están en `3.5.6-r0` y el parche es `3.5.7-r0`. El `Status: fixed` significa que **ya existe versión corregida**.
- **`Node.js (node-pkg)`** → las **dependencias de tu app** (lo que está en `package.json`). Encontró **1 HIGH**: `picomatch`, instalado en `4.0.2`, parche en `4.0.4`.

### Paso 3 — Quedarte solo con lo accionable

Una vulnerabilidad sin parche disponible no la puedes arreglar actualizando. Filtra para ver **solo lo que tiene fix**, que es lo que de verdad puedes accionar hoy.

```bash
trivy image --ignore-unfixed --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

**Lo que verás:**

```
academia-devops-app:1.0.0 (alpine 3.24.0)
==========================================
Total: 2 (HIGH: 2, CRITICAL: 0)
...
Node.js (node-pkg)
==================
Total: 1 (HIGH: 1)
...
```

**¿Qué pasó?** En este caso las **3 vulnerabilidades ya tienen parche** (`Status: fixed`), así que la lista no cambia. La bandera `--ignore-unfixed` es tu mejor amiga en un pipeline: evita que el equipo se ahogue persiguiendo cosas que **todavía no se pueden arreglar**.

### Paso 4 — Bonus: escanear el código y los YAML de Kubernetes

Trivy no solo escanea imágenes. Pruébalo contra tu código fuente y tus manifiestos.

```bash
# Dependencias del código (lee package.json / lockfiles, no la imagen)
trivy fs 01-app/node

# Malas configuraciones en los manifiestos de Kubernetes
trivy config 05-kubernetes/

# Secretos quemados en la imagen (¡el clásico DB_PASSWORD!)
trivy image --scanners secret academia-devops-app:1.0.0
```

**¿Qué pasó?** Mismo motor, tres superficies de ataque distintas: dependencias (`fs`), configuración (`config`) y secretos filtrados (`--scanners secret`). Así cubres el *shift-left* de punta a punta.

## ✅ Checkpoint

Marcaste el lab si puedes responder **sin volver a mirar**:

- [ ] El reporte se dividió en **dos secciones**: una del SO (`alpine 3.24.0`) y otra de Node.js (`node-pkg`).
- [ ] La sección de Alpine tenía **Total: 2 (HIGH: 2, CRITICAL: 0)** — `libcrypto3` y `libssl3` (OpenSSL), fix en `3.5.7-r0`.
- [ ] La sección de Node tenía **Total: 1 (HIGH: 1)** — `picomatch`, fix en `4.0.4`.
- [ ] Sabes qué hace `--ignore-unfixed` y por qué prioriza lo **CRITICAL/HIGH con "Fixed Version"**.

## 🧯 Si algo falla

| Síntoma | Causa probable | Solución |
| ------- | -------------- | -------- |
| `trivy: command not found` | Trivy no está instalado o no está en el PATH | Reinstala (`brew`/`winget`) y reabre la terminal |
| `unable to find the specified image` | La imagen no existe localmente | `bash scripts/build-image.sh 1.0.0` y reintenta |
| Se queda en `Downloading DB...` | Primera ejecución / red lenta | Espera; descarga la base de CVEs una sola vez |
| `Total: 0` en todo | Escaneaste otra imagen o un tag distinto | Confirma el nombre exacto `academia-devops-app:1.0.0` |
| Tarda mucho | Imagen grande o caché vacía | Normal la primera vez; la segunda corre en caché |
| 🪟 *"Subsistema de Windows para Linux no tiene distribuciones instaladas"* | Usaste `bash` en Windows (apunta a WSL) | Usa `pwsh scripts/build-image.ps1 1.0.0` — ver [chuleta](windows-powershell.md) |
| 🪟 `curl` muestra una respuesta rara/larga | En PowerShell `curl` = `Invoke-WebRequest` | Usa `curl.exe` (con `.exe`) o abre la URL en el navegador |

## 🏆 Reto extra

1. Construye la versión **insegura** y compárala:
   ```bash
   docker build -f 02-docker/Dockerfile.insecure -t academia-app:inseguro 01-app/node
   trivy image --severity CRITICAL,HIGH academia-app:inseguro
   ```
   ¿Cuántos HIGH/CRITICAL más aparecen frente a la imagen buena?
2. Caza el **secreto quemado**: `trivy image --scanners secret academia-app:inseguro` y localiza el `DB_PASSWORD`.
3. Genera un reporte en JSON para tu pipeline:
   ```bash
   trivy image --format json --output reporte.json --severity CRITICAL,HIGH academia-devops-app:1.0.0
   ```

## 🎓 Cómo enseñarlo a tus alumnos

- **Arranca con la metáfora del *shift-left***: corregir un bug en el código cuesta minutos; corregirlo en producción cuesta una madrugada. Trivy mueve la revisión "a la izquierda" del flujo.
- **Lee el reporte en voz alta columna por columna**: *Library* (qué paquete), *Vulnerability* (qué CVE), *Severity* (qué tan grave), *Fixed Version* (cómo se arregla). Si entienden esas cuatro, entienden el 90 %.
- **Insiste en una sola idea**: la herramienta **detecta**, el ingeniero **decide**. Trivy no sabe si la vuln es explotable en *tu* caso ni conoce la lógica de tu negocio. Eso es criterio humano.
- **Haz que prioricen**: dales el reporte y pregunta "¿qué arreglas primero?". La respuesta correcta es lo **CRITICAL/HIGH con Fixed Version**, porque es lo grave **y** accionable.
- **Cierra con el contraste**: corre la imagen buena vs. la insegura lado a lado. Ver la diferencia de números convence más que cualquier diapositiva.

## ⏭️ Siguiente

Ya sabes detectar problemas **antes** de desplegar. Ahora toca llevar la app a un clúster real:
**[Lab 5 — Despliegue en Kubernetes](05-kubernetes-despliegue.md)** ☸️.
