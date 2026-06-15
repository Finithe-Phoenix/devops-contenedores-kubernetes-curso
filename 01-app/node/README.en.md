> 🌐 **English** · [Español](README.md)

# DevOps Academy App (Node.js) 🟢

A minimal REST API that we'll use throughout the ENTIRE course: we containerize it,
automate it, deploy it to Kubernetes, scale it, and monitor it.

> It's deliberately tiny. The interesting part isn't the app: it's **everything we
> do around it**.

## Endpoints

| Method | Route           | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/`             | Home page with the list of endpoints         |
| GET    | `/health`       | Health status (includes store connection)    |
| GET    | `/version`      | Name, version, and Node version              |
| GET    | `/metrics`      | Metrics in Prometheus format                 |
| GET    | `/courses`      | List of courses                              |
| GET    | `/courses/:id`  | A single course by id                        |
| POST   | `/courses`      | Creates a course (`{ code, name, professor }`) |
| DELETE | `/courses/:id`  | Deletes a course                             |

## Store configurable by environment (12-factor)

- **Without** `DB_HOST` → **in-memory** store (Lab 1, simple Docker).
- **With** `DB_HOST` → **PostgreSQL** (Lab 2 Compose and Kubernetes).

The **same image** works for both cases; only the environment variables change.

| Variable      | Default     | What it's for                 |
| ------------- | ----------- | ----------------------------- |
| `PORT`        | `8080`      | HTTP port                     |
| `APP_VERSION` | `1.0.0`     | Reported by `/version`        |
| `DB_HOST`     | _(empty)_   | If set, uses PostgreSQL       |
| `DB_PORT`     | `5432`      | PostgreSQL port               |
| `DB_NAME`     | `academia`  | Database                      |
| `DB_USER`     | `academia`  | User                          |
| `DB_PASSWORD` | `academia`  | Password                      |

## Running locally (without Docker)

```bash
npm install
npm start          # http://localhost:8080
npm test           # runs the tests
```

```bash
curl http://localhost:8080/health
curl http://localhost:8080/courses
curl -X POST http://localhost:8080/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"WEB-101","name":"Desarrollo Web","professor":"Ada Lovelace"}'
```

## Building and running with Docker

```bash
docker build -t academia-devops-app:1.0.0 .
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
curl http://localhost:8080/health
docker logs academia
```
