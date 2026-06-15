> 🌐 [English](README.en.md) · **Español**

# Academia DevOps App (Node.js) 🟢

API REST mínima que usaremos durante TODO el curso: la contenerizamos, la
automatizamos, la desplegamos en Kubernetes, la escalamos y la monitoreamos.

> Es deliberadamente pequeña. Lo interesante no es la app: es **todo lo que le
> hacemos alrededor**.

## Endpoints

| Método | Ruta            | Descripción                                  |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/`             | Portada con la lista de endpoints            |
| GET    | `/health`       | Estado de salud (incluye conexión al almacén)|
| GET    | `/version`      | Nombre, versión y versión de Node            |
| GET    | `/metrics`      | Métricas en formato Prometheus               |
| GET    | `/courses`      | Lista de cursos                              |
| GET    | `/courses/:id`  | Un curso por id                              |
| POST   | `/courses`      | Crea un curso (`{ code, name, professor }`)  |
| DELETE | `/courses/:id`  | Elimina un curso                             |

## Almacén configurable por entorno (12-factor)

- **Sin** `DB_HOST` → almacén **en memoria** (Lab 1, Docker simple).
- **Con** `DB_HOST` → **PostgreSQL** (Lab 2 Compose y Kubernetes).

La **misma imagen** sirve para ambos casos; solo cambian las variables de entorno.

| Variable      | Default     | Para qué sirve                |
| ------------- | ----------- | ----------------------------- |
| `PORT`        | `8080`      | Puerto HTTP                   |
| `APP_VERSION` | `1.0.0`     | Lo reporta `/version`         |
| `DB_HOST`     | _(vacío)_   | Si se define, usa PostgreSQL  |
| `DB_PORT`     | `5432`      | Puerto de PostgreSQL          |
| `DB_NAME`     | `academia`  | Base de datos                 |
| `DB_USER`     | `academia`  | Usuario                       |
| `DB_PASSWORD` | `academia`  | Contraseña                    |

## Correr en local (sin Docker)

```bash
npm install
npm start          # http://localhost:8080
npm test           # corre las pruebas
```

```bash
curl http://localhost:8080/health
curl http://localhost:8080/courses
curl -X POST http://localhost:8080/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"WEB-101","name":"Desarrollo Web","professor":"Ada Lovelace"}'
```

## Construir y correr con Docker

```bash
docker build -t academia-devops-app:1.0.0 .
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
curl http://localhost:8080/health
docker logs academia
```
