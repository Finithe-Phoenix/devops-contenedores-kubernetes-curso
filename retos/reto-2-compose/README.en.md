> 🌐 **English** · [Español](README.md)

# 🕵️ Challenge 2 — Compose: the app can't reach the database

**Layer:** 🧩 Docker Compose · **Difficulty:** ★★☆ · **Broken file:** [`docker-compose.yml`](docker-compose.yml)

## 🔬 Symptom
Everything starts (`docker compose ps` shows both `Up`), but the app **can't talk to the database**:

```bash
curl http://localhost:8080/health
# {"status":"UP","store":"postgres","db":"down", ...}

docker compose logs app
# ... getaddrinfo ENOTFOUND database / could not translate host name "database"
```

## 🎯 Your mission
There is **exactly one bug**. Fix it and verify `/health` reports `"db":"ok"`.

## 🧭 Hints
<details><summary>Hint 1</summary>
The app tries to connect to a host by name. Does that name exist as a <strong>service</strong> in the compose file?
</details>
<details><summary>Hint 2</summary>
In Compose, a service's hostname <strong>is the service name</strong>. What is the Postgres service called here?
</details>

## ✅ How to verify
```bash
cd retos/reto-2-compose
docker compose up -d --build
sleep 8
curl http://localhost:8080/health     # -> "db":"ok"
docker compose down -v
```

## 💡 Solution
<details><summary>👀 Show the solution</summary>

The database service is named `db`, but the app points to `DB_HOST: database`.
Change it to:

```yaml
DB_HOST: db
```
</details>

## 🎓 For your students
Compose's **internal network** resolves by **service name**, not by IP. Class question:
*why does the app call the DB by name instead of a fixed IP address?*
