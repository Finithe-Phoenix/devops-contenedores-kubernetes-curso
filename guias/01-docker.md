> 🌐 [English](01-docker.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 1: Tu primera imagen Docker

**Misión:** contenerizar la Academia DevOps App · **XP:** +100 · **Medalla:** 🐳 Capitán de Contenedores · **Tiempo:** ~25 min · **Dificultad:** ★☆☆

## 🎒 Antes de empezar

**Prerrequisitos**

- Haber completado el [Lab 0](00-ambiente.md): tu medalla 🧰 *Kit Listo* desbloqueada y el daemon de Docker corriendo.
- Terminal abierta en la raíz del repositorio.

**Dónde encaja en el ciclo DevOps**

Este es el paso **Build → Package**. Tomamos código que corre "en tu máquina" y lo empaquetamos en una **imagen**: un artefacto inmutable y portable que correrá idéntico en tu laptop, en CI y en Kubernetes. Es el cimiento sobre el que se apoyan todos los Labs siguientes.

## 🧭 Qué vas a lograr

- Instalar dependencias y correr las **8 pruebas** de la app en local.
- Construir una imagen Docker **multi-stage** (~172 MB) de la Academia DevOps App.
- Levantar el contenedor y comprobar que `/health` y `/version` responden.
- Ver el **HEALTHCHECK** nativo marcando el contenedor como `(healthy)`.
- Abrir la **UI web** de la app en el navegador y desbloquear 🐳 **Capitán de Contenedores** (+100 XP).

## 👣 Pasos

### Paso 1 — Instala las dependencias de la app

```bash
cd 01-app/node
npm install
```

**Lo que verás:**

```
added 108 packages, and audited 109 packages in 3s

found 0 vulnerabilities
```

**¿Qué pasó?** npm leyó `package.json`, descargó las dependencias y generó/actualizó `package-lock.json`. Ese lockfile es justo lo que el Dockerfile usará con `npm ci` para builds reproducibles.

### Paso 2 — Corre las pruebas en local

```bash
npm test
```

**Lo que verás:** (líneas finales)

```
# tests 8
# pass 8
# fail 0
```

**¿Qué pasó?** Validaste que la app está sana **antes** de contenerizarla. Regla DevOps de oro: nunca empaquetes algo que no pasa sus pruebas.

### Paso 3 — Construye la imagen Docker

```bash
bash ../../scripts/build-image.sh 1.0.0
```

**Lo que verás:**

```
🐳 Construyendo academia-devops-app:1.0.0 ...
[+] Building 6.2s (15/15) FINISHED
 => => naming to docker.io/library/academia-devops-app:1.0.0
✅ Imagen academia-devops-app:1.0.0 construida.
academia-devops-app   1.0.0   a1b2c3d4e5f6   2 seconds ago   172MB
```

**¿Qué pasó?** El script corrió `docker build` sobre `01-app/node`. El Dockerfile es **multi-stage**: la etapa `deps` instala solo dependencias de producción con `npm ci --omit=dev` y la etapa `runtime` se queda únicamente con lo necesario sobre `node:22-alpine`. Por eso la imagen pesa solo ~172 MB.

### Paso 4 — Confirma la imagen en tu máquina

```bash
docker images
```

**Lo que verás:**

```
REPOSITORY            TAG     IMAGE ID       CREATED          SIZE
academia-devops-app   1.0.0   a1b2c3d4e5f6   10 seconds ago   172MB
```

**¿Qué pasó?** Una **imagen** es la plantilla inmutable (la receta). Aún no corre nada: es el artefacto del que crearemos contenedores en el siguiente paso.

### Paso 5 — Corre el contenedor

```bash
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
```

**Lo que verás:**

```
3f9a2b1c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a
```

**¿Qué pasó?** Creaste un **contenedor** (la instancia en ejecución, "el platillo") a partir de la imagen. `-d` lo deja en segundo plano y `-p 8080:8080` mapea el puerto del contenedor a tu máquina. La cadena larga es el ID del contenedor.

### Paso 6 — Pregúntale a la app si está viva

```bash
curl http://localhost:8080/health
```

**Lo que verás:**

```
{"status":"UP","store":"memory","db":"ok","uptime_s":8}
```

**¿Qué pasó?** La app respondió desde dentro del contenedor. `"store":"memory"` confirma que, sin `DB_HOST`, usa el almacén en memoria (perfecto para este Lab simple).

### Paso 7 — Verifica la versión

```bash
curl http://localhost:8080/version
```

**Lo que verás:**

```
{"name":"academia-devops-app","version":"1.0.0","node":"v22.22.3"}
```

**¿Qué pasó?** El endpoint `/version` reporta el nombre, la versión (el tag con que construiste) y la versión de Node **dentro** de la imagen. Útil para saber exactamente qué estás corriendo.

### Paso 8 — Confirma el HEALTHCHECK

```bash
docker ps
```

**Lo que verás:**

```
CONTAINER ID   IMAGE                       STATUS                   PORTS                    NAMES
3f9a2b1c8d7e   academia-devops-app:1.0.0   Up 20 seconds (healthy)  0.0.0.0:8080->8080/tcp   academia
```

**¿Qué pasó?** El `(healthy)` viene del `HEALTHCHECK` definido en el Dockerfile, que llama a `/health` cada 30s. Docker ahora **sabe** si tu app está sana, no solo si el proceso vive. Esa señal será clave en Kubernetes.

### Paso 9 — Abre la UI web

Abre en tu navegador: **http://localhost:8080/**

**Lo que verás:** una portada web con el listado de endpoints de la Academia DevOps App (¡no solo JSON!).

**¿Qué pasó?** La misma imagen sirve tanto la API como una interfaz web. Tienes una app real corriendo dentro de un contenedor que tú construiste.

## ✅ Checkpoint

Has completado el Lab 1 cuando:

- `npm test` muestra `# pass 8` / `# fail 0`.
- `docker images` lista `academia-devops-app:1.0.0` (~172 MB).
- `docker ps` muestra el contenedor `academia` en `Up ... (healthy)`.
- `curl http://localhost:8080/health` responde `{"status":"UP",...}` y la UI carga en el navegador.

**Evidencia para tu tarjeta de logros:** capturas de `docker ps` (con `(healthy)`) y de la respuesta de `/health`.

## 🧯 Si algo falla

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `Cannot connect to the Docker daemon` | Docker Desktop apagado | Abre Docker Desktop y espera la ballena 🐳 |
| `port is already allocated` | El puerto 8080 ya está ocupado | `docker rm -f academia` o usa `-p 8081:8080` |
| `npm ci` falla en el build | Falta `package-lock.json` | Corre `npm install` una vez (Paso 1) para generarlo |
| El contenedor arranca y muere | Error en el código o variable faltante | Revisa `docker logs academia` |
| `(health: starting)` y no pasa a `(healthy)` | Aún en el `start-period` de 5s | Espera unos segundos y repite `docker ps` |
| `curl: connection refused` | El contenedor aún arranca, o el puerto no se mapeó | Confirma `docker ps` y el `-p 8080:8080` |

¿Sigue fallando? → [`02-docker/comandos-docker.md`](../02-docker/comandos-docker.md)

## 🏆 Reto extra (+20 XP): compara con la imagen insegura

Construye la versión "mala" y mide la diferencia de tamaño:

```bash
# Desde 01-app/node/
docker build -f ../../02-docker/Dockerfile.insecure -t academia-app:inseguro .
docker images | grep academia
```

**Pregunta para clase:** ¿por qué pesa tanto más la imagen insegura? (Pista: imagen base completa vs `alpine`, herramientas de build que sobran, y dependencias de desarrollo incluidas.)

Cuando termines, limpia: `docker stop academia && docker rm academia`.

## 🎓 Cómo enseñarlo a tus alumnos

- **Ancla el concepto con la analogía receta/platillo:** la imagen es la receta (`docker build`), el contenedor es el platillo (`docker run`). Una receta → muchos platillos.
- **Haz que rompan algo a propósito:** que cambien el `-p` a `8081:8080` y descubran solos por qué `curl :8080` deja de responder. El error es el mejor profesor.
- **Lanza el reto de tamaño como competencia:** quien explique mejor *por qué* la imagen insegura pesa más, gana el +20 XP. Conecta directo con DevSecOps (Lab 4).
- **Muestra el HEALTHCHECK en vivo:** detén la app dentro del contenedor y deja que vean cómo Docker la marca como `unhealthy`. Aterriza "salud" como algo medible, no abstracto.

## ⏭️ Siguiente

➡️ **[Guía Lab 2 — app + PostgreSQL con Docker Compose](02-compose.md)** 🧩.
