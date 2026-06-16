> 🌐 [English](02-compose.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 2: app + PostgreSQL con Docker Compose

**Misión:** levantar la app CON su base de datos en un solo comando · **XP:** +120 · **Medalla:** 🧩 Maestro Multicontenedor · **Tiempo:** ~25 min · **Dificultad:** ★★☆

## 🎒 Antes de empezar

- Tener **Docker Desktop** abierto y funcionando (`docker version` debe responder).
- Haber terminado el **Lab 1** (la app corriendo sola con almacén en memoria). Aquí le damos una base de datos real.
- Una terminal abierta. Vamos a trabajar **dentro de la carpeta `03-compose/`**.
- `curl` disponible (viene con Windows 10/11, macOS y Linux).

> 🪟 **¿Estás en Windows?** Los comandos de abajo son estilo Linux/Mac. En **PowerShell** algunos cambian
> (`bash`→`pwsh`, `curl`→`curl.exe`, `grep`→`Select-String`). Verás la versión Windows debajo de cada
> comando que cambia. Si te atoras, ten a mano la **[chuleta de PowerShell](windows-powershell.md)**.

> 💡 Idea clave del lab: **la misma imagen del Lab 1 no cambia**. Solo le pasamos variables de entorno (`DB_HOST`, etc.) y, gracias a eso, ahora habla con PostgreSQL. Eso es configuración por entorno (12-factor).

## 🧭 Qué vas a lograr

- Levantar **dos contenedores** (app + Postgres) con un solo `docker compose up`.
- Ver cómo la app encuentra a la base de datos **por su nombre de servicio** (`db`), sin IPs.
- Comprobar que el `/health` ahora reporta `store: postgres`.
- Demostrar la estrella del lab: **la persistencia**. Reinicias la app y los datos **siguen ahí** porque viven en un volumen.

## 👣 Pasos

### Paso 1 — Entrar a la carpeta del lab

```bash
cd 03-compose
```

**Lo que verás:**

```
(el prompt ahora muestra la ruta .../03-compose)
```

**¿Qué pasó?** Todos los comandos de Compose buscan un `docker-compose.yml` en la carpeta actual. El nuestro vive aquí, así que nos paramos en `03-compose/`.

### Paso 2 — Levantar la app + la base de datos

```bash
docker compose up -d --build
```

**Lo que verás:**

```
[+] Running 3/3
 ✔ Network academia-devops_default      Created
 ✔ Container academia-devops-db-1       Healthy
 ✔ Container academia-devops-app-1      Started
```

**¿Qué pasó?** Compose construyó la imagen de la app (`--build`), arrancó **primero** Postgres y **esperó** a que estuviera *Healthy*. Solo entonces arrancó la app. Eso lo logra `depends_on: condition: service_healthy`. El `-d` lo deja corriendo en segundo plano.

### Paso 3 — Confirmar que ambos servicios están sanos

```bash
docker compose ps
```

**Lo que verás:**

```
NAME                      IMAGE                       STATUS
academia-devops-app-1     academia-devops-app:1.0.0   Up (healthy)
academia-devops-db-1      postgres:16-alpine          Up (healthy)
```

**¿Qué pasó?** Los dos contenedores aparecen como `Up (healthy)`. La app y la base de datos ya conviven en la misma red interna que Compose creó automáticamente.

### Paso 4 — Comprobar que la app ahora habla con PostgreSQL

```bash
curl http://localhost:8080/health
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/health` (con `.exe`; en PowerShell `curl`
> es otro comando). O abre **http://localhost:8080/health** en el navegador.

**Lo que verás:**

```json
{"status":"UP","store":"postgres","db":"ok","uptime_s":11}
```

**¿Qué pasó?** ¡Fíjate en `"store":"postgres"`! En el Lab 1 decía `memory`. Aquí la app detectó la variable `DB_HOST=db`, se conectó a Postgres y el `ping` a la base respondió (`"db":"ok"`). Misma app, distinta configuración.

### Paso 5 — Ver los cursos semilla

```bash
curl http://localhost:8080/courses
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/courses`

**Lo que verás:**

```json
[{"id":1,"code":"DEVOPS-101","name":"Fundamentos de DevOps","professor":"Daniel Gonzalez"},
 {"id":2,"code":"DOCKER-201","name":"Contenedores con Docker","professor":"Daniel Gonzalez"},
 {"id":3,"code":"K8S-301","name":"Orquestacion con Kubernetes","professor":"Daniel Gonzalez"}]
```

**¿Qué pasó?** La primera vez, la app creó la tabla `courses` en Postgres y la sembró con 3 cursos. Estos datos ahora viven **en la base de datos**, no en memoria.

### Paso 6 — Crear un curso nuevo (el que pondremos a prueba)

```bash
curl -X POST http://localhost:8080/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"PERSIST-1","name":"Sobrevive al reinicio"}'
```

> 🪟 **Windows (PowerShell):** en una sola línea (la barra `\` no continúa líneas en PowerShell):
> `curl.exe -X POST http://localhost:8080/courses -H "Content-Type: application/json" -d '{"code":"PERSIST-1","name":"Sobrevive al reinicio"}'`

**Lo que verás:**

```json
{"id":4,"code":"PERSIST-1","name":"Sobrevive al reinicio","professor":null}
```

**¿Qué pasó?** Postgres asignó el `id:4` (los semilla eran 1–3). No mandamos `professor`, así que quedó en `null`. Este curso es nuestro "conejillo de Indias" para la prueba de persistencia.

### Paso 7 — La demostración estrella: reiniciar la app

```bash
docker compose restart app
```

**Lo que verás:**

```
[+] Restarting 1/1
 ✔ Container academia-devops-app-1  Started
```

**¿Qué pasó?** Reiniciamos **solo el contenedor de la app** (no la base de datos). Si los datos vivieran dentro de la app, se perderían. Vamos a comprobar que no es así.

### Paso 8 — Confirmar que el curso SIGUE ahí

```bash
curl http://localhost:8080/courses
```

> 🪟 **Windows (PowerShell):** `curl.exe http://localhost:8080/courses`

**Lo que verás:**

```json
[{"id":1,"code":"DEVOPS-101","name":"Fundamentos de DevOps","professor":"Daniel Gonzalez"},
 {"id":2,"code":"DOCKER-201","name":"Contenedores con Docker","professor":"Daniel Gonzalez"},
 {"id":3,"code":"K8S-301","name":"Orquestacion con Kubernetes","professor":"Daniel Gonzalez"},
 {"id":4,"code":"PERSIST-1","name":"Sobrevive al reinicio","professor":null}]
```

**¿Qué pasó?** 🎉 ¡`PERSIST-1` **sigue en la lista** tras reiniciar la app! Los datos no vivían en la app: viven en el **volumen `db_data`** montado en Postgres. Esa es la diferencia entre un contenedor efímero y un dato persistente.

### Paso 9 — (Opcional) Abrir la interfaz web

Abre en tu navegador: **http://localhost:8080/**

**Lo que verás:**

```
La UI web de la Academia DevOps con la lista de cursos (incluido PERSIST-1).
```

**¿Qué pasó?** La app también sirve una interfaz visual desde `public/`. Es la misma data que viste por `curl`, pero bonita.

## ✅ Checkpoint

Has completado el lab si:

- [ ] `docker compose ps` muestra **app y db** como `Up (healthy)`.
- [ ] `curl /health` responde `"store":"postgres"` y `"db":"ok"`.
- [ ] Creaste `PERSIST-1` y obtuviste `"id":4`.
- [ ] Tras `docker compose restart app`, `PERSIST-1` **seguía** en `/courses`.

## 🧯 Si algo falla

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `/health` dice `"db":"down"` | La app arrancó antes que la DB | Ya lo evitamos con `condition: service_healthy`; revisa credenciales en el `docker-compose.yml` |
| `port 5432 already allocated` | Tienes un PostgreSQL local corriendo | Apágalo, o quita la línea `ports:` del servicio `db` |
| `port 8080 already allocated` | Otra app usa el 8080 | Cierra esa app o cambia el mapeo a `"8081:8080"` |
| `store` sigue diciendo `memory` | La app no recibió `DB_HOST` | Verifica las `environment:` del servicio `app`; reconstruye con `up -d --build` |
| Datos "viejos" que no esperabas | El volumen persistió de una corrida anterior | `docker compose down -v` para empezar limpio |
| `app` no resuelve `db` | Error de tipeo en `DB_HOST` | Debe ser **exactamente** el nombre del servicio (`db`) |
| 🪟 *"Subsistema de Windows para Linux no tiene distribuciones instaladas"* | Usaste `bash` en Windows (apunta a WSL) | Usa `pwsh ...ps1` o el comando `docker`/`kubectl` directo — ver [chuleta](windows-powershell.md) |
| 🪟 `curl` muestra una respuesta rara/larga | En PowerShell `curl` = `Invoke-WebRequest` | Usa `curl.exe` o abre la URL en el navegador |

> Cuando termines y quieras limpiar: `docker compose down` (conserva el volumen) o `docker compose down -v` (borra también los datos).

## 🏆 Reto extra (+30 XP)

1. Haz `docker compose down` (sin `-v`) y luego `docker compose up -d` otra vez.
2. Consulta `curl http://localhost:8080/courses`.
3. ¿`PERSIST-1` sigue ahí? **Sí**, porque `down` sin `-v` **conserva** el volumen `db_data`.
4. Ahora haz `docker compose down -v`, vuelve a levantar y consulta. `PERSIST-1` **desapareció**: con `-v` borraste el volumen y la base volvió a sembrarse con solo los 3 cursos.

> Explica en una frase la diferencia entre `down` y `down -v`. Si la tienes clara, dominas los volúmenes.

## 🎓 Cómo enseñarlo a tus alumnos

- **Empieza por el "dolor":** muestra primero el Lab 1 con almacén en memoria. Crea un curso, reinicia el contenedor y... se perdió. Ese golpe emocional hace que la persistencia se entienda sola.
- **Una sola palabra cambia todo:** resalta que la imagen es **idéntica** a la del Lab 1. Lo único nuevo es `DB_HOST`. Es la mejor demostración de "configuración por entorno".
- **El truco visible:** pide a un alumno que ejecute `docker compose restart app` en vivo mientras otro tiene el `curl /courses` listo. El "¡sigue ahí!" colectivo vale más que diez diapositivas.
- **Dibuja la red:** un recuadro "app" y un recuadro "db" unidos por una flecha que dice `db` (no una IP). Así entienden el DNS interno de Compose.
- **Pregunta trampa:** "¿dónde viven los datos?" La respuesta correcta no es "en Postgres" sino "en el **volumen** que Postgres monta". Ese matiz prepara el terreno para Kubernetes.

## ⏭️ Siguiente

➡️ [Guía Lab 3 — CI/CD: pipeline en verde](03-cicd.md)
