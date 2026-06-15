> 🌐 [English](README.en.md) · **Español**

# 🕵️ Reto 2 — Compose: la app no se conecta a la base de datos

**Capa:** 🧩 Docker Compose · **Dificultad:** ★★☆ · **Archivo roto:** [`docker-compose.yml`](docker-compose.yml)

## 🔬 Síntoma
Todo levanta (`docker compose ps` muestra ambos `Up`), pero la app **no habla con la base de datos**:

```bash
curl http://localhost:8080/health
# {"status":"UP","store":"postgres","db":"down", ...}

docker compose logs app
# ... getaddrinfo ENOTFOUND database / could not translate host name "database"
```

## 🎯 Tu misión
Hay **un solo bug**. Arréglalo y verifica que `/health` reporte `"db":"ok"`.

## 🧭 Pistas
<details><summary>Pista 1</summary>
La app intenta conectarse a un host por su nombre. ¿Ese nombre existe como <strong>servicio</strong> en el compose?
</details>
<details><summary>Pista 2</summary>
En Compose, el hostname de un servicio <strong>es el nombre del servicio</strong>. ¿Cómo se llama el servicio de Postgres aquí?
</details>

## ✅ Cómo verificar
```bash
cd retos/reto-2-compose
docker compose up -d --build
sleep 8
curl http://localhost:8080/health     # -> "db":"ok"
docker compose down -v
```

## 💡 Solución
<details><summary>👀 Ver la solución</summary>

El servicio de la base de datos se llama `db`, pero la app apunta a `DB_HOST: database`.
Cámbialo por:

```yaml
DB_HOST: db
```
</details>

## 🎓 Para tus alumnos
La **red interna** de Compose resuelve por **nombre de servicio**, no por IP. Pregunta de clase:
*¿por qué la app llama a la DB por nombre y no por una dirección IP fija?*
