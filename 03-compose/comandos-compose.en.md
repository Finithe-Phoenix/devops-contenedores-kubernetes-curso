> 🌐 **English** · [Español](comandos-compose.md)

# 🧩 Lab 2 — Docker Compose: app + database

> **Mission:** bring up the app WITH its database in a single command.
> **Reward:** +120 XP and the 🧩 *Multi-Container Master* badge.

## Bring everything up

```bash
# From 03-compose/
docker compose up -d --build

docker compose ps                 # status of the services
docker compose logs -f app        # app logs
docker compose logs db            # database logs
```

## Verify the app talks to PostgreSQL

```bash
curl http://localhost:8080/health
# It should respond:  "store":"postgres" , "db":"ok"

curl http://localhost:8080/courses

# Create a course... and verify it PERSISTS after a restart
curl -X POST http://localhost:8080/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"REDES-101","name":"Redes de Computadoras","professor":"Vint Cerf"}'
```

## The star demo: persistence

```bash
docker compose restart app        # restarts ONLY the app
curl http://localhost:8080/courses # 👈 the new course is STILL there (it lives in the DB volume)
```

## Shut down

```bash
docker compose down               # stops and removes containers (KEEPS the volume)
docker compose down -v            # 👈 also DELETES the volume (data reset to zero)
```

## Key concepts you can "see" in this lab

- **Internal network:** the app finds the database by its service name (`db`), not by IP.
- **`depends_on: condition: service_healthy`:** the app waits for Postgres to be **healthy**.
- **`db_data` volume:** the data survives `down`/`up`; only `down -v` deletes it.
- **Same images, different config:** the app didn't change; we just gave it `DB_HOST`.

## ❗ Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | -------- |
| `/health` says `"db":"down"` | The app started before the DB | We already prevent this with `condition: service_healthy`; check credentials |
| `port 5432 already allocated` | You have a local PostgreSQL running | Shut it down or remove the `ports:` from the `db` service |
| Unexpected "old" data | The volume persisted | `docker compose down -v` to start clean |
| `app` can't resolve `db` | Typo in `DB_HOST` | It must be exactly the service name (`db`) |
